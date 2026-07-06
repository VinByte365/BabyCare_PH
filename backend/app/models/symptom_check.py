import uuid
from sqlalchemy import Column, String, DateTime, Integer, Text, func
from app.core.database import Base


class SymptomCheckSession(Base):
    __tablename__ = "symptom_check_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    selected_symptom_ids = Column(Text, nullable=True)
    matched_disease_ids = Column(Text, nullable=True)
    selected_symptom_count = Column(Integer, nullable=True)
    matched_disease_count = Column(Integer, nullable=True)
    is_emergency = Column(String, nullable=False, default="false")
    highest_severity = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
