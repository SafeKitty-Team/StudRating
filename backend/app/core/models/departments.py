from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
from .mixins.id_mixin import IDMixin
from .mixins.timestamp_mixin import TimestampMixin


class Department(IDMixin, TimestampMixin, Base):
    """
    Модель SQLAlchemy, представляющая кафедру.

    Атрибуты:
        id (int): Уникальный идентификатор (наследуется от IDMixin).
        created_at (datetime): Дата создания (наследуется от TimestampMixin).
        updated_at (datetime): Дата последнего обновления (наследуется от TimestampMixin).
        name (str): Название кафедры (до 150 символов).
        description (str): Описание кафедры.
        faculty_id (int): Внешний ключ на факультет.
    """

    name: Mapped[str] = mapped_column(String(150), nullable=False, unique=True)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculties.id"), nullable=False)


    def __repr__(self) -> str:
        return (
            f"<Department(id={self.id}, name='{self.name}', "
            f"faculty_id={self.faculty_id}, created_at='{self.created_at}')>"
        )
