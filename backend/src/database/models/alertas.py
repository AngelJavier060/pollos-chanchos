from sqlalchemy import Column, BigInteger, String, TIMESTAMP, CheckConstraint, func
from src.core.config import Base

class Alerta(Base):
    __tablename__ = "alertas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    tipo = Column(String)
    mensaje = Column(String)
    fecha = Column(TIMESTAMP, default=func.now())
    medio = Column(String, CheckConstraint("medio IN ('email', 'whatsapp', 'telegram')"))
