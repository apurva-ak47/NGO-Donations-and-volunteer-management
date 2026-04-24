from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.dependencies import admin_only, get_current_user
from db.database import get_db
from models.donor import Donor
from models.user import User
from schemas.donor import DonorProfileUpdate

router = APIRouter()


@router.get("/donors")
def get_donors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "admin":
        return db.query(Donor).all()

    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    return [donor] if donor else []


@router.put("/donor/profile")
def update_my_donor_profile(
    data: DonorProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if not donor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donor profile not found")

    donor.name = data.name
    donor.phone = data.phone
    donor.address = data.address
    db.commit()
    db.refresh(donor)

    return {"message": "Donor profile updated", "id": donor.id}


@router.delete("/donors/{id}")
def delete_donor(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    donor = db.query(Donor).get(id)

    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")

    db.delete(donor)
    db.commit()

    return {"message": "Donor deleted", "deleted_by": current_user.email}
