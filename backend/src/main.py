from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.src.core.config import engine, Base
from src.routes import auth, chickens, lotes

# Crear la instancia de la aplicación
app = FastAPI()

# Configuración de CORS
origins = [
    "http://localhost:3000",  # URL del frontend local
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todos los headers
)

# Endpoint para la ruta raíz
@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Pollos y Chanchos"}

# Evento de inicio: inicializar la base de datos
@app.on_event("startup")
async def on_startup():
    try:
        async with engine.begin() as conn:
            # Crear todas las tablas en la base de datos
            await conn.run_sync(Base.metadata.create_all)
        print("Tablas creadas exitosamente.")
    except Exception as e:
        print(f"Error al crear las tablas: {e}")

# Incluir rutas de los módulos
app.include_router(auth.router, prefix="/auth", tags=["Autenticación"])
app.include_router(chickens.router, prefix="/chickens", tags=["Pollos"])
app.include_router(lotes.router, prefix="/lotes", tags=["Lotes"])
