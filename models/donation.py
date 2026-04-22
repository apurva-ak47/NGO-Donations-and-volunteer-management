from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.sql import func
from db.database import Base

class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    donor_id = Column(Integer, ForeignKey("donors.id"))
    
    status = Column(String(50), default="Pending")  # ✅ fixed

    created_at = Column(DateTime(timezone=True), server_default=func.now())