-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'warning', 'danger', 'info'
    leido BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP WITH TIME ZONE
);

-- Tabla de configuración de notificaciones por usuario
CREATE TABLE IF NOT EXISTS notificaciones_config (
    usuario_id INTEGER PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    email BOOLEAN DEFAULT true,
    dias_anticipacion INTEGER DEFAULT 5
); 