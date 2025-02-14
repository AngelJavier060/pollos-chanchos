import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

from src.database import SessionLocal, init_db
from src.models.user import User
from datetime import datetime
from passlib.context import CryptContext

# Configuración de seguridad
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_test_user():
    db = SessionLocal()
    try:
        # Verificar si el usuario ya existe
        test_user = db.query(User).filter(User.usuario == "admin").first()
        if test_user:
            print("El usuario de prueba ya existe")
            return

        # Crear usuario de prueba
        hashed_password = pwd_context.hash("admin123")
        new_user = User(
            usuario="admin",
            email="admin@example.com",
            nombre="Administrador",
            apellido="Sistema",
            hashed_password=hashed_password,
            rol="admin",
            vigencia=365,
            estado=True,
            fecha_registro=datetime.utcnow(),
            ultimo_acceso=datetime.utcnow()
        )
        
        db.add(new_user)
        db.commit()
        print("Usuario de prueba creado exitosamente")
        
    except Exception as e:
        print("Error al crear usuario de prueba:", str(e))
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Inicializando base de datos...")
    init_db()
    print("Creando usuario de prueba...")
    create_test_user()
    print("Inicialización completada") 