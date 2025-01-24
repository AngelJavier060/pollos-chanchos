export interface Raza {
  id: number;
  nombre: string;
  tipoAnimal: 'pollo' | 'cerdo';
  pesoPromedio: number;
  tamanioPromedio: number;
  edadMadurez: number;
  tiempoCrecimiento: number;
  descripcion?: string;
  imagen?: string;
} 