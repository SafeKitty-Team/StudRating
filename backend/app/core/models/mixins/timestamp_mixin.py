from datetime import datetime

from sqlalchemy import DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, declared_attr


class TimestampMixin:
    """Mixin для добавления временных меток создания и обновления"""

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=func.now(),
        server_default=func.now(),
        nullable=False,
    )

    @declared_attr
    def updated_at(cls) -> Mapped[datetime | None]:
        # Для включения поля updated_at необходимо указать include_updated_at = True в дочернем классе
        if hasattr(cls, "include_updated_at") and cls.include_updated_at:
            return mapped_column(
                DateTime,
                default=func.now(),
                server_default=func.now(),
                onupdate=func.now(),
                nullable=False,
            )
        return None
