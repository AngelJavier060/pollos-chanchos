-- Actualizar o crear el usuario admin
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
    '$2b$10$XFDQpHHEaRBX.QYhPpKIzeO6EkPCM0bx6Qx5vbZT5gYQYZ.PKF9.e',  -- hash de 'admin123'
    'admin',
    365,
    true
)
ON CONFLICT (usuario) DO UPDATE 
SET password = '$2b$10$XFDQpHHEaRBX.QYhPpKIzeO6EkPCM0bx6Qx5vbZT5gYQYZ.PKF9.e',
    estado = true; 