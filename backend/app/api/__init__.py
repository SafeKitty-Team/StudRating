from fastapi import APIRouter
from api.faculties import router as facultys_router

router = APIRouter()

router.include_router(facultys_router)
