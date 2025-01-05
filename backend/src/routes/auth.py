from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel
from backend.src.core.config import get_db
from backend.src.core.utils import verify_password

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    username: str
    role: str

@router.post("/login", response_model=LoginResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    query = await db.execute(
        text("SELECT username, password, role FROM usuarios WHERE username = :username"),
        {"username": data.username}
    )
    user = query.fetchone()

    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    return {"username": user.username, "role": user.role}
