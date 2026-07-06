from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationCreate(BaseModel):
    type: str
    title: str
    body: Optional[str] = None
    related_id: Optional[str] = None

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    type: str
    title: str
    body: Optional[str] = None
    related_id: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UnreadCountResponse(BaseModel):
    count: int
