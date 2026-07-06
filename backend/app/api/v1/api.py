"""
 * BabyGuide PH — API Router Bundler
"""

from fastapi import APIRouter
from app.api.v1.endpoints import auth, babies, analytics, skin_check, symptom_check, history, bookmarks, community

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(babies.router, prefix="/babies", tags=["baby profiles"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(skin_check.router, prefix="/skin-check", tags=["skin check"])
api_router.include_router(symptom_check.router, prefix="/symptom-check", tags=["symptom check"])
api_router.include_router(bookmarks.router, prefix="/bookmarks", tags=["bookmarks"])
api_router.include_router(history.router, prefix="/history", tags=["history"])
api_router.include_router(community.router, prefix="/posts", tags=["community"])
