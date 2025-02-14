from pydantic import BaseModel
from typing import Optional

class RazaBase(BaseModel):
    nombre: str
    tipo_animal: str
    peso_promedio: float
    tamanio_promedio: float
    edad_madurez: int
    tiempo_crecimiento: int
    estado: bool
    imagen_url: Optional[str] = None

class RazaCreate(RazaBase):
    pass

class RazaUpdate(RazaBase):
    pass

class Raza(RazaBase):
    id: int

    class Config:
        from_attributes = True
