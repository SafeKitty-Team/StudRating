from enum import Enum
from sqlalchemy import Integer, Text, ForeignKey, Boolean, Enum as SQLAlchemyEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .mixins.id_mixin import IDMixin
from .mixins.timestamp_mixin import TimestampMixin


class ReviewEntityType(str, Enum):
    PROFESSOR = "professor"
    SUBJECT = "subject"
    PROGRAM = "program"
    FACULTY = "faculty"
    COURSE_PROFESSOR = "course_professor"  # для обратной совместимости


class Review(IDMixin, TimestampMixin, Base):
    """
    Модель SQLAlchemy, представляющая отзыв пользователя о курсе, преподавателе, программе или факультете.

    Атрибуты:
        id (int): Уникальный идентификатор (наследуется от IDMixin).
        created_at (datetime): Дата создания (наследуется от TimestampMixin).
        user_id (int, optional): Ссылка на пользователя, оставившего отзыв (может быть null для анонимных).
        entity_type (ReviewEntityType): Тип сущности, к которой относится отзыв.
        entity_id (int): ID сущности, к которой относится отзыв.
        course_professor_id (int, optional): Ссылка на комбинацию курс-преподаватель (для обратной совместимости).
        rating_overall (int): Общая оценка (1-5).
        rating_difficulty (int): Оценка сложности (1-5).
        rating_usefulness (int): Оценка полезности (1-5).
        text_review (str): Текстовое содержание отзыва.
        is_on_moderation (bool): Требуется ли модерация перед публикацией.
    """

    user_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("user.id"), nullable=True
    )

    # Новые поля для полиморфной ассоциации
    entity_type: Mapped[ReviewEntityType] = mapped_column(
        SQLAlchemyEnum(ReviewEntityType), nullable=False
    )
    entity_id: Mapped[int] = mapped_column(Integer, nullable=False)

    # Для обратной совместимости
    course_professor_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("course_professor.id"), nullable=True
    )

    rating_overall: Mapped[int] = mapped_column(Integer, nullable=False)
    rating_difficulty: Mapped[int] = mapped_column(Integer, nullable=False)
    rating_usefulness: Mapped[int] = mapped_column(Integer, nullable=False)
    text_review: Mapped[str] = mapped_column(Text, nullable=False)
    is_on_moderation: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    # Отношение для обратной совместимости
    course_professor: Mapped["CourseProfessor"] = relationship(
        "CourseProfessor", back_populates="reviews"
    )

    def __repr__(self) -> str:
        return (
            f"<Review(id={self.id}, entity_type={self.entity_type}, entity_id={self.entity_id}, "
            f"rating_overall={self.rating_overall}, is_on_moderation={self.is_on_moderation})>"
        )