from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
from pathlib import Path

# Añadir el directorio raíz al path
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.routes import auth
from src.database import engine, Base
from src.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas de autenticación
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])  # Ruta adicional para compatibilidad

@app.on_event("startup")
def startup():
    # Crear las tablas de forma síncrona
    Base.metadata.create_all(bind=engine)

@app.get("/")
async def root():
    return {"message": "API is running"}
