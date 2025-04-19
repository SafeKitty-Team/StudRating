from typing import Annotated, List, Callable

from fastapi import APIRouter, Depends, status, Form, HTTPException
from pydantic import EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import UserCreate, UserRead, UserUpdate
from core.models.users import User
from .crud import create_user, get_user, update_user, delete_user
from core.models import db_helper
from api.auth.dependencies import get_current_admin_user


# Create a router with admin dependency applied to all routes
router = APIRouter(
    prefix="/users",
    tags=["users"],
    dependencies=[Depends(get_current_admin_user)]  # Apply admin check to all routes
)


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user_endpoint(
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    email: EmailStr = Form(...),
    password: str = Form(..., min_length=8, max_length=30),
) -> User:
    user_create = UserCreate(email=email, password=password)
    return await create_user(session=session, user_create=user_create)


@router.get("/{user_id}", response_model=UserRead)
async def get_user_endpoint(
    user_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
) -> User:
    user = await get_user(session=session, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


@router.put("/{user_id}", response_model=UserRead)
async def update_user_endpoint(
    user_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    password: str | None = Form(None, min_length=8, max_length=30),
) -> User:
    user_update = UserUpdate(password=password)
    return await update_user(session=session, user_id=user_id, user_update=user_update)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_endpoint(
    user_id: int,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
) -> None:
    await delete_user(session=session, user_id=user_id)