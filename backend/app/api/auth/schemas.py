# [file name]: app/auth/schemas.py
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str

# Удалена CustomLoginтForm, так как используется стандартная OAuth2PasswordRequestForm