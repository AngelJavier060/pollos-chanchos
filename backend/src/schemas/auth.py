from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCredentials(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict | None = None

class UserLogin(BaseModel):
    usuario: str
    correo: str
    nombre: str
    apellido: str
    rol: str
    estado: bool

    class Config:
        orm_mode = True

class UserResponse(BaseModel):
    id: int
    usuario: str
    correo: str
    nombre: str
    apellido: str
    rol: str
    estado: bool
    fecha_registro: datetime
    ultimo_acceso: Optional[datetime] = None

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    usuario: str
    correo: EmailStr
    nombre: str
    apellido: str
    rol: str
    vigencia: int
    password: str

class UserUpdate(BaseModel):
    usuario: Optional[str] = None
    correo: Optional[EmailStr] = None
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    rol: Optional[str] = None
    vigencia: Optional[int] = None
    password: Optional[str] = None
    estado: Optional[bool] = None 