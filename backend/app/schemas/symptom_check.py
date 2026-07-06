from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SymptomCheckCreate(BaseModel):
    selected_symptom_ids: list[str]
    matched_disease_ids: list[str]
    is_emergency: bool
    highest_severity: str


class SymptomCheckResponse(BaseModel):
    id: str
    selected_symptom_ids: list[str]
    matched_disease_ids: list[str]
    selected_symptom_count: Optional[int] = None
    matched_disease_count: Optional[int] = None
    is_emergency: bool
    highest_severity: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedSymptomCheckHistoryResponse(BaseModel):
    items: list[SymptomCheckResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class CombinedHistoryItem(BaseModel):
    id: str
    check_type: str
    created_at: datetime
    detected_class: Optional[str] = None
    confidence: Optional[float] = None
    confidence_passed: bool = False
    input_method: Optional[str] = None
    selected_symptom_count: Optional[int] = None
    matched_disease_count: Optional[int] = None
    highest_severity: Optional[str] = None
    is_emergency: bool = False


class PaginatedCombinedHistoryResponse(BaseModel):
    items: list[CombinedHistoryItem]
    total: int
    page: int
    page_size: int
    total_pages: int
