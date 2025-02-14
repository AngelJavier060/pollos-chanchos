from sqlalchemy import Column, String, Boolean, DateTime, Integer, func
from datetime import datetime, timedelta
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    telefono = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    rol = Column(String, nullable=False)
    dias_vigencia = Column(Integer, default=30)
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_expiracion = Column(DateTime(timezone=True))

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.id:
            self.id = str(int(datetime.now().timestamp() * 1000))
        if self.rol != 'admin' and self.dias_vigencia:
            self.fecha_expiracion = datetime.now() + timedelta(days=self.dias_vigencia)
        elif self.rol == 'admin':
            self.fecha_expiracion = None 