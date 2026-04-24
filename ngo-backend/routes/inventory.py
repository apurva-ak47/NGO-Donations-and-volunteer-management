from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from core.dependencies import admin_only, get_current_user
from db.database import get_db
from models.inventory import Inventory
from models.user import User

router = APIRouter()


class InventoryUpdate(BaseModel):
    quantity: int


@router.get("/inventory")
def get_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Inventory).all()


@router.put("/inventory/{id}")
def update_inventory(
    id: int,
    data: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    item = db.query(Inventory).filter(Inventory.id == id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")

    item.quantity = data.quantity
    db.commit()
    db.refresh(item)

    return {"message": "Inventory updated", "id": item.id, "updated_by": current_user.email}
