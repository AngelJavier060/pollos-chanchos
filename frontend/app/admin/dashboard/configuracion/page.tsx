'use client';

import { useState } from 'react';
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";

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
            <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
            <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>
                  Configura los ajustes básicos del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup Automático</Label>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Realizar copias de seguridad automáticas
                    </p>
                  </div>
                  <Switch
                    checked={configuracion.backupAutomatico}
                    onCheckedChange={(checked) => 
                      setConfiguracion({...configuracion, backupAutomatico: checked})
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aquí irían los demás TabsContent para las otras pestañas */}
        </Tabs>
      </div>
    </div>
  );
} 