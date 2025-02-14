export interface Raza {
  id: number;
  nombre: string;
  tipo_animal: 'pollo' | 'cerdo';
  peso_promedio: number;
  tamanio_promedio: number;
  edad_madurez: number;
  tiempo_crecimiento: number;
  descripcion?: string;
  imagen_url?: string;
  estado?: boolean;
  caracteristicas?: string;
} 