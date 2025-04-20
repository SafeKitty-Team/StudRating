from enum import Enum

from sqlalchemy import (
    Integer,
    Text,
    ForeignKey,
    Boolean,
    Enum as SQLAlchemyEnum,
    String,
    Table,
    Column,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .mixins.id_mixin import IDMixin
from .mixins.timestamp_mixin import TimestampMixin

# Association table for many-to-many relationship between Review and ReviewTag
review_tag_association = Table(
    "review_tag_association",
    Base.metadata,
    Column("review_id", ForeignKey("review.id"), primary_key=True),
    Column("review_tag_id", ForeignKey("review_tag.id"), primary_key=True),
)


class ReviewEntityType(str, Enum):
    # Используем строчные буквы для соответствия базе данных
    professor = "professor"
    subject = "subject"
    program = "program"
    faculty = "faculty"
    course_professor = "course_professor"  # для обратной совместимости


class Review(IDMixin, TimestampMixin, Base):
    """
    Модель SQLAlchemy, представляющая отзыв пользователя о курсе, преподавателе, программе или факультете.
    """

    user_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("user.id"), nullable=True
    )

    entity_type: Mapped[ReviewEntityType] = mapped_column(
        SQLAlchemyEnum(ReviewEntityType, name="review_entity_type"), nullable=False
    )
    entity_id: Mapped[int] = mapped_column(Integer, nullable=False)

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

    # Отношения
    course_professor: Mapped["CourseProfessor"] = relationship(
        "CourseProfessor", back_populates="reviews"
    )
    tags: Mapped[list["ReviewTag"]] = relationship(
        "ReviewTag",
        secondary=review_tag_association,
        back_populates="reviews",
        collection_class=list,
    )

    def __repr__(self) -> str:
        return (
            f"<Review(id={self.id}, entity_type={self.entity_type}, entity_id={self.entity_id}, "
            f"rating_overall={self.rating_overall}, is_on_moderation={self.is_on_moderation})>"
        )


class ReviewTag(IDMixin, Base):
    name: Mapped[str] = mapped_column(String(50), unique=False, index=True)

    reviews: Mapped[list[Review]] = relationship(
        "Review",
        secondary=review_tag_association,
        back_populates="tags",
        collection_class=list,
    )
