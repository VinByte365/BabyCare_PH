from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate, NotificationResponse, UnreadCountResponse

router = APIRouter()


@router.get("/", response_model=List[NotificationResponse])
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 50,
):
    return (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/unread-count", response_model=UnreadCountResponse)
def unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    count = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id, Notification.is_read == False)
        .count()
    )
    return UnreadCountResponse(count=count)


@router.post("/", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(
    body: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = Notification(
        user_id=current_user.id,
        type=body.type,
        title=body.title,
        body=body.body,
        related_id=body.related_id,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.put("/{notif_id}/read", response_model=NotificationResponse)
def mark_read(
    notif_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        db.query(Notification)
        .filter(Notification.id == notif_id, Notification.user_id == current_user.id)
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="Notification not found")
    record.is_read = True
    db.commit()
    db.refresh(record)
    return record


@router.put("/read-all", status_code=status.HTTP_204_NO_CONTENT)
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(Notification).filter(
        Notification.user_id == current_user.id, Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
