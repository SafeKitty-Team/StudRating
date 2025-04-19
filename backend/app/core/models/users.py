from sqlalchemy import String, Enum, LargeBinary
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
from .mixins.id_mixin import IDMixin
from .mixins.timestamp_mixin import TimestampMixin
import enum


class UserRole(enum.Enum):
    user = "user"
    admin = "admin"
    superuser = "superuser"


class User(IDMixin, TimestampMixin, Base):
    """
    Модель SQLAlchemy, представляющая пользователя системы.

    Атрибуты:
        id (int): Уникальный идентификатор (наследуется от IDMixin).
        created_at (datetime): Дата создания (наследуется от TimestampMixin).
        updated_at (datetime): Дата последнего обновления (наследуется от TimestampMixin).
        username (str): Уникальное имя пользователя (до 150 символов).
        email (str): Электронная почта пользователя.
        password (bytes): Хешированный пароль пользователя.
        roles (enum): Роль пользователя — может быть 'user', 'admin' или 'superuser'.

    Примечания:
        - Используются миксины IDMixin и TimestampMixin для общих полей.
        - Предполагается, что анонимные отзывы возможны, но с контролем (по username/email).
    """

    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String, nullable=False)
    roles: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role"),
        default=UserRole.user,
        nullable=False,
    )

    def __repr__(self) -> str:
        return (
            f"<User(id={self.id}, email='{self.email}', "
            f"roles='{self.roles.value}', created_at='{self.created_at}')>"
        )
