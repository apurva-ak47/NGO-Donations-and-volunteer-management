from pydantic import BaseModel
from typing import List

class DonationItemCreate(BaseModel):
    item_name: str
    quantity: int

class DonationCreate(BaseModel):
    donor_id: int
    items: List[DonationItemCreate]