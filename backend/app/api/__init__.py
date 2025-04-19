from fastapi import APIRouter
from api.facultys import router as facultys_router

# Создаём основной роутер для всех API
router = APIRouter()

# Включаем маршруты для кафедр
router.include_router(facultys_router)
