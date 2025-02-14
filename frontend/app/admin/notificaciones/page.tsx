'use client';

import { useState, useEffect } from 'react';
import { api } from '@/app/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardHeader, CardContent } from "@/app/components/ui/card";
import { toast } from "@/app/components/ui/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificacionAdmin {
  id: number;
  usuario_id: number;
  tipo: string;
  mensaje: string;
  leido: boolean;
  fecha_creacion: string;
  fecha_lectura: string | null;
  usuario: {
    nombre: string;
    apellido: string;
    usuario: string;
  };
}

export default function AdminNotificaciones() {
  const [notificaciones, setNotificaciones] = useState<NotificacionAdmin[]>([]);
  const [filtro, setFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const data = await api.get('/api/admin/notificaciones');
      setNotificaciones(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar notificaciones",
        variant: "destructive",
      });
    }
  };

  const eliminarNotificacion = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta notificación?')) return;

    try {
      await api.delete(`/api/admin/notificaciones/${id}`);
      toast({
        title: "Éxito",
        description: "Notificación eliminada correctamente",
      });
      cargarNotificaciones();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar la notificación",
        variant: "destructive",
      });
    }
  };

  const enviarNotificacionMasiva = async () => {
    try {
      await api.post('/api/admin/notificaciones/masiva', {
        mensaje: 'Mensaje de prueba masivo',
        tipo: 'sistema'
      });
      toast({
        title: "Éxito",
        description: "Notificación masiva enviada",
      });
      cargarNotificaciones();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al enviar notificación masiva",
        variant: "destructive",
      });
    }
  };

  const notificacionesFiltradas = notificaciones.filter(n => {
    const cumpleFiltroTexto = 
      n.mensaje.toLowerCase().includes(filtro.toLowerCase()) ||
      n.usuario.usuario.toLowerCase().includes(filtro.toLowerCase());
    
    if (tipoFiltro === 'todos') return cumpleFiltroTexto;
    if (tipoFiltro === 'leidas') return cumpleFiltroTexto && n.leido;
    if (tipoFiltro === 'no_leidas') return cumpleFiltroTexto && !n.leido;
    return cumpleFiltroTexto;
  });

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Administración de Notificaciones</h2>
            <Button onClick={enviarNotificacionMasiva}>
              Enviar Notificación Masiva
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <Input
              placeholder="Buscar..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="max-w-sm"
            />
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="border rounded-md p-2"
            >
              <option value="todos">Todas</option>
              <option value="leidas">Leídas</option>
              <option value="no_leidas">No leídas</option>
            </select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Mensaje</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notificacionesFiltradas.map((notif) => (
                <TableRow key={notif.id}>
                  <TableCell>
                    {notif.usuario.nombre} {notif.usuario.apellido}
                    <br />
                    <span className="text-sm text-gray-500">
                      @{notif.usuario.usuario}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      notif.tipo === 'expiracion' ? 'bg-yellow-100 text-yellow-800' :
                      notif.tipo === 'sistema' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {notif.tipo}
                    </span>
                  </TableCell>
                  <TableCell>{notif.mensaje}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      notif.leido ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {notif.leido ? 'Leída' : 'No leída'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(notif.fecha_creacion), {
                      addSuffix: true,
                      locale: es
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => eliminarNotificacion(notif.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 