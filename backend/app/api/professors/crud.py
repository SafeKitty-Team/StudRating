from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError

from .schemas import ProfessorCreate, ProfessorUpdate
from core.models.professors import Professor
from core.models.faculties import Faculty


async def create_professor(
    session: AsyncSession, professor_create: ProfessorCreate
) -> Professor:
    # Проверяем, существует ли указанный факультет
    faculty_result = await session.execute(
        select(Faculty).filter(Faculty.id == professor_create.faculty_id)
    )
    faculty = faculty_result.scalar_one_or_none()
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Faculty not found",
        )

    new_professor = Professor(
        full_name=professor_create.full_name,
        academic_title=professor_create.academic_title,
        faculty_id=professor_create.faculty_id,
        bio=professor_create.bio,
    )

    session.add(new_professor)
    try:
        await session.commit()
        await session.refresh(new_professor)
        return new_professor
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error creating professor",
        )


async def get_professor(session: AsyncSession, professor_id: int) -> Professor | None:
    result = await session.execute(select(Professor).filter(Professor.id == professor_id))
    professor = result.scalars().first()
    return professor


async def get_professors(session: AsyncSession, skip: int = 0, limit: int = 100) -> list[Professor]:
    result = await session.execute(select(Professor).offset(skip).limit(limit))
    professors = result.scalars().all()
    return list(professors)


async def get_professors_by_faculty(session: AsyncSession, faculty_id: int) -> list[Professor]:
    result = await session.execute(select(Professor).filter(Professor.faculty_id == faculty_id))
    professors = result.scalars().all()
    return list(professors)


async def update_professor(
    session: AsyncSession,
    professor_id: int,
    professor_update: ProfessorUpdate,
) -> Professor:
    professor = await get_professor(session, professor_id)
    if not professor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Professor not found"
        )

    # Проверяем, существует ли указанный факультет, если он изменяется
    if professor_update.faculty_id is not None:
        faculty_result = await session.execute(
            select(Faculty).filter(Faculty.id == professor_update.faculty_id)
        )
        faculty = faculty_result.scalar_one_or_none()
        if not faculty:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Faculty not found",
            )

    update_data = professor_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(professor, key, value)

    session.add(professor)
    await session.commit()
    await session.refresh(professor)
    return professor


async def delete_professor(session: AsyncSession, professor_id: int) -> bool:
    professor = await get_professor(session, professor_id)
    if not professor:
        return False

    await session.delete(professor)
    await session.commit()
    return True