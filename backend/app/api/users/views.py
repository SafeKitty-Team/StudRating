from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/test")
async def hello_world():
    return {"message": "Hello, World!"}
