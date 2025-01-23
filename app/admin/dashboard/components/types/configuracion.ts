import { Raza } from './raza';

export interface Vacuna {
  id: number;
  nombre: string;
  tipoAnimal: 'pollo' | 'cerdo';
  edad: number; // edad en días para aplicación
  dosis: number;
  unidadDosis: string;
  intervalo?: number; // días entre dosis si requiere refuerzo
  descripcion: string;
  obligatoria: boolean;
  efectosSecundarios?: string;
  precauciones?: string;
}

export interface PlanVacunacion {
  id: number;
  nombre: string;
  tipoAnimal: 'pollo' | 'cerdo';
  razaId?: number;
  vacunas: {
    vacunaId: number;
    diaAplicacion: number;
    observaciones?: string;
  }[];
}

export interface FaseNutricional {
  id: number;
  nombre: string;
  diaInicio: number;
  diaFin: number;
  consumoDiario: number;
  unidadMedida: string;
  tipoAlimento: string;
  proteina: number;
  energia: number;
  observaciones?: string;
}

export interface PlanNutricional {
  id: number;
  nombre: string;
  tipoAnimal: 'pollo' | 'cerdo';
  razaId?: number;
  descripcion: string;
  fases: FaseNutricional[];
  activo: boolean;
}

export type { Raza }; 