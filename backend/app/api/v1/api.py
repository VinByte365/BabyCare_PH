"""
 * BabyGuide PH — API Router Bundler
"""

from fastapi import APIRouter
from app.api.v1.endpoints import auth, babies, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(babies.router, prefix="/babies", tags=["baby profiles"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
