import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager

from fastapi.middleware.cors import CORSMiddleware

from core.models import db_helper
from core.config import settings
from api import router as api_router


@asynccontextmanager
async def lifespan(lifespan_app: FastAPI):
    # Код, выполняемый перед запуском приложения
    yield
    # Код, выполняемый после завершения работы приложения
    await db_helper.dispose()  # Закрытие всех соединений с БД


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # любые Origin
    allow_credentials=True,  # передавать куки/credentials
    allow_methods=["*"],  # любые HTTP-методы
    allow_headers=["*"],  # любые заголовки
)
app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.run.host,
        port=settings.run.port,
        reload=True,
    )
