from fastapi import APIRouter
from . import views

router = APIRouter()

# Включаем маршруты для предметов
router.include_router(views.router, tags=["subjects"])