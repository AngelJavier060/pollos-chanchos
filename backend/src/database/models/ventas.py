from sqlalchemy import Column, BigInteger, String, Numeric, Date, ForeignKey
from src.core.config import Base

class Venta(Base):
    __tablename__ = "ventas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    animal_id = Column(BigInteger, ForeignKey("animales.id"))
    comprador = Column(String)
    precio = Column(Numeric)
    fecha = Column(Date)
