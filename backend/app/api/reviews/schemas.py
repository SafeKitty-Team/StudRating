from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ReviewBase(BaseModel):
    """Базовые поля отзыва"""
    rating_overall: int = Field(..., ge=1, le=5, description="Общая оценка (1-5)")
    rating_difficulty: int = Field(..., ge=1, le=5, description="Оценка сложности (1-5)")
    rating_usefulness: int = Field(..., ge=1, le=5, description="Оценка полезности (1-5)")
    text_review: str = Field(..., description="Текст отзыва")

    class Config:
        from_attributes = True


class ReviewCreate(ReviewBase):
    """Схема для создания нового отзыва"""
    course_professor_id: int = Field(..., description="ID связи курс-преподаватель")


class ReviewUpdate(BaseModel):
    """Схема для обновления существующего отзыва"""
    rating_overall: Optional[int] = Field(None, ge=1, le=5)
    rating_difficulty: Optional[int] = Field(None, ge=1, le=5)
    rating_usefulness: Optional[int] = Field(None, ge=1, le=5)
    text_review: Optional[str] = None
    is_on_moderation: Optional[bool] = None


class ReviewRead(ReviewBase):
    """Схема для чтения отзыва"""
    id: int
    course_professor_id: int
    created_at: datetime
    is_on_moderation: bool