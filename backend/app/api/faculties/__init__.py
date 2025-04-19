from fastapi import APIRouter
from . import views

router = APIRouter()

# Включаем маршруты для кафедр
router.include_router(views.router, tags=["faculties"])
