from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.donation import Donation
from models.donation_item import DonationItem
from models.donation_usage import DonationUsage

router = APIRouter()

@router.get("/donor-report/{donor_id}")
def donor_report(donor_id: int, db: Session = Depends(get_db)):

    # get all donations of donor
    donations = db.query(Donation).filter(
        Donation.donor_id == donor_id
    ).all()

    total_donated = 0
    total_used = 0

    for donation in donations:
        items = db.query(DonationItem).filter(
            DonationItem.donation_id == donation.id
        ).all()

        for item in items:
            total_donated += item.quantity

            usage = db.query(DonationUsage).filter(
                DonationUsage.donation_item_id == item.id
            ).all()

            for u in usage:
                total_used += u.quantity_used

    return {
        "total_donated": total_donated,
        "total_used": total_used,
        "remaining": total_donated - total_used
    }