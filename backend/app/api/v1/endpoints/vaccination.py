from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from app.models.baby import Baby
from app.models.vaccination import Vaccination
from app.schemas.vaccination import VaccinationCreate, VaccinationUpdate, VaccinationResponse

router = APIRouter()

def _get_baby_or_404(baby_id: str, db: Session, user_id: str) -> Baby:
    baby = db.query(Baby).filter(Baby.id == baby_id, Baby.parent_id == user_id).first()
    if not baby:
        raise HTTPException(status_code=404, detail="Baby not found or access denied")
    return baby


@router.get("/", response_model=List[VaccinationResponse])
def list_vaccinations(
    baby_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_baby_or_404(baby_id, db, current_user.id)
    return (
        db.query(Vaccination)
        .filter(Vaccination.baby_id == baby_id)
        .order_by(Vaccination.date_administered.desc())
        .all()
    )


@router.post("/", response_model=VaccinationResponse, status_code=status.HTTP_201_CREATED)
def create_vaccination(
    body: VaccinationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_baby_or_404(body.baby_id, db, current_user.id)
    record = Vaccination(**body.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/{record_id}", response_model=VaccinationResponse)
def get_vaccination(
    record_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(Vaccination).filter(Vaccination.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    _get_baby_or_404(record.baby_id, db, current_user.id)
    return record


@router.put("/{record_id}", response_model=VaccinationResponse)
def update_vaccination(
    record_id: str,
    body: VaccinationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(Vaccination).filter(Vaccination.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    _get_baby_or_404(record.baby_id, db, current_user.id)

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)

    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vaccination(
    record_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(Vaccination).filter(Vaccination.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    _get_baby_or_404(record.baby_id, db, current_user.id)
    db.delete(record)
    db.commit()
