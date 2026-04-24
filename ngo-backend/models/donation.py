from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.sql import func

from db.database import Base


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    donor_id = Column(Integer, ForeignKey("donors.id"))
    status = Column(String(50), default="Pending")
    usage_location = Column(String(200))
    usage_description = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
