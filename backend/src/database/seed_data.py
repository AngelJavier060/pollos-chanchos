import asyncio
from datetime import date
from src.core.config import engine, async_session
from src.database.models.lotes import Lotes, Base  # Asegúrate de importar correctamente el modelo y la base.

async def create_tables():
    async with engine.begin() as conn:
        # Eliminar todas las tablas existentes
        print("Eliminando todas las tablas...")
        await conn.run_sync(Base.metadata.drop_all)
        print("Tablas eliminadas correctamente.")
        
        # Crear tablas nuevamente
        print("Creando todas las tablas...")
        await conn.run_sync(Base.metadata.create_all)
        print("Tablas creadas correctamente.")

        # Verificar las tablas existentes
        result = await conn.execute(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"
        )
        tables = result.fetchall()
        print("Tablas existentes después de crear:", tables)

        # Verificar columnas de la tabla 'lotes'
        result = await conn.execute(
            "SELECT column_name FROM information_schema.columns WHERE table_name = 'lotes';"
        )
        columns = result.fetchall()
        print("Columnas de la tabla 'lotes':", columns)

async def seed_data():
    async with async_session() as session:
        async with session.begin():
            # Insertar datos iniciales
            print("Insertando datos iniciales...")
            lotes_data = [
                {"lote": "lote001", "fecha_nacimiento": date(2024, 1, 15), "raza": "Criollo", "costo_lote": 1500.0},
                {"lote": "lote002", "fecha_nacimiento": date(2024, 2, 20), "raza": "Camperos", "costo_lote": 2000.0},
            ]
            lotes = [Lotes(**data) for data in lotes_data]
            session.add_all(lotes)

        print("Datos iniciales insertados correctamente.")

async def initialize_database():
    await create_tables()
    await seed_data()

if __name__ == "__main__":
    asyncio.run(initialize_database())
