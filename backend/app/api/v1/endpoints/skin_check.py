"""
 * BabyGuide PH — Skin Check (Computer Vision) Endpoints
 *
 * Inference endpoint loads best.pt (YOLO model) and classifies
 * uploaded skin images into: Measles, Heat Rash, Chickenpox,
 * Eczema, or Normal Skin.
 *
 * The model file is expected at model/best.pt relative to the
 * project root (one level up from backend/).
"""

import os
import logging
from typing import Optional

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from app.models.skin_check import SkinCheckSession
from app.schemas.skin_check import (
    SkinCheckResultResponse,
    SkinCheckHistoryResponse,
    PaginatedSkinCheckHistoryResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter()

# ── Model Loading ────────────────────────────────────────
_model = None


def get_model():
    global _model
    if _model is not None:
        return _model
    # Locate model file relative to project root
    model_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))),
        "model",
        "best.pt",
    )
    if not os.path.exists(model_path):
        logger.warning(f"Model not found at {model_path}. Inference will be unavailable.")
        return None
    try:
        from ultralytics import YOLO
        _model = YOLO(model_path)
        logger.info(f"Model loaded from {model_path}")
        return _model
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        return None


# ── Skin Condition Content ──────────────────────────────

# ── Model Class Name Normalization ──────────────────────
#
# The YOLO model was trained with specific class-name casing and
# punctuation. This mapping normalises every possible model output
# to the canonical keys used in SKIN_CONDITION_CONTENT below.
CLASS_NAME_NORMALIZATION = {
    "Chickenpox": "Chickenpox",
    "chickenpox": "Chickenpox",
    "Heat-Rash": "Heat Rash",
    "eczema": "Eczema",
    "measles": "Measles",
    "normal skin": "Normal Skin",
}

