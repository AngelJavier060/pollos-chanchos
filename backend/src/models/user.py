from sqlalchemy import Column, Integer, String, Boolean, Enum, DateTime
import enum
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from ..database import Base

class RolUsuario(str, enum.Enum):
    ADMIN = "admin"
    OPERADOR = "operador"
    VENDEDOR = "vendedor"

class User(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    usuario = Column(String, unique=True)
    correo = Column(String, unique=True)
    nombre = Column(String)
    apellido = Column(String)
    password = Column(String)
    rol = Column(String)
    vigencia = Column(Integer)
    estado = Column(Boolean, default=True)
    fecha_registro = Column(DateTime, default=datetime.utcnow)
    ultimo_acceso = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Usuario {self.usuario}>"