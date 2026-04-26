from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.database import Base, engine
from db.schema_sync import ensure_runtime_schema

from models import donation, donation_item, donation_usage, donor, inventory, task, user
from routes import auth as auth_routes
from routes import donation as donation_routes
from routes import donor as donor_routes
from routes import inventory as inventory_routes
from routes import report as report_routes
from routes import usage as usage_routes
from routes import user as user_routes

app = FastAPI(
    title="NGO ERP System",
    description="Donation Tracking, Inventory & Transparency System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
ensure_runtime_schema()

app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(donor_routes.router)
app.include_router(donation_routes.router)
app.include_router(inventory_routes.router)
app.include_router(report_routes.router)
app.include_router(usage_routes.router)


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
            "Reports",
        ],
    }
