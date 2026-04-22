from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.user import User
from schemas.user import UserCreate
from core.security import hash_password   # 🔥 NEW

router = APIRouter()

# ✅ CREATE USER (POST)
@router.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        print("Incoming user:", user)

        hashed_pwd = hash_password(user.password)

        new_user = User(
            name=user.name,
            email=user.email,
            password=hashed_pwd,
            role=user.role
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {"message": "User created"}

    except Exception as e:
        print("ERROR:", e)   # 👈 VERY IMPORTANT
        return {"error": str(e)}