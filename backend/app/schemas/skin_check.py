"""
 * BabyGuide PH — Skin Check Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SkinCheckResultRequest(BaseModel):
    input_method: str = Field(..., pattern="^(camera|gallery)$")
    disclaimer_acknowledged: bool = True


class SkinCheckResultResponse(BaseModel):
    id: str
    input_method: str
    detected_class: Optional[str] = None
    confidence: Optional[float] = None
    confidence_passed: bool
    disclaimer_acknowledged: bool
    predicted: bool
    created_at: datetime

    class Config:
        from_attributes = True


class SkinCheckHistoryResponse(BaseModel):
    id: str
    input_method: str
    detected_class: Optional[str] = None
    confidence: Optional[float] = None
    confidence_passed: bool
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedSkinCheckHistoryResponse(BaseModel):
    items: list[SkinCheckHistoryResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
