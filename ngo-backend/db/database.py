import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables
load_dotenv()

# Get DATABASE_URL directly (preferred)
DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback if DATABASE_URL not provided
if not DATABASE_URL:
    db_user = os.getenv("DB_USER")
    db_password = quote_plus(os.getenv("DB_PASSWORD", ""))
    db_host = os.getenv("DB_HOST")
    db_port = os.getenv("DB_PORT", "3306")
    db_name = os.getenv("DB_NAME")

    DATABASE_URL = (
        f"mysql+pymysql://{db_user}:{db_password}@"
        f"{db_host}:{db_port}/{db_name}"
    )

# Create engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

# Create session
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

# Base model
Base = declarative_base()

# Dependency (for FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()