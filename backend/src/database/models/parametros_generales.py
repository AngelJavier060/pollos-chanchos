from sqlalchemy import Column, BigInteger, JSON
from src.core.config import Base

class ParametrosGenerales(Base):
    __tablename__ = "parametros_generales"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    frecuencia_alertas = Column(JSON)
    rango_peso_talla = Column(JSON)
    duracion_produccion = Column(JSON)
