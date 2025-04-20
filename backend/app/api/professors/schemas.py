from pydantic import BaseModel
from typing import Optional


class ProfessorBase(BaseModel):
    """Общие поля для преподавателя"""

    full_name: str
    academic_title: str | None = None
    faculty_id: int
    bio: str | None = None

    class Config:
        from_attributes = True


class ProfessorCreate(ProfessorBase):
    """Схема для создания нового преподавателя"""

    pass


class ProfessorUpdate(BaseModel):
    """Схема для частичного обновления преподавателя"""

    full_name: str | None = None
    academic_title: str | None = None
    faculty_id: int | None = None
    bio: str | None = None


class ProfessorRead(ProfessorBase):
    """Схема для чтения данных о преподавателе"""

    id: int