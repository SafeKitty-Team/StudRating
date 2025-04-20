from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError

from .schemas import SubjectCreate, SubjectUpdate
from core.models.subjects import Subject
from core.models.programs import Program


async def create_subject(
    session: AsyncSession, subject_create: SubjectCreate
) -> Subject:
    # Проверяем, существует ли указанная программа
    program_result = await session.execute(
        select(Program).filter(Program.id == subject_create.program_id)
    )
    program = program_result.scalar_one_or_none()
    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found",
        )

    new_subject = Subject(
        name=subject_create.name,
        description=subject_create.description,
        program_id=subject_create.program_id,
    )

    session.add(new_subject)
    try:
        await session.commit()
        await session.refresh(new_subject)
        return new_subject
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error creating subject",
        )


async def get_subject(session: AsyncSession, subject_id: int) -> Subject | None:
    result = await session.execute(select(Subject).filter(Subject.id == subject_id))
    subject = result.scalars().first()
    return subject


async def get_subjects(session: AsyncSession, skip: int = 0, limit: int = 100) -> list[Subject]:
    result = await session.execute(select(Subject).offset(skip).limit(limit))
    subjects = result.scalars().all()
    return list(subjects)


async def get_subjects_by_program(session: AsyncSession, program_id: int) -> list[Subject]:
    result = await session.execute(select(Subject).filter(Subject.program_id == program_id))
    subjects = result.scalars().all()
    return list(subjects)


async def update_subject(
    session: AsyncSession,
    subject_id: int,
    subject_update: SubjectUpdate,
) -> Subject:
    subject = await get_subject(session, subject_id)
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found"
        )

    # Проверяем, существует ли указанная программа, если она изменяется
    if subject_update.program_id is not None:
        program_result = await session.execute(
            select(Program).filter(Program.id == subject_update.program_id)
        )
        program = program_result.scalar_one_or_none()
        if not program:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Program not found",
            )

    update_data = subject_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(subject, key, value)

    session.add(subject)
    await session.commit()
    await session.refresh(subject)
    return subject


async def delete_subject(session: AsyncSession, subject_id: int) -> bool:
    subject = await get_subject(session, subject_id)
    if not subject:
        return False

    await session.delete(subject)
    await session.commit()
    return True