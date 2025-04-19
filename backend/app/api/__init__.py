from fastapi import APIRouter

from core.config import settings

from .users import router as users_router
from .reviews import router as reviews_router

router = APIRouter()
router.include_router(users_router)
router.include_router(reviews_router)