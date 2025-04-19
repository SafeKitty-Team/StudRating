from dotenv import load_dotenv
import os
from pathlib import Path

from pydantic import BaseModel
from pydantic import PostgresDsn
from pydantic_settings import BaseSettings

from utils import generate_postgres_db_url

# Загрузка переменных окружения из файла .env, расположенного в директории backend
backend_path = Path(__file__).resolve().parent.parent.parent
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(backend_path / ".env")


class RunConfig(BaseModel):
    """Конфигурация для запуска приложения"""

    host: str = "0.0.0.0"  # Хост по умолчанию для привязки приложения
    port: int = int(
        os.getenv("BACKEND_PORT")
    )  # Порт для запуска приложения, получаемый из переменных окружения


class DatabaseConfig(BaseModel):
    """Конфигурация подключения к базе данных"""

    url: PostgresDsn = (
        generate_postgres_db_url()
    )  # Генерация URL для подключения к PostgreSQL
    echo: bool = False  # Логировать SQL-запросы (полезно для отладки)
    echo_pool: bool = False  # Логировать события пула соединений
    max_overflow: int = 20  # Максимальное количество соединений сверх pool_size
    pool_size: int = 10  # Количество соединений в пуле
    naming_convention: dict[str, str] = (
        {  # Соглашения по именованию для ограничений и индексов БД
            "ix": "ix_%(column_0_label)s",
            "uq": "uq_%(table_name)s_%(column_0_N_name)s",
            "ck": "ck_%(table_name)s_%(constraint_name)s",
            "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
            "pk": "pk_%(table_name)s",
        }
    )


class AuthJWT(BaseModel):
    private_key_path: Path = BASE_DIR / "keys" / "jwt-private.pem"
    public_key_path: Path = BASE_DIR / "keys" / "jwt-public.pem"
    algorithm: str = "RS256"
    access_token_expire_minutes: int = 30


class Settings(BaseSettings):
    """Основной класс настроек приложения"""

    run: RunConfig = RunConfig()  # Конфигурация запуска приложения
    db: DatabaseConfig = DatabaseConfig()  # Конфигурация базы данных
    auth_jwt: AuthJWT = AuthJWT()


settings = Settings()
