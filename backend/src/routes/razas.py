from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models.razas import Raza
from ..schemas.razas import RazaCreate, RazaUpdate
import os
from src.utils.file_handler import save_upload_file

router = APIRouter()

@router.get("/api/razas")
async def get_razas(db: Session = Depends(get_db)):
    razas = db.query(Raza).all()
    return razas

@router.post("/api/razas")
async def create_raza(
    nombre: str = Form(...),
    tipo_animal: str = Form(...),
    peso_promedio: float = Form(...),
    tamanio_promedio: float = Form(...),
    edad_madurez: int = Form(...),
    tiempo_crecimiento: int = Form(...),
    estado: bool = Form(...),
    imagen: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    try:
        imagen_url = None
        if imagen:
            imagen_url = await save_upload_file(imagen, "razas")

        raza = Raza(
            nombre=nombre,
            tipo_animal=tipo_animal,
            peso_promedio=peso_promedio,
            tamanio_promedio=tamanio_promedio,
            edad_madurez=edad_madurez,
            tiempo_crecimiento=tiempo_crecimiento,
            estado=estado,
            imagen_url=imagen_url
        )
        
        db.add(raza)
        db.commit()
        db.refresh(raza)
        return raza
    except Exception as e:
        if imagen_url and os.path.exists(imagen_url):
            os.remove(imagen_url)
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/razas/{raza_id}")
async def update_raza(
    raza_id: int,
    nombre: str = Form(...),
    tipo_animal: str = Form(...),
    peso_promedio: float = Form(...),
    tamanio_promedio: float = Form(...),
    edad_madurez: int = Form(...),
    tiempo_crecimiento: int = Form(...),
    estado: bool = Form(...),
    imagen: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    raza = db.query(Raza).filter(Raza.id == raza_id).first()
    if not raza:
        raise HTTPException(status_code=404, detail="Raza no encontrada")

    try:
        if imagen:
            # Si hay una imagen anterior, la eliminamos
            if raza.imagen_url and os.path.exists(raza.imagen_url):
                os.remove(raza.imagen_url)
            raza.imagen_url = await save_upload_file(imagen, "razas")

        raza.nombre = nombre
        raza.tipo_animal = tipo_animal
        raza.peso_promedio = peso_promedio
        raza.tamanio_promedio = tamanio_promedio
        raza.edad_madurez = edad_madurez
        raza.tiempo_crecimiento = tiempo_crecimiento
        raza.estado = estado

        db.commit()
        db.refresh(raza)
        return raza
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/razas/{raza_id}")
async def delete_raza(raza_id: int, db: Session = Depends(get_db)):
    raza = db.query(Raza).filter(Raza.id == raza_id).first()
    if not raza:
        raise HTTPException(status_code=404, detail="Raza no encontrada")

    try:
        if raza.imagen_url and os.path.exists(raza.imagen_url):
            os.remove(raza.imagen_url)
        
        db.delete(raza)
        db.commit()
        return {"message": "Raza eliminada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
