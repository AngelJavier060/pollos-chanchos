import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

import asyncio
from src.core.config import engine

async def test_connection():
    try:
        async with engine.connect() as conn:
            result = await conn.execute("SELECT 1")
            print("Conexión exitosa:", result.scalar())
    except Exception as e:
        print("Error al conectar:", e)

if __name__ == "__main__":
    asyncio.run(test_connection())
