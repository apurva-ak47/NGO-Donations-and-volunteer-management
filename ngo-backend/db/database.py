import os
from urllib.parse import quote_plus

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Prefer environment variable (secure)
DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback (EC2 / local setup)
if not DATABASE_URL:
    DATABASE_URL = "mysql+pymysql://admin:Frappe13lpa@ngo-db.cqrowgwwqe76.us-east-1.rds.amazonaws.com:3306/ngo_db"

# Safety check
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set")

# Create engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

# Session
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

# Base
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
