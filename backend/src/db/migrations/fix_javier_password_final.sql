-- Actualizar la contraseña de Javier con el hash exacto que ya existe en tu base de datos
UPDATE usuarios 
SET password = '$2b$10$S2bS10SvPf4ysgY8QLnT0GGXxz3COYz6TtxMQJqhN9V3UF9T3H3GQZsuHhJi'
WHERE usuario = 'javier';

-- Asegurarnos que todo esté correcto
UPDATE usuarios 
SET estado = true,
    rol = 'admin',
    vigencia = 365,
    correo = 'javier@admin.com'
WHERE usuario = 'javier';

-- Verificar los cambios
SELECT id, usuario, rol, estado, password 
FROM usuarios 
WHERE usuario = 'javier'; 