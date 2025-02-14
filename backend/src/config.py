import os
from pathlib import Path

# Obtener la ruta absoluta del directorio del proyecto
BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    PROJECT_NAME = "Granja API"
    VERSION = "1.0.0"
    API_V1_STR = "/api/v1"
    JWT_SECRET = os.environ.get('JWT_SECRET', 'tu_clave_secreta_aqui')
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    DATABASE_URL = f"sqlite:///{BASE_DIR}/data/sql_app.db"

    # Variables de base de datos
    DB_USER = os.environ.get('DB_USER')
    DB_PASSWORD = os.environ.get('DB_PASSWORD')
    DB_HOST = os.environ.get('DB_HOST')
    DB_PORT = os.environ.get('DB_PORT')
    DB_NAME = os.environ.get('DB_NAME')

settings = Settings() 