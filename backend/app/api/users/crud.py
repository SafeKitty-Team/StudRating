from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError

from .schemas import UserCreate, UserUpdate, UserRead
from core.models.users import User
from ..auth.utils import hash_password


async def create_user(session: AsyncSession, user_create: UserCreate) -> User:
    # Хэшируем пароль перед сохранением
    hashed_password = hash_password(user_create.password)

    new_user = User(
        email=user_create.email,
        password=hashed_password,
        roles=user_create.roles,
    )

    session.add(new_user)
    try:
        await session.commit()
        await session.refresh(new_user)
        return new_user
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists.",
        )


async def get_user(session: AsyncSession, user_id: int) -> User | None:
    result = await session.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    return user


async def update_user(
    session: AsyncSession,
    user_id: int,
    user_update: UserUpdate,
) -> User:
    user = await get_user(session, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if user_update.password:
        user.password = hash_password(user_update.password)

    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def delete_user(session: AsyncSession, user_id: int) -> None:
    user = await get_user(session, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    await session.delete(user)
    await session.commit()
