from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.dependencies import admin_only
from core.security import hash_password
from db.database import get_db
from models.donor import Donor
from models.user import User
from schemas.user import AdminUserCreate, UserCreate

router = APIRouter()


def create_linked_donor(db: Session, user: User):
    donor = Donor(
        user_id=user.id,
        name=user.name,
        email=user.email,
        phone="",
        address="",
    )
    db.add(donor)
    db.flush()
    return donor


@router.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role="donor",
    )

    db.add(new_user)
    db.flush()
    donor = create_linked_donor(db, new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created", "id": new_user.id, "role": new_user.role, "donor_id": donor.id}


@router.post("/admin/users")
def create_user_as_admin(
    user: AdminUserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    if user.role not in {"admin", "donor"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")

    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
    )

    db.add(new_user)
    db.flush()

    donor = None
    if user.role == "donor":
        donor = create_linked_donor(db, new_user)

    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created by admin",
        "id": new_user.id,
        "role": new_user.role,
        "donor_id": donor.id if donor else None,
        "created_by": current_user.email,
    }
