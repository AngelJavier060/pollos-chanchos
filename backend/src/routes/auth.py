from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..schemas.auth import Token, UserLogin, UserCredentials, UserResponse, UserBase, UserUpdate
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from ..config import settings
from pydantic import ValidationError
from typing import List, Optional

print("\n=== CONFIGURANDO AUTH ===")

router = APIRouter()

# Configuración de hashing de contraseñas
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12  # Ajustar el costo del hashing
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Función para verificar contraseña
def verify_password(plain_password, hashed_password):
    try:
        print("\n=== DEBUG VERIFY PASSWORD ===")
        print("Plain password:", plain_password)
        print("Hashed password:", hashed_password)
        print("Tipo de plain_password:", type(plain_password))
        print("Tipo de hashed_password:", type(hashed_password))
        print("Longitud de plain_password:", len(plain_password))
        print("Longitud de hashed_password:", len(hashed_password) if hashed_password else 0)
        
        if not hashed_password:
            print("ERROR: hashed_password es None o vacío")
            return False
            
        if not isinstance(hashed_password, str):
            print("ERROR: hashed_password no es string")
            return False
            
        # Probar crear un hash nuevo para ver si bcrypt funciona
        test_hash = pwd_context.hash("test")
        print("Test hash creado:", test_hash)
            
        result = pwd_context.verify(plain_password, hashed_password)
        print("Resultado de verificación:", result)
        return result
    except Exception as e:
        print("Error en verify_password:", str(e))
        print("Tipo de error:", type(e))
        import traceback
        print("Traceback:", traceback.format_exc())
        return False

# Función para hashear contraseña
def get_password_hash(password: str) -> str:
    try:
        print("\n=== DEBUG GET PASSWORD HASH ===")
        print("Password a hashear:", password)
        hashed = pwd_context.hash(password)
        print("Hash generado:", hashed)
        print("Longitud del hash:", len(hashed))
        return hashed
    except Exception as e:
        print("Error hasheando password:", str(e))
        import traceback
        print("Traceback:", traceback.format_exc())
        raise e

# Función para generar token JWT
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    try:
        print("\n=== DEBUG TOKEN LOGIN ===")
        print("Username recibido:", form_data.username)
        print("Password recibido:", form_data.password)
        
        # 1. Buscar usuario
        result = db.execute("""
            SELECT id, usuario, correo, password, rol, estado 
            FROM usuarios 
            WHERE usuario = :username
        """, {"username": form_data.username})
        
        user = result.first()
        
        if not user:
            print("Usuario no encontrado")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        print("\nUsuario encontrado:")
        print(f"ID: {user[0]}")
        print(f"Usuario: {user[1]}")
        print(f"Correo: {user[2]}")
        print(f"Password hash: {user[3]}")
        print(f"Rol: {user[4]}")
        print(f"Estado: {user[5]}")
        
        # 2. Verificar contraseña
        print("\nVerificando contraseña...")
        is_valid = verify_password(form_data.password, user[3])
        print(f"¿Contraseña válida?: {is_valid}")
        
        if not is_valid:
            print("Contraseña inválida")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        # 3. Verificar estado
        if user[5] != 1:
            print("Usuario inactivo")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario inactivo",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        print("\nGenerando token...")
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={
                "sub": user[2],  # Usar correo como identificador
                "username": user[1],
                "rol": user[4]
            },
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user[0],
                "usuario": user[1],
                "correo": user[2],
                "rol": user[4]
            }
        }
        
    except Exception as e:
        print("\nError en login:")
        print(str(e))
        import traceback
        print("Traceback completo:")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en login: {str(e)}"
        )

