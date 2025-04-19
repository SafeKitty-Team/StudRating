# [file name]: app/api/auth/dependencies.py
from typing import Annotated
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.models import db_helper
from core.models.users import User, UserRole
from .utils import get_current_user


async def get_current_admin_user(
        current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Проверяет, что текущий пользователь имеет права администратора.

    Args:
        current_user: Текущий аутентифицированный пользователь

    Returns:
        User: Пользователь с правами администратора

    Raises:
        HTTPException: Если пользователь не имеет прав администратора
    """
    if current_user.roles not in [UserRole.admin, UserRole.superuser]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user