from sqlalchemy import Column, Integer, String, Float, Boolean
from ..database import Base

class Raza(Base):
    __tablename__ = "razas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)
    tipo_animal = Column(String)  # pollo o chancho
    peso_promedio = Column(Float)
    tamanio_promedio = Column(Float)
    edad_madurez = Column(Integer)
    tiempo_crecimiento = Column(Integer)
    estado = Column(Boolean, default=True)
    imagen_url = Column(String, nullable=True)
