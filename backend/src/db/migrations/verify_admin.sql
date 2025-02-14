-- Verificar el usuario javier
SELECT id, usuario, password, rol, estado 
FROM usuarios 
WHERE usuario = 'javier';

-- Actualizar la contraseña si es necesario
UPDATE usuarios 
SET password = '$2b$10$S2bS10SvPf4ysgY8QLnT0GGXxz3COYz6TtxMQJqhN9V3UF9T3H3GQZsuHhJi',
    estado = true,
    rol = 'admin'
WHERE usuario = 'javier'; 