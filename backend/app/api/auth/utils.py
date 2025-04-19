# [file name]: app/auth/utils.py
from datetime import datetime, timedelta
from pathlib import Path
from typing import Annotated

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from core.models.db_helper import db_helper
from .crud import get_user_by_email
from core.models.users import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# Нужно указать полный путь (включая префикс /auth)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.auth_jwt.access_token_expire_minutes)
    to_encode.update({"exp": expire})

    with open(settings.auth_jwt.private_key_path, "rb") as key_file:
        private_key = key_file.read().decode('utf-8')

    if "-----BEGIN" not in private_key:
        raise ValueError("Invalid private key format")

    return jwt.encode(
        to_encode,
        private_key,
        algorithm=settings.auth_jwt.algorithm
    )


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: AsyncSession = Depends(db_helper.session_getter)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        with open(settings.auth_jwt.public_key_path, "r") as key_file:
            public_key = key_file.read()

        payload = jwt.decode(
            token,
            public_key,
            algorithms=[settings.auth_jwt.algorithm]
        )
        email: str = payload.get("sub")
        if not email:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await get_user_by_email(email, session)
    if user is None:
        raise credentials_exception
    return user


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)