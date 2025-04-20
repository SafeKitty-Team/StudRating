from typing import Annotated, List

from fastapi import APIRouter, Depends, status, Form, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import SubjectCreate, SubjectRead, SubjectUpdate
from .crud import (
    create_subject,
    get_subject,
    get_subjects,
    get_subjects_by_program,
    update_subject,
    delete_subject,
)
from core.models import db_helper, Subject
from api.auth.dependencies import get_current_admin_user
from core.models.users import User

router = APIRouter(prefix="/subjects")


@router.post("/", response_model=SubjectRead, status_code=status.HTTP_201_CREATED)
async def create_subject_endpoint(
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    name: str = Form(...),
    program_id: int = Form(...),
    description: str | None = Form(None),
    current_admin: User = Depends(get_current_admin_user),
) -> Subject:
    """Создание нового предмета (только для администраторов)"""
    subject_create = SubjectCreate(
        name=name,
        description=description,
        program_id=program_id,
    )
    return await create_subject(session=session, subject_create=subject_create)


@router.get("/", response_model=List[SubjectRead])
async def get_subjects_endpoint(
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
) -> List[Subject]:
    """Получение списка предметов с пагинацией"""
    return await get_subjects(session=session, skip=skip, limit=limit)


@router.get("/program/{program_id}", response_model=List[SubjectRead])
async def get_subjects_by_program_endpoint(
    program_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
) -> List[Subject]:
    """Получение списка предметов по программе"""
    return await get_subjects_by_program(session=session, program_id=program_id)


@router.get("/{subject_id}", response_model=SubjectRead)
async def get_subject_endpoint(
    subject_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
) -> Subject:
    """Получение информации о конкретном предмете"""
    subject = await get_subject(session=session, subject_id=subject_id)
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found"
        )
    return subject


@router.patch("/{subject_id}", response_model=SubjectRead)
async def update_subject_endpoint(
    subject_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    name: str | None = Form(None),
    description: str | None = Form(None),
    program_id: int | None = Form(None),
    current_admin: User = Depends(get_current_admin_user),
) -> Subject:
    """Обновление информации о предмете (только для администраторов)"""
    subject_update = SubjectUpdate(
        name=name,
        description=description,
        program_id=program_id,
    )
    return await update_subject(
        session=session, subject_id=subject_id, subject_update=subject_update
    )


@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subject_endpoint(
    subject_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    current_admin: User = Depends(get_current_admin_user),
) -> None:
    """Удаление предмета (только для администраторов)"""
    success = await delete_subject(session=session, subject_id=subject_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found"
        )