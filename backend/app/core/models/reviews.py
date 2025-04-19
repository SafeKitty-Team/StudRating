from sqlalchemy import Integer, Text, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .mixins.id_mixin import IDMixin
from .mixins.timestamp_mixin import TimestampMixin


class Review(IDMixin, Base):
    """
    Модель SQLAlchemy, представляющая отзыв пользователя о курсе и преподавателе.

    Атрибуты:
        id (int): Уникальный идентификатор (наследуется от IDMixin).
        created_at (datetime): Дата создания (наследуется от TimestampMixin).
        user_id (int, optional): Ссылка на пользователя, оставившего отзыв (может быть null для анонимных).
        course_professor_id (int): Ссылка на комбинацию курс-преподаватель.
        rating_overall (int): Общая оценка (1-5).
        rating_difficulty (int): Оценка сложности (1-5).
        rating_usefulness (int): Оценка полезности (1-5).
        text_review (str): Текстовое содержание отзыва.
        is_on_moderation (bool): Требуется ли модерация перед публикацией.
    """

    user_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("user.id"), nullable=True
    )
    course_professor_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("course_professor.id"), nullable=False
    )
    rating_overall: Mapped[int] = mapped_column(Integer, nullable=False)
    rating_difficulty: Mapped[int] = mapped_column(Integer, nullable=False)
    rating_usefulness: Mapped[int] = mapped_column(Integer, nullable=False)
    text_review: Mapped[str] = mapped_column(Text, nullable=False)
    is_on_moderation: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    def __repr__(self) -> str:
        return (
            f"<Review(id={self.id}, course_professor_id={self.course_professor_id}, "
            f"rating_overall={self.rating_overall}, is_on_moderation={self.is_on_moderation})>"
        )
