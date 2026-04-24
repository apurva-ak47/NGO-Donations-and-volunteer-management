from sqlalchemy import Column, Integer, ForeignKey, String
from db.database import Base

class DonationUsage(Base):
    __tablename__ = "donation_usage"

    id = Column(Integer, primary_key=True, index=True)
    donation_item_id = Column(Integer, ForeignKey("donation_items.id"))
    task_id = Column(Integer, ForeignKey("tasks.id"))
    quantity_used = Column(Integer)
    location = Column(String(200))
    description = Column(String(500))
