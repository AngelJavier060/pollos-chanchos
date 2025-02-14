-- Actualizar la contraseña del usuario admin
UPDATE usuarios 
SET password = '$2b$10$XFDQpHHEaRBX.QYhPpKIzeO6EkPCM0bx6Qx5vbZT5gYQYZ.PKF9.e'
WHERE usuario = 'admin2024';

-- Asegurarnos que el usuario esté activo y con el rol correcto
UPDATE usuarios 
SET estado = true, 
    rol = 'admin',
    vigencia = 365
WHERE usuario = 'admin2024'; 