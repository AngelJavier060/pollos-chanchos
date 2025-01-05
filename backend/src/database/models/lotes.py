from sqlalchemy import Column, Integer, String, Date, Float
from sqlalchemy.ext.declarative import declarative_base

# Base para modelos
Base = declarative_base()

# Definición del modelo Lotes
class Lotes(Base):
    __tablename__ = "lotes"

    id = Column(Integer, primary_key=True, index=True)  # ID primario
    lote = Column(String, unique=True, nullable=False)  # Nombre único del lote
    fecha_nacimiento = Column(Date, nullable=False)     # Fecha de nacimiento
    raza = Column(String, nullable=False)               # Raza
    costo_lote = Column(Float, nullable=False)          # Costo del lote
