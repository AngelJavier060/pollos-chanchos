from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from ..models.user import RolUsuario

class UserBase(BaseModel):
    usuario: str
    correo: EmailStr
    nombre: str
    apellido: str
    rol: RolUsuario

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    correo: Optional[EmailStr] = None
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    estado: bool
    fecha_registro: datetime
    ultimo_acceso: Optional[datetime] = None

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    usuario: str
    password: str

class UserInResponse(BaseModel):
    id: int
    usuario: str
    correo: str
    nombre: str
    apellido: str
    rol: RolUsuario

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict
    expires_in: Optional[int] = None

class TokenData(BaseModel):
    usuario: str | None = None
    rol: RolUsuario | None = None
    correo: str | None = None
    nombre: str | None = None
    apellido: str | None = None

class ForgotPasswordRequest(BaseModel):
    correo: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str  # Removemos la restricción de longitud mínima para debugging