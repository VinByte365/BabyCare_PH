"""
 * BabyGuide PH — FastAPI main application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.api import api_router

# Try automatically creating tables on startup (handy if Alembic migrations are run later or for SQLite local debug)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Database tables could not be initialized on startup. Details: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to BabyGuide PH API Service",
        "version": "1.0.0",
        "docs_url": "/docs"
    }