SKIN_CONDITION_CONTENT = {
    "Measles": {
        "name": "Measles",
        "description": "Measles is a highly contagious viral infection that causes a distinctive red rash and fever. It can be serious in young infants.",
        "severity": "urgent",
        "recommendation": "Consult a pediatrician immediately. Measles can lead to serious complications in infants, including pneumonia and encephalitis.",
        "when_to_seek_care": "Seek medical attention within 24 hours. If your baby has high fever, difficulty breathing, or seems extremely lethargic, go to the emergency room.",
        "home_care": "Keep your baby comfortable, offer frequent feeds to prevent dehydration, and monitor temperature. Isolate from other children to prevent spread.",
        "disclaimer": "This screening result is a preliminary assessment only and is not a medical diagnosis. Measles requires clinical confirmation by a healthcare professional.",
    },
    "Heat Rash": {
        "name": "Heat Rash (Miliaria)",
        "description": "Heat rash, also known as prickly heat or miliaria, is a common skin condition caused by blocked sweat glands. It appears as tiny red bumps or clear blisters, often in skin folds.",
        "severity": "low",
        "recommendation": "Heat rash usually resolves on its own with cooling measures. No specific medical treatment is needed.",
        "when_to_seek_care": "No urgent care needed. Consult your pediatrician if the rash persists for more than a few days, appears infected, or your baby develops a fever.",
        "home_care": "Move your baby to a cool, shaded area. Dress in loose, lightweight cotton clothing. Keep the affected skin dry and clean. Avoid heavy creams or ointments that can block sweat glands. Give your baby a cool bath and let the skin air dry.",
        "disclaimer": "This screening result is a preliminary assessment only and is not a medical diagnosis. Consult a pediatrician if you are unsure or if symptoms persist.",
    },
    "Chickenpox": {
        "name": "Chickenpox (Varicella)",
        "description": "Chickenpox is a highly contagious viral infection characterized by an itchy, blister-like rash. The blisters go through stages: red bumps, fluid-filled blisters, crusts, and scabs.",
        "severity": "moderate",
        "recommendation": "Consult a pediatrician for guidance. Most cases resolve on their own, but treatment may help reduce severity and prevent complications.",
        "when_to_seek_care": "Contact your pediatrician within 24-48 hours. Seek emergency care if your baby has high fever, difficulty breathing, seems extremely sleepy, or if the skin around blisters becomes red, warm, or painful (signs of infection).",
        "home_care": "Keep your baby's nails short to prevent scratching. Dress in soft, breathable clothing. Give lukewarm baths with baking soda or colloidal oatmeal to soothe itching. Offer plenty of fluids. Do not give aspirin to children.",
        "disclaimer": "This screening result is a preliminary assessment only and is not a medical diagnosis. Chickenpox requires clinical confirmation by a healthcare professional.",
    },
    "Eczema": {
        "name": "Eczema (Atopic Dermatitis)",
        "description": "Eczema is a common skin condition that causes dry, itchy, inflamed patches on the skin. It often appears on the face, cheeks, elbows, and knees.",
        "severity": "low",
        "recommendation": "Eczema is managed with regular moisturizing and avoidance of triggers. Consult your pediatrician for a treatment plan if the rash is bothersome.",
        "when_to_seek_care": "No urgent care needed. Consult your pediatrician at your next visit if the rash persists, causes discomfort, or appears infected (yellow crusting, oozing, spreading redness).",
        "home_care": "Apply fragrance-free moisturizer immediately after baths. Use lukewarm water for bathing. Pat skin dry — do not rub. Dress your baby in soft cotton clothing. Keep the room temperature cool. Avoid harsh soaps and detergents.",
        "disclaimer": "This screening result is a preliminary assessment only and is not a medical diagnosis. Eczema can be managed with proper skin care; consult your pediatrician for a personalized plan.",
    },
    "Normal Skin": {
        "name": "Normal Skin",
        "description": "The image analysis did not detect signs of the skin conditions screened for. Your baby's skin appears within normal range based on the provided image.",
        "severity": "low",
        "recommendation": "No action needed. Continue your regular skin care routine. Always monitor your baby's skin for any new or changing spots and consult your pediatrician if you have concerns.",
        "when_to_seek_care": "No urgent care needed. Consult your pediatrician at your next regular checkup if you have any questions about your baby's skin health.",
        "home_care": "Continue regular gentle skin care: use mild, fragrance-free products, keep skin clean and dry, dress in soft fabrics, and protect from direct sun exposure.",
        "disclaimer": "This screening result is a preliminary assessment only and is not a medical diagnosis. Normal results do not rule out all possible skin conditions. Always consult a healthcare professional for medical concerns.",
    },
}

CONFIDENCE_THRESHOLD = 0.3

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_IMAGE_SIZE_MB = 10


