export interface User {
  id: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  email: string;
  rol: 'administrador' | 'usuario';
  vigencia: number;
  fechaCreacion: string;
  estado: 'activo' | 'inactivo';
  password?: string;
} 