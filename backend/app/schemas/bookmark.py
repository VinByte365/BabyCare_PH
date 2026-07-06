from pydantic import BaseModel
from datetime import datetime


class BookmarkCreate(BaseModel):
    item_id: str
    item_type: str
    title: str


class BookmarkResponse(BaseModel):
    id: str
    item_id: str
    item_type: str
    title: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
