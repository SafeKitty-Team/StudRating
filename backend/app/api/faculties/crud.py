from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError

from .schemas import FacultyCreate, FacultyUpdate
from core.models.faculties import Faculty


async def create_faculty(
    session: AsyncSession, faculty_create: FacultyCreate
) -> Faculty:
    new_faculty = Faculty(
        name=faculty_create.name, description=faculty_create.description
    )

    session.add(new_faculty)
    try:
        await session.commit()
        await session.refresh(new_faculty)
        return new_faculty
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Faculty with this name already exists.",
        )


async def get_faculty(session: AsyncSession, faculty_id: int) -> Faculty | None:
    result = await session.execute(select(Faculty).filter(Faculty.id == faculty_id))
    faculty = result.scalars().first()
    return faculty


async def update_faculty(
    session: AsyncSession,
    faculty_id: int,
    faculty_update: FacultyUpdate,
) -> Faculty:
    faculty = await get_faculty(session, faculty_id)
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Faculty not found"
        )

    if faculty_update.name:
        faculty.name = faculty_update.name
    if faculty_update.description:
        faculty.description = faculty_update.description

    session.add(faculty)
    await session.commit()
    await session.refresh(faculty)
    return faculty


async def get_all_faculties(session: AsyncSession) -> list:
    """Возвращает все факультеты из базы данных."""
    result = await session.execute(select(Faculty))
    return result.scalars().all()
