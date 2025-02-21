'use client';

import { useState } from 'react';
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { InventoryHistory } from '../components/inventario/InventoryHistory';

export default function ConfiguracionPage() {
  const { theme } = useTheme();
  const [configuracion, setConfiguracion] = useState({
    notificaciones: true,
    alertasEmail: true,
    diasAlertaVigencia: 15,
    backupAutomatico: false
  });

  return (
    <div className={`min-h-screen p-6 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className={`rounded-lg shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } p-6`}>
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Configuración del Sistema
          </h2>
          <p className={`mt-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Administra las configuraciones generales del sistema
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
            <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>
                  Configura los parámetros generales del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Contenido de configuración general */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notificaciones">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Notificaciones</CardTitle>
                <CardDescription>
                  Administra las notificaciones y alertas del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Switch
                    id="notificaciones"
                    checked={configuracion.notificaciones}
                    onCheckedChange={(checked) =>
                      setConfiguracion({ ...configuracion, notificaciones: checked })
                    }
                  />
                  <Label htmlFor="notificaciones">Notificaciones del sistema</Label>
                </div>
                <div className="flex items-center space-x-4">
                  <Switch
                    id="alertasEmail"
                    checked={configuracion.alertasEmail}
                    onCheckedChange={(checked) =>
                      setConfiguracion({ ...configuracion, alertasEmail: checked })
                    }
                  />
                  <Label htmlFor="alertasEmail">Alertas por correo electrónico</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historial">
            <InventoryHistory />
          </TabsContent>

          <TabsContent value="apariencia">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Apariencia</CardTitle>
                <CardDescription>
                  Personaliza la apariencia del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Contenido de configuración de apariencia */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seguridad">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Seguridad</CardTitle>
                <CardDescription>
                  Administra la seguridad del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Switch
                    id="backupAutomatico"
                    checked={configuracion.backupAutomatico}
                    onCheckedChange={(checked) =>
                      setConfiguracion({ ...configuracion, backupAutomatico: checked })
                    }
                  />
                  <Label htmlFor="backupAutomatico">Backup automático de datos</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}