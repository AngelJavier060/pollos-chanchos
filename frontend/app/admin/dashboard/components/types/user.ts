export type UserRole = 'admin' | 'pollo' | 'chancho' | 'usuario';

export interface User {
  id?: number;
  nombre: string;
  apellido: string;
  usuario: string;
  correo: string;
  password?: string;
  rol: UserRole;
  vigencia: number;
  estado: boolean;
  fecha_registro?: Date | string;
  ultimo_acceso?: Date | string;
} 