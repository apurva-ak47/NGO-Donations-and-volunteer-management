from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.donor import Donor
from models.donation import Donation
from models.inventory import Inventory

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    total_donors = db.query(Donor).count()
    total_donations = db.query(Donation).count()
    total_inventory = db.query(Inventory).count()

    return {
        "total_donors": total_donors,
        "total_donations": total_donations,
        "total_inventory": total_inventory
    }