from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase, declared_attr

from core.config import settings
from utils import camel_to_snake


class Base(DeclarativeBase):
    """Базовый класс для всех моделей базы данных"""

    __abstract__ = True  # Этот класс не будет создавать таблицу в базе данных

    metadata = MetaData(
        naming_convention=settings.db.naming_convention,
    )

    @declared_attr.directive
    def __tablename__(
        cls,
    ) -> str:  # Автоматическое создание имени таблицы на основе имени класса
        return camel_to_snake(cls.__name__)
