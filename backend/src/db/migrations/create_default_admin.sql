-- Primero eliminar todos los usuarios admin existentes
DELETE FROM usuarios WHERE rol = 'admin';

-- Crear un nuevo usuario admin predeterminado
INSERT INTO usuarios (
    nombre,
    apellido,
    usuario,
    correo,
    password,
    rol,
    vigencia,
    estado
) VALUES (
    'Admin',
    'Sistema',
    'admin',
    'admin@sistema.com',
    '$2b$10$DaGUqiHZpXYHXcW4vgXoYOyKtXY3QVWq8XYXwX4X9Z4X9Z4X9Z4X9',  -- contraseña: admin123
    'admin',
    365,
    true
);

-- Verificar que se creó correctamente
SELECT id, usuario, rol, estado 
FROM usuarios 
WHERE usuario = 'admin'; 