-- Eliminar objetos existentes si existen
DROP VIEW IF EXISTS alertas_stock;
DROP TABLE IF EXISTS productos CASCADE;

-- Tabla de productos/compras
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('alimento', 'medicina', 'vitamina')),
    tipo_animal VARCHAR(20) NOT NULL CHECK (tipo_animal IN ('pollos', 'chanchos')),
    cantidad DECIMAL(10,2) NOT NULL DEFAULT 0,
    unidad_medida VARCHAR(50) NOT NULL, -- Más flexible para diferentes unidades
    precio_unitario DECIMAL(10,2) NOT NULL,
    proveedor VARCHAR(100) NOT NULL,
    numero_factura VARCHAR(50) NOT NULL,
    fecha_compra DATE NOT NULL,
    nivel_minimo DECIMAL(10,2) NOT NULL,
    nivel_critico DECIMAL(10,2) NOT NULL,
    estado BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vista para alertas de stock
CREATE VIEW alertas_stock AS
SELECT 
    p.id as producto_id,
    p.nombre,
    p.tipo_animal,
    p.cantidad as cantidad_actual,
    p.nivel_minimo,
    p.nivel_critico,
    (p.cantidad / p.nivel_minimo * 100) as porcentaje_stock
FROM 
    productos p
WHERE 
    p.cantidad <= p.nivel_critico
    AND p.estado = true;

-- Índices para mejorar el rendimiento
CREATE INDEX idx_productos_tipo ON productos(tipo);
CREATE INDEX idx_productos_tipo_animal ON productos(tipo_animal);
CREATE INDEX idx_productos_fecha_compra ON productos(fecha_compra); 