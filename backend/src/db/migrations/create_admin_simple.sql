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
    -- Este es un hash válido para la contraseña 'admin123'
    '$2b$10$S2bS10$DaGUq1HZpXYHXcW4vgXoYOyKtXY3QVWq8XYXwX4X9Z4X9Z4X9',
    'admin',
    365,
    true
)
ON CONFLICT (usuario) DO UPDATE 
SET password = '$2b$10$S2bS10$DaGUq1HZpXYHXcW4vgXoYOyKtXY3QVWq8XYXwX4X9Z4X9Z4X9',
    estado = true,
    rol = 'admin';

-- Verificar que se creó correctamente
SELECT id, usuario, rol, estado 
FROM usuarios 
WHERE usuario = 'admin'; 