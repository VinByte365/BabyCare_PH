import logging

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from app.models.bookmark import Bookmark
from app.schemas.bookmark import BookmarkCreate, BookmarkResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/", response_model=list[BookmarkResponse])
def list_bookmarks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve all bookmarks for the current user."""
    bookmarks = (
        db.query(Bookmark)
        .filter(Bookmark.user_id == current_user.id)
        .order_by(Bookmark.created_at.desc())
        .all()
    )
    return bookmarks


@router.post("/", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
def create_bookmark(
    payload: BookmarkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a bookmark for a care guide or disease entry."""
    existing = (
        db.query(Bookmark)
        .filter(
            Bookmark.user_id == current_user.id,
            Bookmark.item_id == payload.item_id,
            Bookmark.item_type == payload.item_type,
        )
        .first()
    )
    if existing:
        return existing

    bookmark = Bookmark(
        user_id=current_user.id,
        item_id=payload.item_id,
        item_type=payload.item_type,
        title=payload.title,
    )
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)
    return bookmark


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bookmark(
    item_id: str,
    item_type: str = Query(..., pattern="^(care_guide|disease)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a bookmark by item ID and type."""
    bookmark = (
        db.query(Bookmark)
        .filter(
            Bookmark.user_id == current_user.id,
            Bookmark.item_id == item_id,
            Bookmark.item_type == item_type,
        )
        .first()
    )
    if not bookmark:
        raise HTTPException(
            status_code=404,
            detail="Bookmark not found.",
        )
    db.delete(bookmark)
    db.commit()