@router.get("/me", response_model=UserLogin)
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.correo == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/login")
async def login(credentials: UserCredentials, db: Session = Depends(get_db)):
    try:
        print("\n=== DEBUG LOGIN ===")
        print("Credenciales recibidas:", credentials.dict())
        
        # Buscar usuario por usuario o correo
        user = db.query(User).filter(
            (User.usuario == credentials.username) | 
            (User.correo == credentials.username)
        ).first()
        
        print("Buscando usuario:", credentials.username)
        print("Usuario encontrado:", user.usuario if user else "No encontrado")
        
        if not user:
            print("Usuario no encontrado")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario o correo no encontrado"
            )

        # Verificar contraseña
        print("Verificando contraseña...")
        print("Password recibido:", credentials.password)
        print("Password almacenado:", user.password[:10] + "...")
        
        if not verify_password(credentials.password, user.password):
            print("Contraseña incorrecta")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Contraseña incorrecta"
            )

        print("Contraseña correcta, generando token...")
        
        # Actualizar último acceso
        user.ultimo_acceso = datetime.utcnow()
        db.commit()
        
        # Generar token
        access_token = create_access_token(
            data={
                "sub": user.usuario,
                "role": user.rol,
                "user_id": user.id
            }
        )
        
        response_data = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "usuario": user.usuario,
                "correo": user.correo,
                "nombre": user.nombre,
                "apellido": user.apellido,
                "rol": user.rol,
                "estado": user.estado
            }
        }
        
        print("Respuesta a enviar:", response_data)
        return response_data
            
    except Exception as e:
        print("\n=== ERROR EN LOGIN ===")
        print("Tipo de error:", type(e))
        print("Error:", str(e))
        import traceback
        print("Traceback completo:")
        print(traceback.format_exc())
        
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en el proceso de login: {str(e)}"
        )

@router.post("/test/create-user")
async def create_test_user(db: Session = Depends(get_db)):
    try:
        # Verificar si el usuario ya existe
        test_user = db.query(User).filter(User.usuario == "test").first()
        if test_user:
            return {
                "message": "Usuario de prueba ya existe",
                "user": {
                    "id": test_user.id,
                    "usuario": test_user.usuario,
                    "email": test_user.email
                }
            }

        # Crear usuario de prueba
        hashed_password = pwd_context.hash("test123")
        new_user = User(
            usuario="test",
            email="test@example.com",
            nombre="Usuario",
            apellido="Prueba",
            hashed_password=hashed_password,
            rol="admin",
            vigencia=365,
            estado=True,
            fecha_registro=datetime.utcnow(),
            ultimo_acceso=datetime.utcnow()
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {
            "message": "Usuario de prueba creado exitosamente",
            "user": {
                "id": new_user.id,
                "usuario": new_user.usuario,
                "email": new_user.email
            }
        }
    except Exception as e:
        print("Error al crear usuario de prueba:", str(e))
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": "Error al crear usuario de prueba",
                "error": str(e)
            }
        ) 

@router.get("/test/users")
async def list_users(db: Session = Depends(get_db)):
    try:
        users = db.query(User).all()
        return {
            "total": len(users),
            "users": [
                {
                    "id": user.id,
                    "usuario": user.usuario,
                    "email": user.email,
                    "nombre": user.nombre,
                    "apellido": user.apellido,
                    "rol": user.rol,
                    "estado": user.estado
                }
                for user in users
            ]
        }
    except Exception as e:
        print("Error al listar usuarios:", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": "Error al listar usuarios",
                "error": str(e)
            }
        ) 

@router.get("/debug/check-password/{username}")
async def check_password(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.usuario == username).first()
    if not user:
        return {"message": "Usuario no encontrado"}
    return {
        "usuario": user.usuario,
        "password_hash": user.password,
        "password_length": len(user.password) if user.password else 0
    } 

@router.get("/debug/users")
async def list_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            "id": user.id,
            "usuario": user.usuario,
            "correo": user.correo,
            "nombre": user.nombre,
            "apellido": user.apellido,
            "password": user.password[:10] + "..." if user.password else None,  # Solo mostramos parte del hash
            "rol": user.rol,
            "estado": user.estado
        }
        for user in users
    ] 

