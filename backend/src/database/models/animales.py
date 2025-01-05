from sqlalchemy import Column, BigInteger, Numeric, String, ForeignKey, CheckConstraint
from src.core.config import Base

class Animal(Base):
    __tablename__ = "animales"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    lote_id = Column(BigInteger, ForeignKey("lotes.id"))
    peso = Column(Numeric)
    talla = Column(Numeric)
    estado = Column(String, CheckConstraint("estado IN ('vivo', 'enfermo', 'muerto', 'vendido')"))
    raza_id = Column(BigInteger, ForeignKey("razas.id"))
    foto_inicial = Column(String)
