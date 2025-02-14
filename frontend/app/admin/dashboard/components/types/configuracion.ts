import { Raza } from './raza';

export interface Vacuna {
  id: number;
  nombre: string;
  tipoAnimal: 'pollo' | 'cerdo';
  edad: number;
  dosis: number;
  unidadDosis: string;
  intervalo?: number;
  descripcion?: string;
  obligatoria: boolean;
  efectosSecundarios?: string;
  precauciones?: string;
}

export interface PlanVacunacion {
  id: number;
  nombre: string;
  tipoAnimal: 'pollo' | 'cerdo';
  razaId: number;
  vacunas: Vacuna[];
  estado: boolean;
}

export interface FaseNutricional {
  id: number;
  nombre: string;
  diaInicio: number;
  diaFin: number;
  proteina: number;
  energia: number;
  fibra: number;
  minerales: number;
  descripcion?: string;
}

export interface PlanNutricional {
  id: number;
  nombre: string;
  tipoAnimal: 'pollo' | 'cerdo';
  razaId: number;
  fases: FaseNutricional[];
  estado: boolean;
}

export interface ParametroCrecimiento {
  id: number;
  razaId: number;
  edad: number;
  pesoMinimo: number;
  pesoMaximo: number;
  alturaMinima: number;
  alturaMaxima: number;
  observaciones?: string;
}

export type { Raza }; 