@router.post("/debug/create-test-user")
async def create_debug_user(db: Session = Depends(get_db)):
    try:
        # Crear contraseña hasheada
        hashed_password = pwd_context.hash("12345")
        
        # Crear usuario de prueba
        new_user = User(
            usuario="admintest",
            correo="admintest@example.com",
            nombre="Admin",
            apellido="Test",
            password=hashed_password,  # Guardamos la contraseña hasheada
            rol="admin",
            vigencia=365,
            estado=True,
            fecha_registro=datetime.utcnow(),
            ultimo_acceso=datetime.utcnow()
        )
        
        db.add(new_user)
        db.commit()
        
        return {
            "message": "Usuario de prueba creado",
            "user": {
                "usuario": new_user.usuario,
                "correo": new_user.correo,
                "password_hash": hashed_password
            }
        }
    except Exception as e:
        print("Error:", str(e))
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 

@router.post("/create-admin")
async def create_admin(db: Session = Depends(get_db)):
    try:
        # Verificar si ya existe un usuario con ese nombre
        existing_user = db.query(User).filter(User.usuario == "admin").first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un usuario con ese nombre"
            )
        
        # Crear el hash de la contraseña
        hashed_password = get_password_hash("admin123")
        print("Password hasheado:", hashed_password)
        
        # Crear nuevo usuario
        new_user = User(
            usuario="admin",
            correo="admin@example.com",
            nombre="Admin",
            apellido="User",
            password=hashed_password,
            rol="admin",
            vigencia=365,
            estado=True
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {"message": "Usuario admin creado exitosamente", "usuario": new_user.usuario}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear usuario admin: {str(e)}"
        )

security = HTTPBearer()

@router.get("/users")
async def get_users(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        # Verificar el token
        token = credentials.credentials
        try:
            # Decodificar el token
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
            user_email = payload.get("sub")
            
            # Imprimir para debug
            print(f"Token decodificado: {payload}")
            print(f"Email del usuario: {user_email}")
            
            # Obtener el usuario actual
            current_user = db.query(User).filter(User.correo == user_email).first()
            if not current_user:
                print("Usuario no encontrado en la base de datos")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Usuario no encontrado"
                )
            
            print(f"Usuario actual: {current_user.usuario} - Rol: {current_user.rol}")
            
            # Verificar si es admin
            if current_user.rol != "admin":
                print(f"Usuario {current_user.usuario} no tiene permisos de admin")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="No tiene permisos para ver la lista de usuarios"
                )

            # Obtener todos los usuarios
            users = db.query(User).all()
            print(f"Usuarios encontrados: {len(users)}")
            
            # Convertir a diccionario para la respuesta
            users_response = []
            for user in users:
                users_response.append({
                    "id": user.id,
                    "usuario": user.usuario,
                    "correo": user.correo,
                    "nombre": user.nombre,
                    "apellido": user.apellido,
                    "rol": user.rol,
                    "estado": user.estado,
                    "fecha_registro": user.fecha_registro.isoformat() if user.fecha_registro else None,
                    "ultimo_acceso": user.ultimo_acceso.isoformat() if user.ultimo_acceso else None
                })
            
            return users_response
            
        except JWTError as e:
            print(f"Error al decodificar token: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido o expirado"
            )
            
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener la lista de usuarios: {str(e)}"
        )

@router.get("/test")
async def test_connection():
    return {"message": "API funcionando correctamente"}

@router.get("/test-auth")
async def test_auth(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        return {
            "message": "Autenticación correcta",
            "user_email": payload.get("sub")
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        ) 

# Crear nuevo usuario
@router.post("/users", response_model=UserResponse)
async def create_user(
    user_data: UserBase,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        # Verificar token y permisos de admin
        token = credentials.credentials
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        current_user = db.query(User).filter(User.correo == payload.get("sub")).first()
        
        if not current_user or current_user.rol != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene permisos para crear usuarios"
            )

        # Verificar si el usuario ya existe
        existing_user = db.query(User).filter(
            (User.usuario == user_data.usuario) | 
            (User.correo == user_data.correo)
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El usuario o correo ya existe"
            )

        # Crear el nuevo usuario
        hashed_password = pwd_context.hash(user_data.password)
        new_user = User(
            usuario=user_data.usuario,
            correo=user_data.correo,
            nombre=user_data.nombre,
            apellido=user_data.apellido,
            password=hashed_password,
            rol=user_data.rol,
            vigencia=user_data.vigencia,
            estado=True,
            fecha_registro=datetime.utcnow()
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# Actualizar usuario
@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        # Verificar permisos
        token = credentials.credentials
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        current_user = db.query(User).filter(User.correo == payload.get("sub")).first()
        
        if not current_user or current_user.rol != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene permisos para actualizar usuarios"
            )

        # Buscar usuario a actualizar
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )

        # Actualizar campos
        for field, value in user_data.dict(exclude_unset=True).items():
            if field == "password" and value:
                value = pwd_context.hash(value)
            setattr(user, field, value)

        db.commit()
        db.refresh(user)
        return user

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# Eliminar usuario
@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        # Verificar permisos
        token = credentials.credentials
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        current_user = db.query(User).filter(User.correo == payload.get("sub")).first()
        
        if not current_user or current_user.rol != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene permisos para eliminar usuarios"
            )

        # Buscar y eliminar usuario
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )

        db.delete(user)
        db.commit()
        
        return {"message": "Usuario eliminado correctamente"}

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 

