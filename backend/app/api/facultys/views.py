from typing import Annotated, Any, Coroutine

from fastapi import APIRouter, Depends, status, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from core.models.facultys import Faculty
from .schemas import FacultyCreate, FacultyRead, FacultyUpdate
from .crud import create_faculty, get_faculty, update_faculty, delete_faculty
from core.models import db_helper, Faculty

router = APIRouter(prefix="/facultys", tags=["facultys"])


@router.post("/", response_model=FacultyRead, status_code=status.HTTP_201_CREATED)
async def create_faculty_endpoint(
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    name: str = Form(...),
    description: str | None = Form(None),
    faculty_id: int = Form(...),
) -> Faculty:
    faculty_create = FacultyCreate(name=name, description=description, faculty_id=faculty_id)
    return await create_faculty(session=session, faculty_create=faculty_create)


@router.get("/{faculty_id}", response_model=FacultyRead)
async def get_faculty_endpoint(
    faculty_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
) -> Faculty:
    faculty = await get_faculty(session=session, faculty_id=faculty_id)
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Faculty not found"
        )
    return faculty


@router.put("/{faculty_id}", response_model=FacultyRead)
async def update_faculty_endpoint(
    faculty_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    name: str | None = Form(None),
    description: str | None = Form(None),
) -> Faculty:
    faculty_update = FacultyUpdate(name=name, description=description, faculty_id=faculty_id)
    return await update_faculty(session=session, faculty_id=faculty_id, faculty_update=faculty_update)


@router.delete("/{faculty_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_faculty_endpoint(
    faculty_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
) -> None:
    await delete_faculty(session=session, faculty_id=faculty_id)
