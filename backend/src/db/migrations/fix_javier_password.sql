-- Actualizar la contraseña de Javier con un nuevo hash conocido
UPDATE usuarios 
SET password = '$2b$10$vPf4ysgY8QLnT0GGXxzJCOYz6TtxMQJqhN9V3UF9T3HJGQZsuHhJi'
WHERE usuario = 'javier';

-- Asegurarnos que todo esté correcto
UPDATE usuarios 
SET estado = true,
    rol = 'admin',
    vigencia = 365
WHERE usuario = 'javier';

-- Verificar los cambios
SELECT id, usuario, rol, estado, password 
FROM usuarios 
WHERE usuario = 'javier'; 