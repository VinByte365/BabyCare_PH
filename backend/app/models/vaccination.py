import uuid
from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Vaccination(Base):
    __tablename__ = "vaccinations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    baby_id = Column(String, ForeignKey("babies.id", ondelete="CASCADE"), nullable=False)
    vaccine_name = Column(String, nullable=False)
    dose_number = Column(Integer, nullable=True)
    date_administered = Column(Date, nullable=False)
    administered_by = Column(String, nullable=True)
    location = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    next_due_date = Column(Date, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    baby = relationship("Baby", backref="vaccinations")
