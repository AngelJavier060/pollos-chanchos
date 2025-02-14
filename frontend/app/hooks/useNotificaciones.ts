'use client';

import { useState, useCallback } from 'react';
import { api } from '@/app/lib/api';

export const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const actualizarNotificaciones = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/notificaciones');
      if (Array.isArray(response)) {
        setNotificaciones(response);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    notificaciones,
    loading,
    actualizarNotificaciones
  };
}; 