@router.post("/update-javier-password")
async def update_javier_password(db: Session = Depends(get_db)):
    try:
        # Buscar usuario javier
        user = db.query(User).filter(User.usuario == "javier").first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario javier no encontrado"
            )
        
        # Crear el hash de la contraseña
        hashed_password = get_password_hash("12345")
        print("Password hasheado para javier:", hashed_password)
        
        # Actualizar la contraseña
        user.password = hashed_password
        db.commit()
        
        return {"message": "Contraseña de javier actualizada exitosamente"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar contraseña: {str(e)}"
        )

@router.get("/check-javier")
async def check_javier(db: Session = Depends(get_db)):
    try:
        # Buscar usuario javier
        user = db.query(User).filter(User.usuario == "javier").first()
        if not user:
            return {"message": "Usuario javier no encontrado"}
        
        return {
            "usuario": user.usuario,
            "password_actual": user.password,
            "password_prueba": get_password_hash("12345")
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {str(e)}"
        )

@router.get("/debug/usuarios")
async def debug_usuarios(db: Session = Depends(get_db)):
    try:
        # Consulta directa para ver todos los usuarios
        result = db.execute("""
            SELECT id, usuario, correo, rol, estado, password 
            FROM usuarios
        """)
        
        usuarios = []
        for row in result:
            usuarios.append({
                "id": row.id,
                "usuario": row.usuario,
                "correo": row.correo,
                "rol": row.rol,
                "estado": row.estado,
                "password_length": len(row.password) if row.password else 0
            })
            
        return {"usuarios": usuarios}
        
    except Exception as e:
        print(f"Error debuggeando usuarios: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/crear-usuario-prueba")
async def crear_usuario_prueba(db: Session = Depends(get_db)):
    try:
        # Datos del usuario de prueba
        usuario = "javier"
        correo = "javier@example.com"
        password = "12345"
        rol = "admin"
        
        # Hashear la contraseña
        hashed_password = get_password_hash(password)
        
        # Insertar usuario
        result = db.execute("""
            INSERT INTO usuarios (usuario, correo, password, rol, estado) 
            VALUES (:usuario, :correo, :password, :rol, 1)
            RETURNING id, usuario, correo, rol
        """, {
            "usuario": usuario,
            "correo": correo,
            "password": hashed_password,
            "rol": rol
        })
        
        new_user = result.first()
        db.commit()
        
        return {
            "mensaje": "Usuario de prueba creado exitosamente",
            "usuario": {
                "id": new_user[0],
                "usuario": new_user[1],
                "correo": new_user[2],
                "rol": new_user[3]
            }
        }
        
    except Exception as e:
        db.rollback()
        print(f"Error creando usuario: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creando usuario: {str(e)}"
        )

@router.post("/limpiar-usuarios")
async def limpiar_usuarios(db: Session = Depends(get_db)):
    try:
        # Eliminar todos los usuarios
        db.execute("DELETE FROM usuarios")
        db.commit()
        return {"mensaje": "Tabla usuarios limpiada exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error limpiando tabla: {str(e)}"
        )

