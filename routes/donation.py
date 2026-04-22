from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.donation import Donation
from models.donation_item import DonationItem
from models.inventory import Inventory
from schemas.donation import DonationCreate

router = APIRouter()

@router.post("/donations")
def create_donation(data: DonationCreate, db: Session = Depends(get_db)):
    
    # create donation
    new_donation = Donation(donor_id=data.donor_id)
    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)

    # add items + update inventory
    for item in data.items:

        # save donation item
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