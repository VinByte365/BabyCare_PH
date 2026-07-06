import json
import logging
from decimal import Decimal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from app.schemas.symptom_check import (
    CombinedHistoryItem,
    PaginatedCombinedHistoryResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/all", response_model=PaginatedCombinedHistoryResponse)
def read_combined_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
):
    """Retrieve paginated unified history (skin + symptom checks)."""
    user_id = current_user.id

    count_sql = text("""
        SELECT COUNT(*) as total FROM (
            SELECT id FROM skin_check_sessions WHERE user_id = :uid
            UNION ALL
            SELECT id FROM symptom_check_sessions WHERE user_id = :uid
        ) combined
    """)
    total_result = db.execute(count_sql, {"uid": user_id}).scalar()
    total = total_result if total_result else 0
    total_pages = max(1, (total + page_size - 1) // page_size)
    skip = (page - 1) * page_size

    query_sql = text("""
        SELECT
            id,
            'skin' AS check_type,
            created_at,
            detected_class,
            confidence,
            confidence_passed,
            input_method,
            NULL AS selected_symptom_count,
            NULL AS matched_disease_count,
            NULL AS highest_severity,
            'false' AS is_emergency
        FROM skin_check_sessions
        WHERE user_id = :uid
        UNION ALL
        SELECT
            id,
            'symptom' AS check_type,
            created_at,
            NULL AS detected_class,
            NULL AS confidence,
            is_emergency AS confidence_passed,
            NULL AS input_method,
            selected_symptom_count,
            matched_disease_count,
            highest_severity,
            is_emergency
        FROM symptom_check_sessions
        WHERE user_id = :uid
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :skip
    """)

    rows = db.execute(query_sql, {"uid": user_id, "limit": page_size, "skip": skip}).fetchall()

    items = []
    for row in rows:
        row_dict = dict(row._mapping)
        confidence = row_dict.get("confidence")
        if confidence is not None and isinstance(confidence, Decimal):
            confidence = float(confidence)
        confidence_passed_str = row_dict.get("confidence_passed") or "false"
        is_emergency_str = row_dict.get("is_emergency") or "false"

        items.append(CombinedHistoryItem(
            id=row_dict["id"],
            check_type=row_dict["check_type"],
            created_at=row_dict["created_at"],
            detected_class=row_dict.get("detected_class"),
            confidence=confidence,
            confidence_passed=confidence_passed_str == "true",
            input_method=row_dict.get("input_method"),
            selected_symptom_count=row_dict.get("selected_symptom_count"),
            matched_disease_count=row_dict.get("matched_disease_count"),
            highest_severity=row_dict.get("highest_severity"),
            is_emergency=is_emergency_str == "true",
        ))

    return PaginatedCombinedHistoryResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )
