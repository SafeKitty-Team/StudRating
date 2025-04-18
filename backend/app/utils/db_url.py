import os


def generate_postgres_db_url() -> str:
    """Создание URL для подключения к PostgreSQL базе данных"""
    db_config = {
        "user": os.getenv("POSTGRES_USER"),
        "password": os.getenv("POSTGRES_PASSWORD"),
        "host": os.getenv("POSTGRES_HOST"),
        "port": os.getenv("POSTGRES_PORT"),
        "db": os.getenv("POSTGRES_DB"),
    }

    db_url: str = (
        f"postgresql+asyncpg://{db_config['user']}:"
        f"{db_config['password']}@{db_config['host']}:"
        f"{db_config['port']}/{db_config['db']}"
    )
    return db_url
