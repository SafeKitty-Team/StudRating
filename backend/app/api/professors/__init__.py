from fastapi import APIRouter
from . import views

router = APIRouter()

# Включаем маршруты для преподавателей
router.include_router(views.router, tags=["professors"])