@router.post("/predict", response_model=dict)
async def predict_skin_condition(
    file: UploadFile = File(...),
    input_method: str = Query("camera", pattern="^(camera|gallery)$"),
    disclaimer_acknowledged: bool = Query(True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload a skin image for computer vision-based screening.
    Returns the detected skin condition, confidence score, and
    parent-friendly guidance.
    """
    # Validate file extension
    ext = os.path.splitext(file.filename or "image.jpg")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Please upload a JPG, PNG, or WebP image.",
        )

    # Read file contents
    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Image too large. Maximum size is {MAX_IMAGE_SIZE_MB}MB.",
        )

    # Run inference
    model = get_model()
    detected_class: Optional[str] = None
    confidence: Optional[float] = None
    confidence_passed = False
    predicted = False

    if model is not None:
        try:
            from PIL import Image
            import io

            image = Image.open(io.BytesIO(contents)).convert("RGB")
            results = model(image)

            if results and len(results) > 0:
                result = results[0]
                if result.probs is not None:
                    # Classification model
                    probs = result.probs
                    class_idx = int(probs.top1)
                    confidence = float(probs.top1conf)
                    class_names = result.names
                    raw_class = class_names.get(class_idx, None)
                    detected_class = CLASS_NAME_NORMALIZATION.get(raw_class, raw_class) if raw_class else None
                    confidence_passed = confidence >= CONFIDENCE_THRESHOLD
                    predicted = confidence_passed
                elif result.boxes is not None and len(result.boxes) > 0:
                    # Detection model — take highest confidence box
                    boxes = result.boxes
                    max_conf_idx = int(boxes.conf.argmax())
                    confidence = float(boxes.conf[max_conf_idx])
                    class_idx = int(boxes.cls[max_conf_idx])
                    class_names = result.names
                    raw_class = class_names.get(class_idx, None)
                    detected_class = CLASS_NAME_NORMALIZATION.get(raw_class, raw_class) if raw_class else None
                    confidence_passed = confidence >= CONFIDENCE_THRESHOLD
                    predicted = confidence_passed
        except Exception as e:
            logger.error(f"Inference error: {e}")
            # If inference fails, return a generic error rather than crashing
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred during image analysis. Please try again.",
            )
    else:
        # No model loaded — return unavailable
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Skin analysis service is currently unavailable. Please try again later.",
        )

    # Determine output
    condition_content = None
    if predicted and detected_class and detected_class in SKIN_CONDITION_CONTENT:
        condition_content = SKIN_CONDITION_CONTENT[detected_class]

    # Save session to database
    session = SkinCheckSession(
        user_id=current_user.id,
        input_method=input_method,
        detected_class=detected_class if predicted else None,
        confidence=confidence,
        confidence_passed="true" if confidence_passed else "false",
        disclaimer_acknowledged="true" if disclaimer_acknowledged else "false",
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Build response
    if not predicted:
        return {
            "predicted": False,
            "detected_class": None,
            "confidence": confidence,
            "confidence_passed": False,
            "message": "Unable to detect the skin condition. Please try again using a clearer image with good lighting and ensure the affected skin area is fully visible.",
            "session_id": session.id,
            "condition_content": None,
        }

    if condition_content:
        return {
            "predicted": True,
            "detected_class": detected_class,
            "confidence": confidence,
            "confidence_passed": True,
            "session_id": session.id,
            "condition_content": condition_content,
        }

    # Detected class doesn't have mapped content — still return basic info
    return {
        "predicted": True,
        "detected_class": detected_class,
        "confidence": confidence,
        "confidence_passed": True,
        "session_id": session.id,
        "condition_content": None,
    }


@router.get("/history", response_model=PaginatedSkinCheckHistoryResponse)
def read_skin_check_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
):
    """Retrieve paginated skin check history for the current user."""
    total = (
        db.query(SkinCheckSession)
        .filter(SkinCheckSession.user_id == current_user.id)
        .count()
    )
    total_pages = max(1, (total + page_size - 1) // page_size)
    skip = (page - 1) * page_size

    sessions = (
        db.query(SkinCheckSession)
        .filter(SkinCheckSession.user_id == current_user.id)
        .order_by(SkinCheckSession.created_at.desc())
        .offset(skip)
        .limit(page_size)
        .all()
    )

    items = []
    for s in sessions:
        items.append({
            "id": s.id,
            "input_method": s.input_method,
            "detected_class": s.detected_class,
            "confidence": s.confidence,
            "confidence_passed": s.confidence_passed == "true",
            "created_at": s.created_at,
        })

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


@router.get("/history/{session_id}", response_model=SkinCheckResultResponse)
def read_skin_check_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve details of a specific skin check session."""
    session = (
        db.query(SkinCheckSession)
        .filter(
            SkinCheckSession.id == session_id,
            SkinCheckSession.user_id == current_user.id,
        )
        .first()
    )
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Skin check session not found or access denied.",
        )
    return {
        "id": session.id,
        "input_method": session.input_method,
        "detected_class": session.detected_class,
        "confidence": session.confidence,
        "confidence_passed": session.confidence_passed == "true",
        "disclaimer_acknowledged": session.disclaimer_acknowledged == "true",
        "predicted": session.confidence_passed == "true" and session.detected_class is not None,
        "created_at": session.created_at,
    }
