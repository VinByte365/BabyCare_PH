"""
 * BabyGuide PH — Baby Profiles Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from app.models.baby import Baby
from app.schemas.baby import BabyCreate, BabyResponse, BabyUpdate

router = APIRouter()

@router.get("/", response_model=List[BabyResponse])
def read_babies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    """Retrieve baby profiles linked to this parent account"""
    return (
        db.query(Baby)
        .filter(Baby.parent_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )

@router.post("/", response_model=BabyResponse, status_code=status.HTTP_201_CREATED)
def create_baby(
    baby_in: BabyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Register/add a baby profile under the current parent user account"""
    baby = Baby(
        name=baby_in.name,
        date_of_birth=baby_in.date_of_birth,
        sex=baby_in.sex,
        parent_id=current_user.id,
    )
    db.add(baby)
    db.commit()
    db.refresh(baby)
    return baby

@router.get("/{baby_id}", response_model=BabyResponse)
def read_baby_by_id(
    baby_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve details of a specific baby profile"""
    baby = (
        db.query(Baby)
        .filter(Baby.id == baby_id, Baby.parent_id == current_user.id)
        .first()
    )
    if not baby:
        raise HTTPException(
            status_code=404, detail="Baby profile not found or access denied"
        )
    return baby

@router.put("/{baby_id}", response_model=BabyResponse)
def update_baby(
    baby_id: str,
    baby_in: BabyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update details of a baby profile"""
    baby = (
        db.query(Baby)
        .filter(Baby.id == baby_id, Baby.parent_id == current_user.id)
        .first()
    )
    if not baby:
        raise HTTPException(
            status_code=404, detail="Baby profile not found or access denied"
        )
    
    update_data = baby_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(baby, field, value)
        
    db.add(baby)
    db.commit()
    db.refresh(baby)
    return baby

@router.delete("/{baby_id}", response_model=BabyResponse)
def delete_baby(
    baby_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a baby profile"""
    baby = (
        db.query(Baby)
        .filter(Baby.id == baby_id, Baby.parent_id == current_user.id)
        .first()
    )
    if not baby:
        raise HTTPException(
            status_code=404, detail="Baby profile not found or access denied"
        )
    deleted_baby = BabyResponse.model_validate(baby)
    db.delete(baby)
    db.commit()
    return deleted_baby
