import psycopg2
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

# Obtener credenciales desde variables de entorno
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_NAME = os.getenv('DB_NAME', 'pollos_chanchos_db')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')

try:
    # Intentar establecer la conexión
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    print("¡Conexión exitosa a la base de datos! 🎉")

    # Cerrar la conexión
    conn.close()
    print("Conexión cerrada correctamente.")

except Exception as e:
    print(f"Error al conectar a la base de datos: {e}")
import sys

print(sys.executable)  # Imprime el intérprete usado
print(sys.path)  # Imprime las rutas de módulos