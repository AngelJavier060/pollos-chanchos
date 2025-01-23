export interface Lote {
  id: number;
  codigo: string;
  fechaIngreso: string;
  cantidadInicial: number;
  cantidadActual: number;
  razaId: number;
  estado: 'activo' | 'vendido' | 'finalizado';
  galpón: string;
  mortalidad: number;
}

export interface RegistroCrecimiento {
  id: number;
  loteId: number;
  fecha: string;
  pesoPromedio: number;
  consumoAlimento: number;
  observaciones?: string;
}

export interface RegistroSanitario {
  id: number;
  loteId: number;
  fecha: string;
  tipo: 'vacunación' | 'tratamiento' | 'desparasitación';
  producto: string;
  dosis: number;
  veterinario: string;
  observaciones?: string;
}

export interface ControlAlimentacion {
  id: number;
  loteId: number;
  fecha: string;
  tipoAlimento: string;
  cantidadSuministrada: number;
  costoUnitario: number;
} 