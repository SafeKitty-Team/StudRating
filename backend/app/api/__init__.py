from fastapi import APIRouter

from core.config import settings

from .users import router as users_router
from .reviews import router as reviews_router
from .auth import router as auth_router

router = APIRouter()
router.include_router(users_router)
router.include_router(reviews_router)
router.include_router(auth_router)