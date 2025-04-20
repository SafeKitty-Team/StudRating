from typing import Annotated

from fastapi import APIRouter, Depends, status, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import FacultyCreate, FacultyRead, FacultyUpdate
from .crud import create_faculty, get_faculty, update_faculty
from core.models import db_helper, Faculty
from api.auth.dependencies import get_current_admin_user
from core.models.users import User

router = APIRouter(prefix="/faculties")


@router.post("/", response_model=FacultyRead, status_code=status.HTTP_201_CREATED)
async def create_faculty_endpoint(
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    name: str = Form(...),
    description: str | None = Form(None),
    current_admin: User = Depends(get_current_admin_user),  # Добавляем проверку прав администратора
) -> Faculty:
    """Создание новой кафедры (только для администраторов)"""
    faculty_create = FacultyCreate(name=name, description=description)
    return await create_faculty(session=session, faculty_create=faculty_create)


@router.get("/{faculty_id}", response_model=FacultyRead)
async def get_faculty_endpoint(
    faculty_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
) -> Faculty:
    """Получение информации о конкретной кафедре (доступно всем пользователям)"""
    faculty = await get_faculty(session=session, faculty_id=faculty_id)
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Faculty not found"
        )
    return faculty


@router.patch("/{faculty_id}", response_model=FacultyRead)
async def update_faculty_endpoint(
    faculty_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    name: str | None = Form(None),
    description: str | None = Form(None),
    current_admin: User = Depends(get_current_admin_user),  # Добавляем проверку прав администратора
) -> Faculty:
    """Обновление информации о кафедре (только для администраторов)"""
    faculty_update = FacultyUpdate(
        name=name, description=description
    )
    return await update_faculty(
        session=session, faculty_id=faculty_id, faculty_update=faculty_update
    )