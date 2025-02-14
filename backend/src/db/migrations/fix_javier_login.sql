-- Primero, eliminar el usuario si existe
DELETE FROM usuarios WHERE usuario = 'javier';

-- Crear el usuario nuevamente con la contraseña correcta
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
    'Admin',
    'javier',
    'javier@admin.com',
    '$2b$10$S2bS10SvPf4ysgY8QLnT0GGXxz3COYz6TtxMQJqhN9V3UF9T3H3GQZsuHhJi',
    'admin',
    365,
    true
);

-- Verificar que se creó correctamente
SELECT id, usuario, rol, estado, password 
FROM usuarios 
WHERE usuario = 'javier'; 