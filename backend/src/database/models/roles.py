from sqlalchemy import Column, BigInteger, String, JSON
from src.core.config import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    permisos = Column(JSON)
