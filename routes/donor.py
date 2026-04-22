from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.donor import Donor
from schemas.donor import DonorCreate
from core.dependencies import get_current_user   # 🔥 NEW

router = APIRouter()

# 🔐 CREATE DONOR (PROTECTED)
@router.post("/donors")
def create_donor(
    donor: DonorCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)   # 🔥 PROTECTION ADDED
):
    new_donor = Donor(
        name=donor.name,
        email=donor.email,
        phone=donor.phone,
        address=donor.address
    )

    db.add(new_donor)
    db.commit()
    db.refresh(new_donor)

    return {
        "message": "Donor created",
        "id": new_donor.id,
        "created_by": current_user.email   # optional (nice touch)
    }


# GET ALL DONORS (optional: keep public OR protect later)
@router.get("/donors")
def get_donors(db: Session = Depends(get_db)):
    donors = db.query(Donor).all()
    return donors