from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ....app.database import get_db
from ....models.user import User
from ....schemas.user import UserCreate, UserResponse, Token, LoginRequest
from datetime import timedelta, datetime
from ....app.config import settings
import logging
import traceback
import bcrypt
from typing import List

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception as e:
        logger.error(f"Error verificando contraseña: {str(e)}")
        return False

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

# Endpoint temporal para desarrollo
@router.post("/reset-password/{usuario}")
async def reset_password(usuario: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.usuario == usuario).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user.password = hash_password("12345")
    db.commit()
    return {"message": "Contraseña actualizada"}

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Verificar si el usuario ya existe
    db_user = db.query(User).filter(User.usuario == user.usuario).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    # Crear nuevo usuario
    hashed_password = hash_password(user.password)
    db_user = User(
        usuario=user.usuario,
        password=hashed_password,
        correo=user.correo,
        nombre=user.nombre,
        apellido=user.apellido,
        estado=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
async def login(response: Response, request_data: LoginRequest, db: Session = Depends(get_db)):
    try:
        logger.info(f"Intento de login para usuario: {request_data.usuario}")
        
        # Validación de campos
        if not request_data.usuario or not request_data.password:
            logger.warning("Campos de usuario o contraseña vacíos")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Usuario y contraseña son requeridos"
            )

        # Buscar usuario
        user = db.query(User).filter(User.usuario == request_data.usuario).first()
        
        if not user:
            logger.warning(f"Usuario no encontrado: {request_data.usuario}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario o contraseña incorrectos"
            )
        
        # Verificar contraseña usando bcrypt
        if not verify_password(request_data.password, user.password):
            logger.warning(f"Contraseña incorrecta para usuario: {request_data.usuario}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario o contraseña incorrectos"
            )
        
        # Actualizar último acceso
        user.ultimo_acceso = datetime.utcnow()
        db.commit()

        # Generar un token simple para desarrollo
        simple_token = f"{user.usuario}_{datetime.utcnow().timestamp()}"

        return {
            "access_token": simple_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "usuario": user.usuario,
                "correo": user.correo,
                "nombre": user.nombre,
                "apellido": user.apellido,
                "estado": user.estado
            }
        }

    except HTTPException as he:
        logger.error(f"HTTP Exception en login: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Error en login: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/users", response_model=List[UserResponse])
async def get_users(db: Session = Depends(get_db)):
    try:
        users = db.query(User).all()
        return users
    except Exception as e:
        logger.error(f"Error obteniendo usuarios: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener la lista de usuarios"
        )