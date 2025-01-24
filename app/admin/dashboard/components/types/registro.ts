export interface Lote {
  id: number;
  nombre: string;
  fechaCreacion: string;
  tipoAnimal: 'pollo' | 'cerdo';
  cantidad: number;
  // ... otros campos necesarios
} 