@router.post("/crear-javier")
async def crear_javier(db: Session = Depends(get_db)):
    try:
        # Datos del usuario javier
        usuario = "javier"
        correo = "javier@example.com"
        password = "12345"
        rol = "admin"
        
        # Hashear la contraseña
        hashed_password = get_password_hash(password)
        
        # Insertar usuario
        result = db.execute("""
            INSERT INTO usuarios (usuario, correo, password, rol, estado) 
            VALUES (:usuario, :correo, :password, :rol, 1)
            RETURNING id, usuario, correo, rol, estado
        """, {
            "usuario": usuario,
            "correo": correo,
            "password": hashed_password,
            "rol": rol
        })
        
        new_user = result.first()
        db.commit()
        
        return {
            "mensaje": "Usuario javier creado exitosamente",
            "usuario": {
                "id": new_user[0],
                "usuario": new_user[1],
                "correo": new_user[2],
                "rol": new_user[3],
                "estado": new_user[4]
            }
        }
        
    except Exception as e:
        db.rollback()
        print(f"Error creando usuario: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creando usuario: {str(e)}"
        )

@router.post("/crear-admin-prueba")
async def crear_admin_prueba(db: Session = Depends(get_db)):
    try:
        # Verificar si ya existe
        existing_user = db.query(User).filter(User.usuario == "admin").first()
        if existing_user:
            return {"message": "El usuario admin ya existe"}
            
        # Crear usuario admin
        hashed_password = get_password_hash("admin123")
        new_user = User(
            usuario="admin",
            correo="admin@example.com",
            password=hashed_password,
            rol="admin",
            estado=1,
            fecha_registro=datetime.utcnow()
        )
        
        db.add(new_user)
        db.commit()
        
        return {"message": "Usuario admin creado exitosamente"}
        
    except Exception as e:
        print(f"Error creando admin: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/crear-usuario-simple")
async def crear_usuario_simple(db: Session = Depends(get_db)):
    try:
        print("\n=== CREANDO USUARIO SIMPLE ===")
        
        # 1. Primero eliminar usuarios existentes
        db.execute("DELETE FROM usuarios")
        db.commit()
        print("Tabla usuarios limpiada")
        
        # 2. Crear el hash de la contraseña
        password = "12345"
        hashed_password = get_password_hash(password)
        print(f"Password hasheado: {hashed_password}")
        
        # 3. Insertar el usuario
        db.execute("""
            INSERT INTO usuarios (usuario, correo, password, rol, estado) 
            VALUES ('javier', 'javier@example.com', :password, 'admin', 1)
        """, {"password": hashed_password})
        db.commit()
        print("Usuario insertado")
        
        # 4. Verificar que se insertó correctamente
        user = db.execute("SELECT * FROM usuarios WHERE usuario = 'javier'").first()
        if user:
            print("\nUsuario creado exitosamente:")
            print(f"ID: {user[0]}")
            print(f"Usuario: {user[1]}")
            print(f"Correo: {user[2]}")
            print(f"Password: {user[3]}")
            print(f"Rol: {user[4]}")
            
            # 5. Probar la verificación de contraseña
            print("\nProbando verificación de contraseña:")
            is_valid = verify_password("12345", user[3])
            print(f"¿Contraseña válida?: {is_valid}")
            
            return {
                "mensaje": "Usuario creado exitosamente",
                "usuario": {
                    "id": user[0],
                    "usuario": user[1],
                    "correo": user[2],
                    "password_length": len(user[3]) if user[3] else 0,
                    "rol": user[4]
                }
            }
        else:
            return {"mensaje": "Error: Usuario no encontrado después de insertar"}
            
    except Exception as e:
        print(f"Error creando usuario: {str(e)}")
        import traceback
        print("Traceback:", traceback.format_exc())
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creando usuario: {str(e)}"
        )

