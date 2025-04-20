from pydantic import BaseModel
from typing import Optional


class SubjectBase(BaseModel):
    """Общие поля для предмета"""

    name: str
    description: str | None = None
    program_id: int

    class Config:
        from_attributes = True


class SubjectCreate(SubjectBase):
    """Схема для создания нового предмета"""

    pass


class SubjectUpdate(BaseModel):
    """Схема для частичного обновления предмета"""

    name: str | None = None
    description: str | None = None
    program_id: int | None = None


class SubjectRead(SubjectBase):
    """Схема для чтения данных о предмете"""

    id: int