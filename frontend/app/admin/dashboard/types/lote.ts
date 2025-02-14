export type TipoAnimal = 'POLLO' | 'CHANCHO';

export interface Lote {
  id?: number;
  nombre: string;
  tipo_animal: TipoAnimal;
  cantidad: number;
  fecha_nacimiento: string;
  costo: number;
  fecha_registro?: string;
  estado?: 'ACTIVO' | 'INACTIVO';
}
