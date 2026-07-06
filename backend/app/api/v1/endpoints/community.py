import logging

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func as sa_func

from app.core.database import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from app.models.community import CommunityPost, CommunityComment, PostLike
from app.schemas.community import (
    CommunityPostCreate,
    CommunityPostDetail,
    CommunityPostSummary,
    CommunityCommentCreate,
    CommunityCommentResponse,
    CommunityUserInfo,
    LikeToggleResponse,
    PaginatedCommunityPostsResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter()


ALLOWED_CATEGORIES = {"general", "feeding", "sleep", "health", "development", "vaccination"}


def _build_user_info(user: User) -> CommunityUserInfo:
    return CommunityUserInfo(
        id=user.id,
        name=f"{user.first_name} {user.last_name}",
        avatar_url=user.avatar_url,
        role=user.role,
        verified=user.role in ("professional", "moderator"),
    )


def _post_to_summary(post: CommunityPost, current_user_id: str, liked: bool = False) -> CommunityPostSummary:
    return CommunityPostSummary(
        id=post.id,
        user=_build_user_info(post.user),
        title=post.title,
        body=post.body,
        category=post.category,
        created_at=post.created_at,
        comment_count=post.comment_count,
        likes_count=post.likes_count,
        is_pinned=post.is_pinned,
        is_reviewed=post.is_reviewed,
        liked_by_current_user=liked,
    )


@router.get("/", response_model=PaginatedCommunityPostsResponse)
def list_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    category: str = Query(None, pattern=f"^({'|'.join(ALLOWED_CATEGORIES)})$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
):
    """List community posts with optional category filter and pagination."""
    query = db.query(CommunityPost).options(joinedload(CommunityPost.user))

    if category:
        query = query.filter(CommunityPost.category == category)

    total = query.count()
    total_pages = max(1, (total + page_size - 1) // page_size)
    skip = (page - 1) * page_size

    posts = (
        query
        .order_by(CommunityPost.is_pinned.desc(), CommunityPost.created_at.desc())
        .offset(skip)
        .limit(page_size)
        .all()
    )

    post_ids = [p.id for p in posts]
    if post_ids and current_user:
        like_rows = (
            db.query(PostLike)
            .filter(PostLike.post_id.in_(post_ids), PostLike.user_id == current_user.id)
            .all()
        )
        liked_post_ids = {lr.post_id for lr in like_rows}
    else:
        liked_post_ids = set()

    items = [
        _post_to_summary(p, current_user.id if current_user else "", liked=p.id in liked_post_ids)
        for p in posts
    ]

    return PaginatedCommunityPostsResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post("/", response_model=CommunityPostDetail, status_code=status.HTTP_201_CREATED)
def create_post(
    payload: CommunityPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new community post."""
    if payload.category not in ALLOWED_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid category. Must be one of: {', '.join(sorted(ALLOWED_CATEGORIES))}",
        )
    if len(payload.title.strip()) < 5:
        raise HTTPException(status_code=400, detail="Title must be at least 5 characters.")
    if len(payload.body.strip()) < 10:
        raise HTTPException(status_code=400, detail="Body must be at least 10 characters.")

    post = CommunityPost(
        user_id=current_user.id,
        title=payload.title.strip(),
        body=payload.body.strip(),
        category=payload.category,
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    return CommunityPostDetail(
        id=post.id,
        user=_build_user_info(post.user),
        title=post.title,
        body=post.body,
        category=post.category,
        created_at=post.created_at,
        updated_at=post.updated_at,
        comment_count=0,
        likes_count=0,
        is_pinned=False,
        is_reviewed=False,
        liked_by_current_user=False,
        comments=[],
    )


@router.get("/{post_id}", response_model=CommunityPostDetail)
def get_post(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single post with comments."""
    post = (
        db.query(CommunityPost)
        .options(joinedload(CommunityPost.user))
        .filter(CommunityPost.id == post_id)
        .first()
    )
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    liked = False
    if current_user:
        liked = db.query(PostLike).filter(
            PostLike.post_id == post.id,
            PostLike.user_id == current_user.id,
        ).first() is not None

    comments = (
        db.query(CommunityComment)
        .options(joinedload(CommunityComment.user))
        .filter(CommunityComment.post_id == post.id)
        .order_by(CommunityComment.created_at.asc())
        .all()
    )

    return CommunityPostDetail(
        id=post.id,
        user=_build_user_info(post.user),
        title=post.title,
        body=post.body,
        category=post.category,
        created_at=post.created_at,
        updated_at=post.updated_at,
        comment_count=post.comment_count,
        likes_count=post.likes_count,
        is_pinned=post.is_pinned,
        is_reviewed=post.is_reviewed,
        liked_by_current_user=liked,
        comments=[
            CommunityCommentResponse(
                id=c.id,
                post_id=c.post_id,
                user=_build_user_info(c.user),
                body=c.body,
                likes_count=c.likes_count,
                created_at=c.created_at,
            )
            for c in comments
        ],
    )


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete own post."""
    post = (
        db.query(CommunityPost)
        .filter(CommunityPost.id == post_id)
        .first()
    )
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own posts.")

    db.query(CommunityComment).filter(CommunityComment.post_id == post.id).delete()
    db.query(PostLike).filter(PostLike.post_id == post.id).delete()
    db.delete(post)
    db.commit()


@router.post("/{post_id}/comments", response_model=CommunityCommentResponse, status_code=status.HTTP_201_CREATED)
def add_comment(
    post_id: str,
    payload: CommunityCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a comment to a post."""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    if not payload.body.strip():
        raise HTTPException(status_code=400, detail="Comment body cannot be empty.")

    comment = CommunityComment(
        post_id=post.id,
        user_id=current_user.id,
        body=payload.body.strip(),
    )

    db.add(comment)
    post.comment_count = (
        db.query(sa_func.count(CommunityComment.id))
        .filter(CommunityComment.post_id == post.id)
        .scalar()
    ) + 1
    db.commit()
    db.refresh(comment)

    return CommunityCommentResponse(
        id=comment.id,
        post_id=comment.post_id,
        user=_build_user_info(current_user),
        body=comment.body,
        likes_count=comment.likes_count,
        created_at=comment.created_at,
    )


@router.delete("/{post_id}/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    post_id: str,
    comment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete own comment."""
    comment = (
        db.query(CommunityComment)
        .filter(CommunityComment.id == comment_id, CommunityComment.post_id == post_id)
        .first()
    )
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found.")
    if comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own comments.")

    db.delete(comment)
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if post and post.comment_count > 0:
        post.comment_count -= 1
    db.commit()


@router.post("/{post_id}/like", response_model=LikeToggleResponse)
def toggle_like(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Toggle like on a post."""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    existing = (
        db.query(PostLike)
        .filter(PostLike.post_id == post.id, PostLike.user_id == current_user.id)
        .first()
    )

    if existing:
        db.delete(existing)
        post.likes_count = max(0, post.likes_count - 1)
        db.commit()
        return LikeToggleResponse(liked=False, likes_count=post.likes_count)
    else:
        like = PostLike(post_id=post.id, user_id=current_user.id)
        db.add(like)
        post.likes_count += 1
        db.commit()
        return LikeToggleResponse(liked=True, likes_count=post.likes_count)
