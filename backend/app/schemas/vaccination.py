from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional

class VaccinationBase(BaseModel):
    vaccine_name: str = Field(..., min_length=1)
    dose_number: Optional[int] = None
    date_administered: date
    administered_by: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    next_due_date: Optional[date] = None

class VaccinationCreate(VaccinationBase):
    baby_id: str

class VaccinationUpdate(BaseModel):
    vaccine_name: Optional[str] = None
    dose_number: Optional[int] = None
    date_administered: Optional[date] = None
    administered_by: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    next_due_date: Optional[date] = None

class VaccinationResponse(VaccinationBase):
    id: str
    baby_id: str
    created_at: datetime

    class Config:
        from_attributes = True
