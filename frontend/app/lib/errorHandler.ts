import { toast } from "@/app/components/ui/use-toast";
import { ApiError } from '../types/auth';

export const handleError = (error: ApiError) => {
  console.error('Error:', error);
  
  let message = 'Error inesperado';
  let title = 'Error';
  
  if (error.status === 401) {
    message = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
    title = 'Sesión Expirada';
  } else if (error.status === 403) {
    message = 'No tiene permisos para realizar esta acción.';
    title = 'Acceso Denegado';
  } else if (error.response?.data?.detail) {
    message = error.response.data.detail;
  } else if (error.message) {
    message = error.message;
  }
  
  toast({
    title,
    description: message,
    variant: "destructive",
    duration: 5000
  });
}; 