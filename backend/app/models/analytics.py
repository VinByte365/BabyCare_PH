"""
 * BabyGuide PH — Analytics Event DB Model
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, func
from app.core.database import Base


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    event_name = Column(String, nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    metadata_json = Column(Text, nullable=True)  # JSON string
    session_id = Column(String, nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
