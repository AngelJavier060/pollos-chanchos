from sqlalchemy import Column, BigInteger, String, TIMESTAMP, ForeignKey, func
from src.core.config import Base

class Auditoria(Base):
    __tablename__ = "auditoria"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    usuario_id = Column(BigInteger, ForeignKey("usuarios.id"))
    accion = Column(String, nullable=False)
    fecha = Column(TIMESTAMP, default=func.now())
