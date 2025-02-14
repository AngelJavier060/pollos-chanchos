'use client';

import { useEffect, useState } from 'react';
import { api } from '@/app/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertCircle, Bell } from 'lucide-react';

interface Notificacion {
  id: number;
  mensaje: string;
  tipo: string;
  leido: boolean;
  fecha_creacion: string;
  usuario: {
    nombre: string;
    apellido: string;
  };
}

export const NotificacionesList = ({ limit = 5 }) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      const data = await api.get('/notificaciones');
      setNotificaciones(Array.isArray(data) ? data.slice(0, limit) : []);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNotificaciones();
    // Actualizar cada minuto
    const interval = setInterval(cargarNotificaciones, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center py-4">Cargando notificaciones...</div>;
  }

  if (!notificaciones.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No hay notificaciones</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notificaciones.map((notif) => (
        <div
          key={notif.id}
          className={`p-4 rounded-lg border ${
            notif.tipo === 'warning' ? 'bg-yellow-50 border-yellow-200' : 
            notif.tipo === 'danger' ? 'bg-red-50 border-red-200' : 
            'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className={`h-5 w-5 mt-0.5 ${
              notif.tipo === 'warning' ? 'text-yellow-600' : 
              notif.tipo === 'danger' ? 'text-red-600' : 
              'text-blue-600'
            }`} />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {notif.mensaje}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Usuario: {notif.usuario.nombre} {notif.usuario.apellido}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(notif.fecha_creacion), "d 'de' MMMM, HH:mm", { locale: es })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 