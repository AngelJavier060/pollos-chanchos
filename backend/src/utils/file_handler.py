import os
from fastapi import UploadFile
import shutil
from pathlib import Path

async def save_upload_file(upload_file: UploadFile, folder: str) -> str:
    """
    Guarda un archivo subido en el directorio especificado.
    
    Args:
        upload_file (UploadFile): Archivo subido
        folder (str): Carpeta donde guardar el archivo (relativa a /uploads)
        
    Returns:
        str: Ruta relativa donde se guardó el archivo
    """
    # Asegurarse que el directorio uploads existe
    uploads_dir = Path("uploads")
    if not uploads_dir.exists():
        uploads_dir.mkdir()
    
    # Crear el subdirectorio si no existe
    folder_path = uploads_dir / folder
    if not folder_path.exists():
        folder_path.mkdir(parents=True)
    
    # Generar nombre de archivo único
    file_name = upload_file.filename
    file_path = folder_path / file_name
    
    # Si ya existe un archivo con ese nombre, agregar un número
    counter = 1
    while file_path.exists():
        name, ext = os.path.splitext(file_name)
        file_path = folder_path / f"{name}_{counter}{ext}"
        counter += 1
    
    # Guardar el archivo
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    finally:
        upload_file.file.close()
    
    # Devolver la ruta relativa
    return str(file_path)
