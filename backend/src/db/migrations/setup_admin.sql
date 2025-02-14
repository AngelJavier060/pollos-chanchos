-- Primero verificamos si existe la tabla
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    vigencia INTEGER NOT NULL,
    estado BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP WITH TIME ZONE
);

-- Creamos el usuario admin si no existe
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