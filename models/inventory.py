from sqlalchemy import Column, Integer, String
from db.database import Base

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String(100))
    quantity = Column(Integer)