import uuid
from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Boolean, Text, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class MedicalHistory(Base):
    __tablename__ = "medical_history"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    baby_id = Column(String, ForeignKey("babies.id", ondelete="CASCADE"), nullable=False)
    condition_name = Column(String, nullable=False)
    diagnosis_date = Column(Date, nullable=False)
    treating_doctor = Column(String, nullable=True)
    hospital = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    is_chronic = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    baby = relationship("Baby", backref="medical_history")
