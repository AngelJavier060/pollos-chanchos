from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from pathlib import Path

# Crear la clase Base
Base = declarative_base()

# Obtener la ruta absoluta del directorio del proyecto
BASE_DIR = Path(__file__).resolve().parent.parent
# Crear el directorio data si no existe
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

# Ruta de la base de datos
DB_FILE = os.path.join(DATA_DIR, "sql_app.db")
DATABASE_URL = f"sqlite:///{DB_FILE}"

print(f"Ruta de la base de datos: {DB_FILE}")
print(f"URL de la base de datos: {DATABASE_URL}")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=True  # Para ver las consultas SQL en la consola
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Importar los modelos después de crear Base
from .models.user import User  # Importar los modelos

# Crear las tablas
def init_db():
    try:
        print("Creando tablas...")
        Base.metadata.create_all(bind=engine)
        print("Tablas creadas exitosamente")
    except Exception as e:
        print("Error al crear las tablas:", str(e))
        raise e

# Inicializar la base de datos
init_db() 