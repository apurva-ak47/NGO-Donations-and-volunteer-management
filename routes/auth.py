from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from db.database import get_db
from models.user import User
from core.security import verify_password
from core.auth import create_access_token

router = APIRouter()

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        return {"error": "User not found"}

    if not verify_password(form_data.password, user.password):
        return {"error": "Invalid password"}

    token = create_access_token({"sub": user.email})

    return {"access_token": token, "token_type": "bearer"}