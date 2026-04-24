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
from schemas.donation import DonationCreate, DonationUsedCreate

router = APIRouter()


def get_donor_for_user(db: Session, user: User):
    donor = db.query(Donor).filter(Donor.user_id == user.id).first()
    if not donor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Linked donor profile not found")
    
    return donor


def serialize_donation(donation: Donation, db: Session):
    donor = db.query(Donor).filter(Donor.id == donation.donor_id).first()
    items = db.query(DonationItem).filter(DonationItem.donation_id == donation.id).all()
    item_ids = [item.id for item in items]
    usage_record = (
        db.query(DonationUsage)
        .filter(DonationUsage.donation_item_id.in_(item_ids))
        .order_by(DonationUsage.id.desc())
        .first()
        if item_ids
        else None
    )

    return {
        "id": donation.id,
        "donor_id": donation.donor_id,
        "donor_name": donor.name if donor else None,
        "donor_email": donor.email if donor else None,
        "status": donation.status,
        "created_at": donation.created_at,
        "usage": {
            "location": usage_record.location if usage_record else donation.usage_location,
            "description": usage_record.description if usage_record else donation.usage_description,
        } if usage_record or donation.usage_location or donation.usage_description else None,
        "items": [{"id": item.id, "item_name": item.item_name, "quantity": item.quantity} for item in items],
    }


@router.post("/donations")
def create_donation(
    data: DonationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    donor = get_donor_for_user(db, current_user)

    new_donation = Donation(donor_id=donor.id, status="Pending")
    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)

    for item in data.items:
        donation_item = DonationItem(
            donation_id=new_donation.id,
            item_name=item.item_name,
            quantity=item.quantity,
        )
        db.add(donation_item)

    db.commit()

    return {"message": "Donation created", "donation_id": new_donation.id, "status": new_donation.status}


@router.get("/donations")
def get_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Donation)

    if current_user.role != "admin":
        donor = get_donor_for_user(db, current_user)
        query = query.filter(Donation.donor_id == donor.id)

    return [serialize_donation(donation, db) for donation in query.all()]


ALLOWED_TRANSITIONS = {
    "Pending": {"Approved"},
    "Approved": {"In Transit"},
    "In Transit": {"Used"},
    "Used": set(),
}


def set_donation_status(id: int, next_status: str, db: Session):
    donation = db.query(Donation).get(id)

    if not donation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found")

    if next_status not in ALLOWED_TRANSITIONS.get(donation.status, set()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition: {donation.status} -> {next_status}",
        )

    donation.status = next_status
    db.commit()
    db.refresh(donation)
    return donation


@router.put("/donation/{id}/approve")
def approve_donation(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    donation = set_donation_status(id, "Approved", db)

    for item in db.query(DonationItem).filter(DonationItem.donation_id == donation.id).all():
        existing_item = db.query(Inventory).filter(Inventory.item_name == item.item_name).first()
        if existing_item:
            existing_item.quantity += item.quantity
        else:
            db.add(Inventory(item_name=item.item_name, quantity=item.quantity))

    db.commit()
    return {"message": "Donation approved", "id": donation.id, "updated_by": current_user.email}


@router.put("/donation/{id}/in-transit")
def mark_donation_in_transit(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    donation = set_donation_status(id, "In Transit", db)
    return {"message": "Donation marked in transit", "id": donation.id, "updated_by": current_user.email}


@router.put("/donation/{id}/transit")
def mark_donation_transit(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    donation = set_donation_status(id, "In Transit", db)
    return {"message": "Donation marked in transit", "id": donation.id, "updated_by": current_user.email}


@router.put("/donation/{id}/used")
def mark_donation_used(
    id: int,
    data: DonationUsedCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    donation = set_donation_status(id, "Used", db)
    donation_items = db.query(DonationItem).filter(DonationItem.donation_id == donation.id).all()

    for item in donation_items:
        inventory_item = db.query(Inventory).filter(Inventory.item_name == item.item_name).first()
        if not inventory_item or inventory_item.quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient inventory for {item.item_name}",
            )

        inventory_item.quantity -= item.quantity
        db.add(
            DonationUsage(
                donation_item_id=item.id,
                task_id=None,
                quantity_used=item.quantity,
                location=data.location,
                description=data.description,
            )
        )

    donation.usage_location = data.location
    donation.usage_description = data.description
    db.commit()

    return {
        "message": "Donation marked used",
        "id": donation.id,
        "location": donation.usage_location,
        "description": donation.usage_description,
        "updated_by": current_user.email,
    }
