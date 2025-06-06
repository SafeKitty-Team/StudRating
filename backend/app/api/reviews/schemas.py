from datetime import datetime
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field

from core.models.reviews import ReviewEntityType


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
    course_professor_id: Optional[int] = None


class ReviewUpdate(BaseModel):
    """Схема для обновления существующего отзыва"""

    rating_overall: Optional[int] = Field(None, ge=1, le=5)
    rating_difficulty: Optional[int] = Field(None, ge=1, le=5)
    rating_usefulness: Optional[int] = Field(None, ge=1, le=5)
    text_review: Optional[str] = None
    is_on_moderation: Optional[bool] = None
    tags: Optional[List[str]] = None


class ReviewRead(ReviewBase):
    """Схема для чтения отзыва"""

    id: int
    entity_type: ReviewEntityType
    entity_id: int
    created_at: datetime
    is_on_moderation: bool
    course_professor_id: Optional[int] = None


class AverageRatings(BaseModel):
    """Схема для средних оценок сущности"""

    rating_overall: float = Field(..., description="Средняя общая оценка")
    rating_difficulty: float = Field(..., description="Средняя оценка сложности")
    rating_usefulness: float = Field(..., description="Средняя оценка полезности")
    average_total: float = Field(
        ..., description="Среднее значение по всем показателям"
    )
    reviews_count: int = Field(..., description="Количество отзывов")
