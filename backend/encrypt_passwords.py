from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text

# Configuración de bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuración de la base de datos
DATABASE_URL = "postgresql+asyncpg://postgres:Alexandra1@localhost:5432/pollos-chanchos"
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def encrypt_passwords():
    async with async_session() as session:
        async with session.begin():
            query = await session.execute(text("SELECT id, password FROM usuarios"))
            users = query.fetchall()

            for user in users:
                hashed_password = pwd_context.hash(user.password)
                await session.execute(
                    text("UPDATE usuarios SET password = :password WHERE id = :id"),
                    {"password": hashed_password, "id": user.id}
                )

        await session.commit()
        print("Contraseñas actualizadas exitosamente.")

if __name__ == "__main__":
    import asyncio
    asyncio.run(encrypt_passwords())
