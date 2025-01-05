# src/database/utils.py

from passlib.context import CryptContext

# Configuración para hash de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica si la contraseña plana coincide con la contraseña hasheada.
    """
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    """
    Genera un hash para la contraseña proporcionada.
    """
    return pwd_context.hash(password)
