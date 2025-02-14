'use client';

import { useEffect } from 'react';
import { toast } from "@/app/components/ui/use-toast";
import { api } from '@/app/lib/api';

export const NotificacionesSystem = () => {
  const verificarVencimientos = async () => {
    try {
      const response = await api.get('/usuarios/vencimientos');
      if (response.vencimientos?.length > 0) {
        response.vencimientos.forEach((usuario: any) => {
          const diasTexto = usuario.diasRestantes === 1 ? 'día' : 'días';
          toast({
            title: "Alerta de Vencimiento",
            description: `La cuenta de ${usuario.nombre} vencerá en ${usuario.diasRestantes} ${diasTexto}`,
            variant: "warning",
            duration: 5000,
          });
        });
      }
    } catch (error) {
      console.error('Error al verificar vencimientos:', error);
    }
  };

  useEffect(() => {
    verificarVencimientos();
    const interval = setInterval(verificarVencimientos, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
}; 