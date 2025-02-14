-- Primero eliminar el usuario si existe
DELETE FROM usuarios WHERE usuario = 'javier';

-- Crear el usuario Javier con la contraseña hasheada '12345'
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
    'Javier',
    'Administrador',
    'javier',
    'javier.admin@granja.com',
    '$2a$10$vPf4ysgY8QLnT0GGXxzJCOYz6TtxMQJqhN9V3UF9T3HJGQZsuHhJi', -- hash de '12345'
    'admin',
    365,
    true
);

-- Verificar que el usuario se creó correctamente
SELECT id, usuario, rol, estado FROM usuarios WHERE usuario = 'javier'; 