-- Crear un nuevo usuario admin predeterminado sin eliminar los existentes
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
    '$2b$10$DaGUqiHZpXYHXcW4vgXoYOyKtXY3QVWq8XYXwX4X9Z4X9Z4X9Z4X9',
    'admin',
    365,
    true
)
ON CONFLICT (usuario) DO UPDATE 
SET password = '$2b$10$DaGUqiHZpXYHXcW4vgXoYOyKtXY3QVWq8XYXwX4X9Z4X9Z4X9Z4X9',
    estado = true;

-- Verificar que se creó correctamente
SELECT id, usuario, rol, estado 
FROM usuarios 
WHERE usuario = 'admin'; 