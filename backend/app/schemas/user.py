"""
 * BabyGuide PH — User Schemas
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    role: str = Field(default="parent", pattern="^(parent|professional|moderator)$")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    avatar_url: Optional[str] = None

class UserInDBBase(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserResponse(UserInDBBase):
    pass
