from typing import List
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
from .mixins.id_mixin import IDMixin


class Subject(IDMixin, Base):
    """
    Модель SQLAlchemy, представляющая предмет.

    Атрибуты:
        id (int): Уникальный идентификатор (наследуется от IDMixin).
        name (str): Название предмета.
        description (str): Описание предмета.
        program_id (int): Идентификатор программы (внешний ключ на таблицу Program).
    """

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    program_id: Mapped[int] = mapped_column(Integer, ForeignKey("program.id"))

    program: Mapped[List["Program"]] = relationship("Program", back_populates="subject")

    def __repr__(self) -> str:
        return f"<Subject(id={self.id}, name='{self.name}', description='{self.description}')>"
