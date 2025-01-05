from sqlalchemy import Column, BigInteger, Date, Numeric, String, ForeignKey
from src.core.config import Base

class SeguimientoAnimal(Base):
    __tablename__ = "seguimiento_animales"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    animal_id = Column(BigInteger, ForeignKey("animales.id"))
    fecha = Column(Date)
    peso = Column(Numeric)
    talla = Column(Numeric)
    estado = Column(String)
    foto = Column(String)
