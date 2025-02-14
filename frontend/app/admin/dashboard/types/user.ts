export interface User {
  id: number;
  nombre: string;
  apellido: string;
  usuario: string;
  correo: string;
  rol: string;
  estado: boolean;
  vigencia?: number;
} 