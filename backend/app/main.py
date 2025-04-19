import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager

from core.models import db_helper
from core.config import settings
from api import router as api_router
from api.auth.router import router as auth_rout


@asynccontextmanager
async def lifespan(lifespan_app: FastAPI):
    # Код, выполняемый перед запуском приложения
    yield
    # Код, выполняемый после завершения работы приложения
    await db_helper.dispose()  # Закрытие всех соединений с БД


app = FastAPI(lifespan=lifespan)

app.include_router(api_router)
app.include_router(auth_rout)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.run.host,
        port=settings.run.port,
        reload=True,
    )
