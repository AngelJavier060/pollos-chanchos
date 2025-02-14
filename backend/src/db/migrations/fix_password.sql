-- Actualizar la contraseña de Javier
UPDATE usuarios 
SET password = '$2b$10$S2bS10SvPf4ysgY8QLnT0GGXxz3COYz6TtxMQJqhN9V3UF9T3H3GQZsuHhJi',
    estado = true,
    rol = 'admin',
    vigencia = 365
WHERE usuario = 'javier';

-- Verificar el usuario
SELECT id, usuario, rol, estado 
FROM usuarios 
WHERE usuario = 'javier'; 