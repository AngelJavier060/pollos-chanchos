-- Actualizar la contraseña de Javier
UPDATE usuarios 
SET password = '$2b$10$n9C/LXQXyFvSePA3nkYuZOqjO0.hspFz7TVdV7q3gZOYXwQGQzqPK'
WHERE usuario = 'javier';

-- Asegurarnos que el usuario esté activo
UPDATE usuarios 
SET estado = true, 
    rol = 'admin'
WHERE usuario = 'javier';

-- Verificar los cambios
SELECT id, usuario, rol, estado, password 
FROM usuarios 
WHERE usuario = 'javier'; 