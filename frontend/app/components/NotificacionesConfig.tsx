'use client';

import { useState, useEffect } from 'react';
import { Switch } from "@/app/components/ui/switch";
import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardContent } from "@/app/components/ui/card";
import { initializePushNotifications } from '@/app/lib/pushNotifications';
import { api } from '@/app/lib/api';
import { Input } from "@/app/components/ui/input";

interface ConfigNotificaciones {
  email: boolean;
  push: boolean;
  whatsapp: boolean;
  sms: boolean;
  whatsapp_numero?: string;
  sms_numero?: string;
  expiracion: boolean;
  sistema: boolean;
}

export const NotificacionesConfig = () => {
  const [config, setConfig] = useState<ConfigNotificaciones>({
    email: true,
    push: false,
    whatsapp: false,
    sms: false,
    expiracion: true,
    sistema: true
  });

  const [pushDisponible, setPushDisponible] = useState(false);

  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const data = await api.get('/api/usuarios/notificaciones/config');
        setConfig(data);
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      }
    };

    cargarConfig();
    checkPushDisponible();
  }, []);

  const checkPushDisponible = async () => {
    const disponible = await initializePushNotifications();
    setPushDisponible(disponible);
  };

  const guardarConfig = async () => {
    try {
      await api.put('/api/usuarios/notificaciones/config', config);
      // Mostrar mensaje de éxito
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Configuración de Notificaciones</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Notificaciones por Email</p>
            <p className="text-sm text-gray-500">Recibir notificaciones en tu correo</p>
          </div>
          <Switch
            checked={config.email}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, email: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Notificaciones Push</p>
            <p className="text-sm text-gray-500">
              {pushDisponible ? 
                'Recibir notificaciones en el navegador' : 
                'No disponible en este navegador'}
            </p>
          </div>
          <Switch
            checked={config.push}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, push: checked }))}
            disabled={!pushDisponible}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Alertas de Expiración</p>
            <p className="text-sm text-gray-500">Notificar cuando la cuenta esté por expirar</p>
          </div>
          <Switch
            checked={config.expiracion}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, expiracion: checked }))}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">WhatsApp</p>
              <p className="text-sm text-gray-500">Recibir notificaciones por WhatsApp</p>
            </div>
            <Switch
              checked={config.whatsapp}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, whatsapp: checked }))}
            />
          </div>
          {config.whatsapp && (
            <Input
              placeholder="Número de WhatsApp"
              value={config.whatsapp_numero || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, whatsapp_numero: e.target.value }))}
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS</p>
              <p className="text-sm text-gray-500">Recibir notificaciones por SMS</p>
            </div>
            <Switch
              checked={config.sms}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, sms: checked }))}
            />
          </div>
          {config.sms && (
            <Input
              placeholder="Número de teléfono"
              value={config.sms_numero || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, sms_numero: e.target.value }))}
            />
          )}
        </div>

        <Button onClick={guardarConfig} className="w-full">
          Guardar Configuración
        </Button>
      </CardContent>
    </Card>
  );
}; 