from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.donation import Donation
from models.donation_item import DonationItem
from models.inventory import Inventory
from schemas.donation import DonationCreate
from core.dependencies import admin_only   # 🔥 IMPORTANT

router = APIRouter()

# =========================
# CREATE DONATION
# =========================
@router.post("/donations")
def create_donation(data: DonationCreate, db: Session = Depends(get_db)):
    
    # create donation
    new_donation = Donation(donor_id=data.donor_id)
    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)

    # add items + update inventory
    for item in data.items:

        donation_item = DonationItem(
            donation_id=new_donation.id,
            item_name=item.item_name,
            quantity=item.quantity
        )
        db.add(donation_item)

        # update inventory
        existing_item = db.query(Inventory).filter(
            Inventory.item_name == item.item_name
        ).first()

        if existing_item:
            existing_item.quantity += item.quantity
        else:
            new_inventory = Inventory(
                item_name=item.item_name,
                quantity=item.quantity
            )
            db.add(new_inventory)

    db.commit()

    return {"message": "Donation created", "donation_id": new_donation.id}


# =========================
# APPROVE DONATION (ADMIN ONLY)
# =========================
@router.put("/donation/{id}/approve")
def approve_donation(
    id: int,
    db: Session = Depends(get_db),
    user = Depends(admin_only)   # 🔥 ADMIN ONLY
):
    donation = db.query(Donation).get(id)

    if not donation:
        return {"error": "Donation not found"}

    donation.status = "Approved"
    db.commit()

    return {"message": "Donation approved"}