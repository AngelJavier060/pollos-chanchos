import asyncio
import asyncpg

async def test_connection():
    try:
        conn = await asyncpg.connect(
            user='app_user',         # Usuario creado
            password='Alexandra1',   # Contraseña del usuario
            database='pollos_chanchos', # Base de datos
            host='localhost',        # Dirección del servidor
            port=5432                # Puerto por defecto de PostgreSQL
        )
        print("Conexión exitosa con asyncpg")
        await conn.close()
    except Exception as e:
        print(f"Error al conectar: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())
