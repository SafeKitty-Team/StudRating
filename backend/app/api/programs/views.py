from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from .crud import create_program, get_program, delete_program, update_program
from .schemas import ProgramCreate, ProgramRead, ProgramUpdate
from core.models import db_helper, Program
from core.models.users import User
from api.auth.dependencies import (
    get_current_admin_user,
)  # Ensures only admins can create/delete/update programs

router = APIRouter(prefix="/programs", tags=["Programs"])


@router.post("/", response_model=ProgramRead, status_code=status.HTTP_201_CREATED)
async def create_program_endpoint(
    program_create: ProgramCreate,
    session: AsyncSession = Depends(db_helper.session_getter),
    current_admin: User = Depends(get_current_admin_user),
) -> Program:
    """
    Create a new program (only accessible by admins).
    """
    new_program = await create_program(
        session,
        program_create.name,
        program_create.degree_level,
        program_create.faculty_id,
    )
    return new_program


@router.get("/{program_id}", response_model=ProgramRead)
async def get_program_endpoint(
    program_id: int, session: AsyncSession = Depends(db_helper.session_getter)
) -> Program:
    """
    Retrieve a program by its ID.
    """
    program = await get_program(session, program_id)
    return program


@router.delete("/{program_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_program_endpoint(
    program_id: int,
    session: AsyncSession = Depends(db_helper.session_getter),
    current_admin: User = Depends(get_current_admin_user),
) -> None:
    """
    Delete a program (only accessible by admins).
    """
    await delete_program(session, program_id)


@router.put("/{program_id}", response_model=ProgramRead)
async def update_program_endpoint(
    program_id: int,
    program_update: ProgramUpdate,
    session: AsyncSession = Depends(db_helper.session_getter),
    current_admin: User = Depends(get_current_admin_user),
) -> Program:
    """
    Update a program's details (only accessible by admins).
    """
    updated_program = await update_program(
        session,
        program_id,
        program_update.name,
        program_update.degree_level,
        program_update.faculty_id,
    )
    return updated_program
