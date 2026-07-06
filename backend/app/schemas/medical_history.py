from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional

class MedicalHistoryBase(BaseModel):
    condition_name: str = Field(..., min_length=1)
    diagnosis_date: date
    treating_doctor: Optional[str] = None
    hospital: Optional[str] = None
    notes: Optional[str] = None
    is_chronic: bool = False
    is_active: bool = True

class MedicalHistoryCreate(MedicalHistoryBase):
    baby_id: str

class MedicalHistoryUpdate(BaseModel):
    condition_name: Optional[str] = None
    diagnosis_date: Optional[date] = None
    treating_doctor: Optional[str] = None
    hospital: Optional[str] = None
    notes: Optional[str] = None
    is_chronic: Optional[bool] = None
    is_active: Optional[bool] = None

class MedicalHistoryResponse(MedicalHistoryBase):
    id: str
    baby_id: str
    created_at: datetime

    class Config:
        from_attributes = True
