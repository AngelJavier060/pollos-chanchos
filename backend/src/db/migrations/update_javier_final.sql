-- Actualizar el usuario javier con el hash exacto que está en tu base de datos
UPDATE usuarios 
SET password = '$2bS10$S2bS10SvPf4ysgY8QLnT0GGXxz3COYz6TtxMQJqhN9V3UF9T3H3GQZsuHhJi',
    estado = true,
    rol = 'admin',
    vigencia = 365
WHERE usuario = 'javier';

-- Verificar el usuario
SELECT id, usuario, rol, estado, password 
FROM usuarios 
WHERE usuario = 'javier'; 