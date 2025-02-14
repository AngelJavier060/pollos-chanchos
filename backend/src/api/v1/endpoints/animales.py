from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from ....app.database import get_db
from ....models.animal import Animal, TipoAnimal
from pydantic import BaseModel

router = APIRouter()

# Esquemas Pydantic
class AnimalBase(BaseModel):
    codigo: str
    tipo: TipoAnimal
    raza: str
    fecha_nacimiento: date
    peso_inicial: float
    peso_actual: float
    estado_salud: str
    area: str
    costo_inicial: float
    precio_venta_estimado: float
    notas: str | None = None
    estado: str = "activo"

class AnimalCreate(AnimalBase):
    pass

class AnimalResponse(AnimalBase):
    id: int
    created_at: date
    updated_at: date

    class Config:
        from_attributes = True

# Endpoints
@router.post("/", response_model=AnimalResponse)
def crear_animal(animal: AnimalCreate, db: Session = Depends(get_db)):
    db_animal = Animal(**animal.model_dump())
    db.add(db_animal)
    db.commit()
    db.refresh(db_animal)
    return db_animal

@router.get("/", response_model=List[AnimalResponse])
def listar_animales(
    skip: int = 0, 
    limit: int = 100, 
    tipo: TipoAnimal | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Animal)
    if tipo:
        query = query.filter(Animal.tipo == tipo)
    return query.offset(skip).limit(limit).all()

@router.get("/{animal_id}", response_model=AnimalResponse)
def obtener_animal(animal_id: int, db: Session = Depends(get_db)):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if animal is None:
        raise HTTPException(status_code=404, detail="Animal no encontrado")
    return animal

@router.put("/{animal_id}", response_model=AnimalResponse)
def actualizar_animal(
    animal_id: int, 
    animal_update: AnimalBase, 
    db: Session = Depends(get_db)
):
    db_animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if db_animal is None:
        raise HTTPException(status_code=404, detail="Animal no encontrado")
        
    for key, value in animal_update.model_dump().items():
        setattr(db_animal, key, value)
    
    db.commit()
    db.refresh(db_animal)
    return db_animal 