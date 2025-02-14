export interface Vacuna {
  id: number;
  nombre: string;
  tipo_animal: 'pollo' | 'cerdo';
  edad_aplicacion: number;
  dosis: number;
  unidad_dosis: string;
  intervalo_dosis?: number;
  descripcion?: string;
  obligatoria: boolean;
  efectos_secundarios?: string;
  precauciones?: string;
  producto_id: number;
  producto_nombre?: string;
  estado: boolean;
}

export interface PlanVacunacion {
  id: number;
  nombre: string;
  tipo_animal: 'pollo' | 'cerdo';
  raza_id: number;
  raza_nombre?: string;
  descripcion?: string;
  estado: boolean;
  vacunas: VacunaPlan[];
}

export interface VacunaPlan {
  vacuna_id: number;
  dia_aplicacion: number;
  observaciones?: string;
} 