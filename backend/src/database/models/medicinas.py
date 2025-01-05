from sqlalchemy import Column, BigInteger, String
from src.core.config import Base

class Medicina(Base):
    __tablename__ = "medicinas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    tipo = Column(String)
    dosis = Column(String)
    categoria = Column(String)
