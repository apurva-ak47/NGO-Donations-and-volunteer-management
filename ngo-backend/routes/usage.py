from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.dependencies import admin_only, get_current_user
from db.database import get_db
from models.donation import Donation
from models.donation_item import DonationItem
from models.donation_usage import DonationUsage
from models.donor import Donor
from models.inventory import Inventory
from models.user import User
from schemas.usage import UsageCreate

router = APIRouter()


@router.post("/usage")
def use_item(
    data: UsageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    donation_item = db.query(DonationItem).filter(DonationItem.id == data.donation_item_id).first()
    if not donation_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donation item not found")

    usage = DonationUsage(
        donation_item_id=data.donation_item_id,
        task_id=data.task_id,
        quantity_used=data.quantity_used,
        location=data.location,
        description=data.description,
    )
    db.add(usage)

    item = db.query(Inventory).filter(Inventory.item_name == donation_item.item_name).first()
    if item:
        if item.quantity < data.quantity_used:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient inventory")
        item.quantity -= data.quantity_used

    db.commit()

    return {"message": "Usage recorded", "created_by": current_user.email}


@router.get("/usage/{donation_id}")
def get_usage_for_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found")

    donor = db.query(Donor).filter(Donor.id == donation.donor_id).first()
    if current_user.role != "admin":
        if not donor or donor.email != current_user.email:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed to view this donation usage")

    donation_items = db.query(DonationItem).filter(DonationItem.donation_id == donation.id).all()
    item_ids = [item.id for item in donation_items]

    if not item_ids:
        return {"donation_id": donation.id, "usage": None}

    usage_records = (
        db.query(DonationUsage)
        .filter(DonationUsage.donation_item_id.in_(item_ids))
        .order_by(DonationUsage.id.desc())
        .all()
    )

    if not usage_records:
        return {"donation_id": donation.id, "usage": None}

    latest = usage_records[0]
    return {
        "donation_id": donation.id,
        "usage": {
            "location": latest.location,
            "description": latest.description,
            "records": [
                {
                    "id": record.id,
                    "donation_item_id": record.donation_item_id,
                    "quantity_used": record.quantity_used,
                    "location": record.location,
                    "description": record.description,
                }
                for record in usage_records
            ],
        },
    }
