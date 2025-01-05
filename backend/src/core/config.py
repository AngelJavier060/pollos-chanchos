from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import os

# Carga las credenciales desde variables de entorno o valores predeterminados
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://app_user:Alexandra1@localhost:5432/pollos_chanchos")

# Configura el motor asincrónico
engine = create_async_engine(DATABASE_URL, echo=True)

# Base para los modelos de SQLAlchemy
Base = declarative_base()

# Sesión asincrónica para consultas
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)
