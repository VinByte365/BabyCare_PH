"""
 * BabyGuide PH — Analytics Schemas
"""

from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class AnalyticsEventCreate(BaseModel):
    name: str
    timestamp: str
    metadata: Optional[dict[str, Any]] = None


class AnalyticsEventBatch(BaseModel):
    events: list[AnalyticsEventCreate]


class AnalyticsEventResponse(BaseModel):
    id: str
    event_name: str
    timestamp: datetime
    metadata_json: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
