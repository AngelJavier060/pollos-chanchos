export type ProductType = 'alimento' | 'medicina' | 'vacuna';

export interface Product {
  id: number;
  nombre: string;
  tipo: ProductType;
  cantidad: number;
  unidadMedida: string;
  nivelMinimo: number;
  precio: number;
  proveedor: string;
  fechaCompra: string;
  descripcion?: string;
}

export interface StockAlert {
  productId: number;
  nombre: string;
  tipo: ProductType;
  cantidadActual: number;
  nivelMinimo: number;
  porcentajeStock: number;
} 