@router.get("/estructura-tabla")
async def ver_estructura_tabla(db: Session = Depends(get_db)):
    try:
        # Obtener información de la tabla
        result = db.execute("""
            SELECT column_name, data_type, character_maximum_length, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'usuarios'
            ORDER BY ordinal_position;
        """)
        
        columns = []
        for row in result:
            columns.append({
                "nombre": row[0],
                "tipo": row[1],
                "longitud": row[2],
                "nullable": row[3]
            })
            
        # También mostrar la definición CREATE TABLE
        create_table = db.execute("""
            SELECT pg_get_tabledef('usuarios'::regclass);
        """)
        
        return {
            "columnas": columns,
            "create_table": create_table.scalar() if create_table.rowcount > 0 else None
        }
        
    except Exception as e:
        print(f"Error obteniendo estructura: {str(e)}")
        import traceback
        print("Traceback:", traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error obteniendo estructura: {str(e)}"
        )

@router.get("/test-db")
async def test_db(db: Session = Depends(get_db)):
    try:
        print("\n=== TEST BASE DE DATOS ===")
        
        # 1. Probar conexión
        result = db.execute("SELECT 1").scalar()
        print("Conexión exitosa:", result == 1)
        
        # 2. Crear tabla si no existe
        db.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                usuario VARCHAR(100) NOT NULL,
                correo VARCHAR(100) NOT NULL,
                password VARCHAR(200) NOT NULL,
                rol VARCHAR(50) NOT NULL,
                estado INTEGER NOT NULL DEFAULT 1
            )
        """)
        db.commit()
        print("Tabla creada/verificada")
        
        # 3. Insertar usuario de prueba
        password_hash = get_password_hash("12345")
        db.execute("""
            INSERT INTO usuarios (usuario, correo, password, rol, estado)
            VALUES ('javier', 'javier@example.com', :password, 'admin', 1)
            ON CONFLICT (usuario) DO UPDATE 
            SET password = :password
        """, {"password": password_hash})
        db.commit()
        print("Usuario insertado/actualizado")
        
        # 4. Leer datos
        users = db.execute("SELECT id, usuario, correo, password, rol, estado FROM usuarios").all()
        users_list = []
        for user in users:
            print("\nUsuario encontrado:")
            print(f"ID: {user[0]}")
            print(f"Usuario: {user[1]}")
            print(f"Correo: {user[2]}")
            print(f"Password (longitud): {len(user[3])}")
            print(f"Rol: {user[4]}")
            print(f"Estado: {user[5]}")
            
            # Probar verificación
            is_valid = verify_password("12345", user[3])
            print(f"Verificación de contraseña: {is_valid}")
            
            users_list.append({
                "id": user[0],
                "usuario": user[1],
                "correo": user[2],
                "password_length": len(user[3]),
                "rol": user[4],
                "estado": user[5]
            })
        
        return {
            "conexion_ok": True,
            "usuarios": users_list
        }
        
    except Exception as e:
        print(f"Error en test: {str(e)}")
        import traceback
        print("Traceback:", traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en test: {str(e)}"
        )

@router.get("/usuarios")
async def listar_usuarios(db: Session = Depends(get_db)):
    try:
        # Obtener todos los usuarios con una consulta más específica
        result = db.execute("""
            SELECT 
                id, 
                usuario, 
                correo, 
                rol, 
                estado,
                fecha_registro,
                nombre,
                apellido,
                ultimo_acceso
            FROM usuarios 
            ORDER BY id DESC
        """)
        
        usuarios = []
        for row in result:
            print("Datos crudos del usuario:", dict(zip(
                ['id', 'usuario', 'correo', 'rol', 'estado', 'fecha_registro', 
                 'nombre', 'apellido', 'ultimo_acceso'], 
                row
            )))
            
            usuario = {
                "id": row[0],
                "usuario": row[1],
                "correo": row[2],
                "rol": row[3],
                "estado": row[4],
                "fecha_registro": row[5].isoformat() if row[5] else None,
                "nombre": row[6],
                "apellido": row[7],
                "ultimo_acceso": row[8].isoformat() if row[8] else None
            }
            print("Usuario formateado:", usuario)
            usuarios.append(usuario)
            
        return {
            "total": len(usuarios),
            "usuarios": usuarios
        }
        
    except Exception as e:
        print(f"Error listando usuarios: {str(e)}")
        import traceback
        print("Traceback completo:")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener usuarios: {str(e)}"
        )