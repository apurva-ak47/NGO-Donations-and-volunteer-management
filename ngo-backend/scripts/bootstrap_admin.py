from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from db.database import SessionLocal
from models.user import User
from core.security import hash_password


ADMIN_EMAIL = "apurva@test.com"
ADMIN_PASSWORD = "admin123"


def main():
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if admin:
            admin.role = "admin"
            admin.password = hash_password(ADMIN_PASSWORD)
            action = "updated"
        else:
            admin = User(
                name="Local Admin",
                email=ADMIN_EMAIL,
                password=hash_password(ADMIN_PASSWORD),
                role="admin",
            )
            db.add(admin)
            action = "created"

        db.commit()
        print(f"Admin {action}: {ADMIN_EMAIL}")
        print(f"Password: {ADMIN_PASSWORD}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
