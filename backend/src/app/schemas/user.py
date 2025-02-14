from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    nombre: str = Field(..., min_length=1)
    apellido: str = Field(..., min_length=1)
    email: EmailStr
    telefono: str = Field(..., min_length=1)
    username: str = Field(..., min_length=1)
    rol: str = Field(..., pattern='^(admin|pollos|chanchos)$')
    dias_vigencia: int = Field(default=30, ge=0)

class UserCreate(UserBase):
    password: str = Field(..., min_length=1)

class UserUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[EmailStr] = None
    telefono: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    rol: Optional[str] = None
    dias_vigencia: Optional[int] = None
    activo: Optional[bool] = None

class UserResponse(UserBase):
    id: str
    activo: bool
    fecha_creacion: datetime
    fecha_expiracion: Optional[datetime] = None

    class Config:
        from_attributes = True 