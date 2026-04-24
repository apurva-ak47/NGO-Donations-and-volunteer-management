from sqlalchemy import Column, Integer, String
from db.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    location = Column(String(100))