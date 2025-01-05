from sqlalchemy import Column, BigInteger, String, Boolean, Date, CheckConstraint
from src.core.config import Base

class Mantenimiento(Base):
    __tablename__ = "mantenimiento"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    tipo = Column(String, CheckConstraint("tipo IN ('fumigacion', 'limpieza')"), nullable=False)
    fecha_programada = Column(Date, nullable=False)
    completado = Column(Boolean, default=False)
