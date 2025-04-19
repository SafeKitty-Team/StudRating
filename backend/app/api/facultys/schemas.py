from pydantic import BaseModel
from typing import Optional

class FacultyBase(BaseModel):
    """Общие поля для кафедры"""
    name: str
    description: Optional[str] = None
    faculty_id: int

    class Config:
        from_attributes = True


class FacultyCreate(FacultyBase):
    """Схема для создания новой кафедры"""
    pass


class FacultyUpdate(BaseModel):
    """Схема для частичного обновления кафедры"""
    name: Optional[str] = None
    description: Optional[str] = None
    faculty_id: Optional[int] = None


class FacultyRead(FacultyBase):
    """Схема для чтения данных о кафедре"""
    id: int

    class Config:
        orm_mode = True
