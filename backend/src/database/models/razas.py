from sqlalchemy import Column, BigInteger, String, CheckConstraint
from src.core.config import Base

class Raza(Base):
    __tablename__ = "razas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    tipo_animal = Column(String, CheckConstraint("tipo_animal IN ('pollo', 'chancho')"))
