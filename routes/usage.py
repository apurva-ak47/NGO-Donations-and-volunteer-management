from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.donation_usage import DonationUsage
from models.inventory import Inventory
from schemas.usage import UsageCreate

router = APIRouter()

@router.post("/usage")
def use_item(data: UsageCreate, db: Session = Depends(get_db)):

    # save usage
    usage = DonationUsage(
        donation_item_id=data.donation_item_id,
        task_id=data.task_id,
        quantity_used=data.quantity_used
    )
    db.add(usage)

    # 🔥 reduce inventory
    item = db.query(Inventory).first()  # simple version

    if item:
        item.quantity -= data.quantity_used

    db.commit()

    return {"message": "Usage recorded"}