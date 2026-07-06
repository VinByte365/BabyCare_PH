import uuid
from sqlalchemy import Column, String, DateTime, UniqueConstraint, func
from app.core.database import Base


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    item_id = Column(String, nullable=False)
    item_type = Column(String, nullable=False)
    title = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "item_id", "item_type", name="uq_user_bookmark"),
    )
