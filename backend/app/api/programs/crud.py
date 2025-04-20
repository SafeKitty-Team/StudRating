from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status
from core.models import Faculty, Program


async def create_program(
    session: AsyncSession, name: str, degree_level: str, faculty_id: int
) -> Program:
    # Ensures the Faculty exists before creating the Program
    faculty = await session.execute(select(Faculty).filter_by(id=faculty_id))
    faculty = faculty.scalars().first()
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Faculty not found"
        )

    new_program = Program(name=name, degree_level=degree_level, faculty_id=faculty_id)
    session.add(new_program)
    await session.commit()
    await session.refresh(new_program)
    return new_program


async def get_program(session: AsyncSession, program_id: int) -> Program:
    result = await session.execute(select(Program).filter_by(id=program_id))
    program = result.scalars().first()
    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Program not found"
        )
    return program


async def update_program(
    session: AsyncSession,
    program_id: int,
    name: str,
    degree_level: str,
    faculty_id: int,
) -> Program:
    program = await get_program(session, program_id)

    # Ensure the Faculty exists before updating the Program
    faculty = await session.execute(select(Faculty).filter_by(id=faculty_id))
    faculty = faculty.scalars().first()
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Faculty not found"
        )

    program.name = name
    program.degree_level = degree_level
    program.faculty_id = faculty_id
    await session.commit()
    await session.refresh(program)
    return program


async def delete_program(session: AsyncSession, program_id: int) -> None:
    program = await get_program(session, program_id)
    await session.delete(program)
    await session.commit()
