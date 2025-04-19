from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

from core.models.users import UserRole


class UserBase(BaseModel):
    """Общие поля"""

    roles: UserRole = UserRole.user

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    """Схема для создания нового пользователя"""

    email: EmailStr
    password: str  # raw password, будет хэшироваться в роуте


class UserUpdate(BaseModel):
    """Схема для частичного обновления пользователя"""

    password: str | None = None


class UserRead(UserBase):
    """Схема для чтения пользователя"""

    id: int
    created_at: datetime
