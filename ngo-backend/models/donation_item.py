from sqlalchemy import Column, Integer, String, ForeignKey
from db.database import Base

class DonationItem(Base):
    __tablename__ = "donation_items"

    id = Column(Integer, primary_key=True, index=True)
    donation_id = Column(Integer, ForeignKey("donations.id"))
    item_name = Column(String(100))
    quantity = Column(Integer)