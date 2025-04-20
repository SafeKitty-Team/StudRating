from typing import Annotated, List

from fastapi import APIRouter, Depends, status, Form, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import ProfessorCreate, ProfessorRead, ProfessorUpdate
from .crud import (
    create_professor,
    get_professor,
    get_professors,
    get_professors_by_faculty,
    update_professor,
    delete_professor,
)
from core.models import db_helper, Professor
from api.auth.dependencies import get_current_admin_user
from core.models.users import User

router = APIRouter(prefix="/professors")


@router.post("/", response_model=ProfessorRead, status_code=status.HTTP_201_CREATED)
async def create_professor_endpoint(
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    full_name: str = Form(...),
    faculty_id: int = Form(...),
    academic_title: str | None = Form(None),
    bio: str | None = Form(None),
    current_admin: User = Depends(get_current_admin_user),
) -> Professor:
    """Создание нового преподавателя (только для администраторов)"""
    professor_create = ProfessorCreate(
        full_name=full_name,
        academic_title=academic_title,
        faculty_id=faculty_id,
        bio=bio,
    )
    return await create_professor(session=session, professor_create=professor_create)


@router.get("/", response_model=List[ProfessorRead])
async def get_professors_endpoint(
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
) -> List[Professor]:
    """Получение списка преподавателей с пагинацией"""
    return await get_professors(session=session, skip=skip, limit=limit)


@router.get("/faculty/{faculty_id}", response_model=List[ProfessorRead])
async def get_professors_by_faculty_endpoint(
    faculty_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
) -> List[Professor]:
    """Получение списка преподавателей по факультету"""
    return await get_professors_by_faculty(session=session, faculty_id=faculty_id)


@router.get("/{professor_id}", response_model=ProfessorRead)
async def get_professor_endpoint(
    professor_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
) -> Professor:
    """Получение информации о конкретном преподавателе"""
    professor = await get_professor(session=session, professor_id=professor_id)
    if not professor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Professor not found"
        )
    return professor


@router.patch("/{professor_id}", response_model=ProfessorRead)
async def update_professor_endpoint(
    professor_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    full_name: str | None = Form(None),
    academic_title: str | None = Form(None),
    faculty_id: int | None = Form(None),
    bio: str | None = Form(None),
    current_admin: User = Depends(get_current_admin_user),
) -> Professor:
    """Обновление информации о преподавателе (только для администраторов)"""
    professor_update = ProfessorUpdate(
        full_name=full_name,
        academic_title=academic_title,
        faculty_id=faculty_id,
        bio=bio,
    )
    return await update_professor(
        session=session, professor_id=professor_id, professor_update=professor_update
    )


@router.delete("/{professor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_professor_endpoint(
    professor_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    current_admin: User = Depends(get_current_admin_user),
) -> None:
    """Удаление преподавателя (только для администраторов)"""
    success = await delete_professor(session=session, professor_id=professor_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Professor not found"
        )