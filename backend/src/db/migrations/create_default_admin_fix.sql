-- Primero eliminar registros relacionados en audit_logs
DELETE FROM audit_logs WHERE usuario_id IN (SELECT id FROM usuarios WHERE rol = 'admin');

-- Luego eliminar los usuarios admin
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
    '$2b$10$DaGUqiHZpXYHXcW4vgXoYOyKtXY3QVWq8XYXwX4X9Z4X9Z4X9Z4X9',
    'admin',
    365,
    true
);

-- Verificar que se creó correctamente
SELECT id, usuario, rol, estado 
FROM usuarios 
WHERE usuario = 'admin'; 