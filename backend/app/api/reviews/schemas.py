from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class ReviewEntityType(str, Enum):
    PROFESSOR = "professor"
    SUBJECT = "subject"
    PROGRAM = "program"
    FACULTY = "faculty"
    COURSE_PROFESSOR = "course_professor"


class ReviewBase(BaseModel):
    """Базовые поля отзыва"""

    rating_overall: int = Field(..., ge=1, le=5, description="Общая оценка (1-5)")
    rating_difficulty: int = Field(
        ..., ge=1, le=5, description="Оценка сложности (1-5)"
    )
    rating_usefulness: int = Field(
        ..., ge=1, le=5, description="Оценка полезности (1-5)"
    )
    text_review: str = Field(..., description="Текст отзыва")

    class Config:
        from_attributes = True


class ReviewCreate(ReviewBase):
    """Схема для создания нового отзыва"""

    entity_type: ReviewEntityType
    entity_id: int
    course_professor_id: int | None = None  # для обратной совместимости


class ReviewUpdate(BaseModel):
    """Схема для обновления существующего отзыва"""

    rating_overall: int | None = Field(None, ge=1, le=5)
    rating_difficulty: int | None = Field(None, ge=1, le=5)
    rating_usefulness: int | None = Field(None, ge=1, le=5)
    text_review: str | None = None
    is_on_moderation: bool | None = None


class ReviewRead(ReviewBase):
    """Схема для чтения отзыва"""

    id: int
    entity_type: ReviewEntityType
    entity_id: int
    created_at: datetime
    is_on_moderation: bool