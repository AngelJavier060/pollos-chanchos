-- Primero verificamos si el usuario existe
SELECT id, usuario, password, rol, estado 
FROM usuarios 
WHERE usuario = 'javier';

-- Si no existe o necesitamos actualizarlo, ejecutamos:
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
)
ON CONFLICT (usuario) 
DO UPDATE SET 
    password = '$2b$10$S2bS10SvPf4ysgY8QLnT0GGXxz3COYz6TtxMQJqhN9V3UF9T3H3GQZsuHhJi',
    estado = true,
    rol = 'admin'; 