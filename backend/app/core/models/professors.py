from sqlalchemy import Integer, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
from .mixins.id_mixin import IDMixin


class Professor(IDMixin, Base):
    """
    Модель SQLAlchemy, представляющая преподавателя.

    Атрибуты:
        id (int): Уникальный идентификатор (наследуется от IDMixin).
        full_name (str): Полное имя преподавателя.
        academic_title (str): Академическое звание преподавателя.
        faculty_id (int): Идентификатор факультета (внешний ключ на таблицу Faculty).
        bio (str): Биография преподавателя.
    """

    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    academic_title: Mapped[str] = mapped_column(String(100), nullable=True)
    faculty_id: Mapped[int] = mapped_column(Integer, ForeignKey("faculty.id"))
    bio: Mapped[str] = mapped_column(String(500), nullable=True)

    def __repr__(self) -> str:
        return f"<Professor(id={self.id}, full_name='{self.full_name}', academic_title='{self.academic_title}', bio='{self.bio}')>"


class CourseProfessor(IDMixin, Base):
    """
    Модель SQLAlchemy для связи между курсами и преподавателями.

    Атрибуты:
        id (int): Уникальный идентификатор (наследуется от IDMixin).
        subject_id (int): Идентификатор курса (внешний ключ на таблицу Subject).
        professor_id (int): Идентификатор преподавателя (внешний ключ на таблицу Professor).
    """

    subject_id: Mapped[int] = mapped_column(Integer, ForeignKey("subject.id"))
    professor_id: Mapped[int] = mapped_column(Integer, ForeignKey("professor.id"))

    def __repr__(self) -> str:
        return f"<CourseProfessor(id={self.id}, subject_id={self.subject_id}, professor_id={self.professor_id})>"
