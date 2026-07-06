import json
import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from app.models.symptom_check import SymptomCheckSession
from app.schemas.symptom_check import (
    SymptomCheckCreate,
    SymptomCheckResponse,
    PaginatedSymptomCheckHistoryResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/", response_model=SymptomCheckResponse, status_code=status.HTTP_201_CREATED)
def create_symptom_check(
    payload: SymptomCheckCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Save a symptom check session result."""
    session = SymptomCheckSession(
        user_id=current_user.id,
        selected_symptom_ids=json.dumps(payload.selected_symptom_ids),
        matched_disease_ids=json.dumps(payload.matched_disease_ids),
        selected_symptom_count=len(payload.selected_symptom_ids),
        matched_disease_count=len(payload.matched_disease_ids),
        is_emergency="true" if payload.is_emergency else "false",
        highest_severity=payload.highest_severity,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "id": session.id,
        "selected_symptom_ids": json.loads(session.selected_symptom_ids) if session.selected_symptom_ids else [],
        "matched_disease_ids": json.loads(session.matched_disease_ids) if session.matched_disease_ids else [],
        "selected_symptom_count": session.selected_symptom_count,
        "matched_disease_count": session.matched_disease_count,
        "is_emergency": session.is_emergency == "true",
        "highest_severity": session.highest_severity,
        "created_at": session.created_at,
    }


@router.get("/history", response_model=PaginatedSymptomCheckHistoryResponse)
def read_symptom_check_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
):
    """Retrieve paginated symptom check history for the current user."""
    total = (
        db.query(SymptomCheckSession)
        .filter(SymptomCheckSession.user_id == current_user.id)
        .count()
    )
    total_pages = max(1, (total + page_size - 1) // page_size)
    skip = (page - 1) * page_size

    sessions = (
        db.query(SymptomCheckSession)
        .filter(SymptomCheckSession.user_id == current_user.id)
        .order_by(SymptomCheckSession.created_at.desc())
        .offset(skip)
        .limit(page_size)
        .all()
    )

    items = []
    for s in sessions:
        items.append({
            "id": s.id,
            "selected_symptom_ids": json.loads(s.selected_symptom_ids) if s.selected_symptom_ids else [],
            "matched_disease_ids": json.loads(s.matched_disease_ids) if s.matched_disease_ids else [],
            "selected_symptom_count": s.selected_symptom_count,
            "matched_disease_count": s.matched_disease_count,
            "is_emergency": s.is_emergency == "true",
            "highest_severity": s.highest_severity,
            "created_at": s.created_at,
        })

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


@router.get("/{session_id}", response_model=SymptomCheckResponse)
def read_symptom_check_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve a specific symptom check session."""
    session = (
        db.query(SymptomCheckSession)
        .filter(
            SymptomCheckSession.id == session_id,
            SymptomCheckSession.user_id == current_user.id,
        )
        .first()
    )
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Symptom check session not found or access denied.",
        )
    return {
        "id": session.id,
        "selected_symptom_ids": json.loads(session.selected_symptom_ids) if session.selected_symptom_ids else [],
        "matched_disease_ids": json.loads(session.matched_disease_ids) if session.matched_disease_ids else [],
        "selected_symptom_count": session.selected_symptom_count,
        "matched_disease_count": session.matched_disease_count,
        "is_emergency": session.is_emergency == "true",
        "highest_severity": session.highest_severity,
        "created_at": session.created_at,
    }
