from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.inventory import Inventory

router = APIRouter()

@router.get("/inventory")
def get_inventory(db: Session = Depends(get_db)):
    items = db.query(Inventory).all()
    return items