export type TipoProducto = 'alimento' | 'medicina';
export type TipoAnimal = 'pollos' | 'chanchos';

export interface Producto {
  id: number;
  nombre: string;
  detalle: string;
  tipo: TipoProducto;
  tipo_animal: TipoAnimal;
  cantidad: number;
  unidad_medida: string;
  precio_unitario: number;
  proveedor: string;
  numero_factura: string;
  fecha_compra?: Date;
  nivel_minimo: number;
  nivel_critico: number;
  estado: boolean;
}

export interface StockAlert {
  producto_id: number;
  nombre: string;
  tipo_animal: TipoAnimal;
  cantidad_actual: number;
  nivel_minimo: number;
  nivel_critico: number;
  porcentaje_stock: number;
} 