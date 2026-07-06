import uuid
from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    body = Column(String, nullable=False)
    category = Column(String, nullable=False)
    is_pinned = Column(Boolean, default=False)
    is_reviewed = Column(Boolean, default=False)
    likes_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", lazy="joined")


class CommunityComment(Base):
    __tablename__ = "community_comments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    post_id = Column(String, ForeignKey("community_posts.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    body = Column(String, nullable=False)
    likes_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", lazy="joined")


class PostLike(Base):
    __tablename__ = "post_likes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    post_id = Column(String, ForeignKey("community_posts.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("post_id", "user_id", name="uq_post_like"),
    )
