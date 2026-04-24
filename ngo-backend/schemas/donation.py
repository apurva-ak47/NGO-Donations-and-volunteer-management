from typing import List

from pydantic import BaseModel


class DonationItemCreate(BaseModel):
    item_name: str
    quantity: int


class DonationCreate(BaseModel):
    items: List[DonationItemCreate]


class DonationUsedCreate(BaseModel):
    location: str
    description: str
