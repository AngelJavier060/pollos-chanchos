from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.src.core.config import get_db
from src.database.models.lotes import Lote

router = APIRouter()

@router.get("/")
async def get_lotes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lote))
    return result.scalars().all()

@router.post("/")
async def create_lote(lote: dict, db: AsyncSession = Depends(get_db)):
    nuevo_lote = Lote(
        lote=lote["lote"],
        fecha_nacimiento=lote["fecha_nacimiento"],
        raza=lote["raza"],
        costo_lote=lote["costo_lote"],
    )
    db.add(nuevo_lote)
    await db.commit()
    await db.refresh(nuevo_lote)
    return nuevo_lote
