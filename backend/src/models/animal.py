from sqlalchemy import Column, String, Date, Enum, Float, Integer
import enum
from datetime import date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class TipoAnimal(str, enum.Enum):
    POLLO = "pollo"
    CHANCHO = "chancho"

class Animal(Base):
    __tablename__ = "animales"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String, unique=True, index=True)
    tipo = Column(Enum(TipoAnimal))
    peso = Column(Float)
    fecha_ingreso = Column(Date, default=date.today)
    estado = Column(String, default="activo")  # activo, vendido, fallecido

    # Información básica
    raza = Column(String)
    fecha_nacimiento = Column(Date)
    
    # Información de peso y salud
    peso_inicial = Column(Float)
    peso_actual = Column(Float)
    estado_salud = Column(String)
    
    # Información de ubicación
    area = Column(String)  # Área o galpón donde se encuentra
    
    # Costos y valores
    costo_inicial = Column(Float)
    precio_venta_estimado = Column(Float)
    
    # Campos para seguimiento
    notas = Column(String, nullable=True) 