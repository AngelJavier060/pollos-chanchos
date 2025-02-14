from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from datetime import datetime, timedelta

from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate, UserResponse

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def get_users(
    active: bool = Query(True),
    db: Session = Depends(get_db)
):
    users = db.query(User).filter(User.activo == active).all()
    return users

@router.post("/", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    try:
        # Verificar si ya existe un usuario con el mismo email o username
        existing_user = db.query(User).filter(
            (User.email == user.email) | (User.username == user.username)
        ).first()
        
        if existing_user:
            if existing_user.email == user.email:
                raise HTTPException(status_code=400, detail="Email ya registrado")
            else:
                raise HTTPException(status_code=400, detail="Nombre de usuario ya registrado")

        # Crear el nuevo usuario
        db_user = User(
            nombre=user.nombre,
            apellido=user.apellido,
            email=user.email,
            telefono=user.telefono,
            username=user.username,
            password=user.password,
            rol=user.rol,
            dias_vigencia=user.dias_vigencia,
            activo=True,
            fecha_creacion=datetime.now()
        )

        # Calcular fecha de expiración si no es admin
        if user.rol != "admin":
            db_user.fecha_expiracion = datetime.now() + timedelta(days=user.dias_vigencia)

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error de integridad en la base de datos")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    db: Session = Depends(get_db)
):
    try:
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        # Verificar duplicados solo si se está actualizando email o username
        if user_update.email or user_update.username:
            existing_user = db.query(User).filter(
                (User.id != user_id) &
                ((User.email == user_update.email) | (User.username == user_update.username))
            ).first()
            
            if existing_user:
                if user_update.email and existing_user.email == user_update.email:
                    raise HTTPException(status_code=400, detail="Email ya registrado")
                if user_update.username and existing_user.username == user_update.username:
                    raise HTTPException(status_code=400, detail="Nombre de usuario ya registrado")

        # Actualizar campos
        for key, value in user_update.dict(exclude_unset=True).items():
            setattr(db_user, key, value)

        # Actualizar fecha de expiración si se cambió el rol o los días de vigencia
        if user_update.rol == "admin":
            db_user.fecha_expiracion = None
        elif user_update.dias_vigencia:
            db_user.fecha_expiracion = datetime.now() + timedelta(days=user_update.dias_vigencia)

        db.commit()
        db.refresh(db_user)
        return db_user

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error de integridad en la base de datos")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{user_id}/deactivate")
async def deactivate_user(
    user_id: str,
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    db_user.activo = False
    db.commit()
    return {"message": "Usuario desactivado exitosamente"}

@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    db.delete(db_user)
    db.commit()
    return {"message": "Usuario eliminado exitosamente"}

@router.post("/{user_id}/restore", response_model=UserResponse)
async def restore_user(
    user_id: str,
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    db_user.activo = True
    if db_user.rol != "admin":
        db_user.fecha_expiracion = datetime.now() + timedelta(days=db_user.dias_vigencia)
    
    db.commit()
    db.refresh(db_user)
    return db_user 