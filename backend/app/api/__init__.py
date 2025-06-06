from fastapi import APIRouter

from .users import router as users_router
from .auth import router as auth_router
from .reviews import router as reviews_router
from .faculties import router as faculties_router
from .programs.views import router as program_route
from .professors import router as professors_router
from .subjects import router as subjects_router  # Добавленная строка

router = APIRouter()

router.include_router(users_router)
router.include_router(auth_router)
router.include_router(reviews_router)
router.include_router(faculties_router)
router.include_router(professors_router)
router.include_router(subjects_router)  # Добавленная строка

router.include_router(program_route)