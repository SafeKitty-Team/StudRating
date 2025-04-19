# [file name]: app/auth/crud.py
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from core.models import db_helper

from core.models.users import User

async def get_user_by_email(
    email: str,
    session: AsyncSession,
) -> User | None:
    stmt = select(User).where(User.email == email)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def get_user_by_email(
    email: str,
    session: AsyncSession,
) -> User | None:
    stmt = select(User).where(User.email == email)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()