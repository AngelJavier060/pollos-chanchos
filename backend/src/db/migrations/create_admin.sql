-- Primero eliminar el usuario admin si existe
DELETE FROM usuarios WHERE usuario = 'admin2024';

-- Crear el usuario administrador con la contraseña hasheada
INSERT INTO usuarios (
    nombre,
    apellido,
    usuario,
    password,
    rol,
    vigencia,
    estado
) VALUES (
    'Administrador',
    'Sistema',
    'admin2024',
    '$2b$10$XFDQpHHEaRBX.QYhPpKIzeO6EkPCM0bx6Qx5vbZT5gYQYZ.PKF9.e', -- Este es el hash de 'admin123'
    'admin',
    365,
    true
); 