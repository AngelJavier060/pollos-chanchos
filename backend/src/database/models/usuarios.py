from sqlalchemy import Column, BigInteger, String, Boolean, ForeignKey
from src.core.config import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    contraseña = Column(String, nullable=False)
    estado = Column(Boolean, default=True)
    rol_id = Column(BigInteger, ForeignKey("roles.id"))
