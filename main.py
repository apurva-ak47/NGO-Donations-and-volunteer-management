from fastapi import FastAPI

from db.database import Base, engine

# ==============================
# IMPORT MODELS (for table creation)
# ==============================
from models import user, donor
from models import donation, donation_item
from models import task, donation_usage
from models import inventory   # ✅ moved here (cleaner)

# ==============================
# IMPORT ROUTES
# ==============================
from routes import user as user_routes
from routes import donor as donor_routes
from routes import donation as donation_routes
from routes import inventory as inventory_routes
from routes import report as report_routes
from routes import usage as usage_routes
from routes import auth as auth_routes

# ==============================
# CREATE APP
# ==============================
app = FastAPI(
    title="NGO ERP System",
    description="Donation Tracking, Inventory & Transparency System",
    version="1.0.0"
)

# ==============================
# CREATE TABLES
# ==============================
Base.metadata.create_all(bind=engine)

# ==============================
# INCLUDE ROUTES
# ==============================
app.include_router(auth_routes.router)        # 🔐 Auth
app.include_router(user_routes.router)        # Users
app.include_router(donor_routes.router)       # Donors
app.include_router(donation_routes.router)    # Donations
app.include_router(inventory_routes.router)   # Inventory
app.include_router(report_routes.router)      # Reports
app.include_router(usage_routes.router)       # Usage tracking

# ==============================
# ROOT
# ==============================
@app.get("/")
def root():
    return {
        "message": "NGO ERP System Running",
        "modules": [
            "Auth",
            "Users",
            "Donors",
            "Donations",
            "Inventory",
            "Usage",
            "Reports"
        ]
    }