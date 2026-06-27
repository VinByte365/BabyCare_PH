"""
 * BabyGuide PH — Baby Schemas
"""

from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional

class BabyBase(BaseModel):
    name: str = Field(..., min_length=1)
    date_of_birth: date
    sex: str = Field(..., pattern="^(male|female)$")

class BabyCreate(BabyBase):
    pass

class BabyUpdate(BaseModel):
    name: Optional[str] = None
    date_of_birth: Optional[date] = None
    sex: Optional[str] = Field(default=None, pattern="^(male|female)$")

class BabyResponse(BabyBase):
    id: str
    parent_id: str
    created_at: datetime

    class Config:
        from_attributes = True
