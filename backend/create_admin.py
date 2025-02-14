from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.models.user import User, RolUsuario
from src.auth.auth import get_password_hash

# Configuración de la base de datos
DATABASE_URL = "postgresql://postgres:Alexandra1@localhost:5432/granja_elvita"

def create_admin_user():
    # Crear conexión a la base de datos
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # Verificar si el usuario admin ya existe
        admin = db.query(User).filter(User.username == "admin").first()
        
        if not admin:
            # Crear usuario admin
            hashed_password = get_password_hash("admin123")
            admin_user = User(
                username="admin",
                email="admin@granjaelvita.com",
                hashed_password=hashed_password,
                nombre_completo="Administrador",
                rol=RolUsuario.ADMIN,
                is_active=True
            )
            
            db.add(admin_user)
            db.commit()
            print("Usuario administrador creado exitosamente")
            print("Usuario: admin")
            print("Contraseña: admin123")
        else:
            print("El usuario administrador ya existe")

    except Exception as e:
        print(f"Error al crear usuario administrador: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
