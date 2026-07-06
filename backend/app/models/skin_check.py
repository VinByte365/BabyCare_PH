"""
 * BabyGuide PH — Skin Check Session DB Model
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Float, Text, func
from app.core.database import Base


class SkinCheckSession(Base):
    __tablename__ = "skin_check_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    input_method = Column(String, nullable=False)  # "camera" or "gallery"
    detected_class = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    confidence_passed = Column(String, nullable=False, default="false")
    disclaimer_acknowledged = Column(String, nullable=False, default="false")
    raw_image_path = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
