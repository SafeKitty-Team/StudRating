# [file name]: app/auth/router.py
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from core.models import db_helper
from .schemas import Token, UserCreate
from .utils import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password
)
from .crud import get_user_by_email
from core.models.users import User, UserRole

router = APIRouter(prefix="/auth", tags=["Auth"])


async def authenticate_user(email: str, password: str, session: AsyncSession) -> User | None:
    user = await get_user_by_email(email, session)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
        user_data: UserCreate,
        session: AsyncSession = Depends(db_helper.session_getter),
):
    existing_user = await get_user_by_email(user_data.email, session)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = hash_password(user_data.password)

    new_user = User(
        email=user_data.email,
        password=hashed_password,
        roles=UserRole.user
    )

    session.add(new_user)
    await session.commit()
    return {"message": "User created successfully"}


@router.post("/login", response_model=Token)
async def login(
        # Используем стандартную OAuth2 форму вместо CustomLoginForm
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
        session: AsyncSession = Depends(db_helper.session_getter),
):
    # Используем username как email в соответствии с OAuth2 стандартом
    user = await authenticate_user(form_data.username, form_data.password, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
async def logout():
    return {"message": "Successfully logged out"}