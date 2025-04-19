from pydantic import BaseModel
from typing import Optional


class FacultyBase(BaseModel):
    """Общие поля для кафедры"""

    name: str
    description: str | None = None

    class Config:
        from_attributes = True


class FacultyCreate(FacultyBase):
    """Схема для создания новой кафедры"""

    pass


class FacultyUpdate(BaseModel):
    """Схема для частичного обновления кафедры"""

    name: str | None = None
    description: str | None = None


class FacultyRead(FacultyBase):
    """Схема для чтения данных о кафедре"""

    id: int
