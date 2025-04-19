from typing import List


from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .mixins.id_mixin import IDMixin


class Faculty(IDMixin, Base):
    """
    Модель SQLAlchemy, представляющая факультет.

    Атрибуты:
        id (int): Уникальный идентификатор (наследуется от IDMixin).
        name (str): Название кафедры (до 150 символов).
        description (str): Описание кафедры.
    """

    name: Mapped[str] = mapped_column(String(150), nullable=False, unique=True)
    description: Mapped[str] = mapped_column(String(500), nullable=True)

    def __repr__(self) -> str:
        return f"<Faculty(id={self.id}, name='{self.name}, description={self.description}, program={self.program})>"
