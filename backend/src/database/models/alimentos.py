from sqlalchemy import Column, BigInteger, String, Numeric
from src.core.config import Base

class Alimento(Base):
    __tablename__ = "alimentos"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    tipo = Column(String, nullable=False)
    marca = Column(String)
    cantidad_estandar = Column(Numeric)
