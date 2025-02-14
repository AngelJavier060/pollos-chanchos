export const calcularDiasRestantes = (fechaRegistro: string, vigencia: number, rol: string): number => {
  if (rol === 'admin') return Infinity; // Los administradores no caducan
  
  const fechaInicio = new Date(fechaRegistro);
  const fechaFin = new Date(fechaInicio.getTime() + (vigencia * 24 * 60 * 60 * 1000));
  const hoy = new Date();
  const diferencia = fechaFin.getTime() - hoy.getTime();
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

export const formatearDiasRestantes = (diasRestantes: number, rol: string): string => {
  if (rol === 'admin') return 'Sin caducidad';
  if (diasRestantes === Infinity) return 'Sin caducidad';
  return diasRestantes > 0 ? `${diasRestantes} días` : 'Expirado';
};

export const obtenerEstadoCuenta = (diasRestantes: number) => {
  if (diasRestantes <= 0) return 'expirado';
  if (diasRestantes <= 5) return 'crítico';
  if (diasRestantes <= 15) return 'advertencia';
  return 'activo';
}; 