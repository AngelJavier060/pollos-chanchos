from sqlalchemy import Column, String, Date, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
from datetime import date
from .base import BaseModel

class Alimentacion(BaseModel):
    """Modelo para el registro de alimentación"""
    
    fecha = Column(Date, default=date.today)
    tipo_alimento = Column(String)  # Tipo o marca del alimento
    cantidad_kg = Column(Float)
    costo_por_kg = Column(Float)
    area = Column(String)  # Área o galpón donde se suministró
    
    # Costos totales
    costo_total = Column(Float)
    
    # Notas adicionales
    observaciones = Column(String, nullable=True) 