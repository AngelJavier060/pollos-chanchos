'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { api } from '@/app/lib/api';

export const NotificacionesMenu = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);

  const cargarNotificaciones = async () => {
    try {
      const data = await api.get('/api/notificaciones');
      setNotificaciones(data);
      setNoLeidas(data.filter(n => !n.leido).length);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  useEffect(() => {
    cargarNotificaciones();
    const interval = setInterval(cargarNotificaciones, 5 * 60 * 1000); // Actualizar cada 5 minutos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <Bell className="w-6 h-6" />
      {noLeidas > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {noLeidas}
        </span>
      )}
      {/* Menú desplegable con las notificaciones */}
    </div>
  );
}; 