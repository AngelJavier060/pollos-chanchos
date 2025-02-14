from datetime import datetime
from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.ext.declarative import declared_attr
from src.app.database import Base

class BaseModel(Base):
    """Modelo base para todos los modelos"""
    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Generar __tablename__ automáticamente
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower() + 's'
