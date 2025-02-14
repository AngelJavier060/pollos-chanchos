'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import ConfiguracionTabs from "../components/configuracion/ConfiguracionTabs";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración General</h2>
        <p className="text-muted-foreground">
          Gestiona las configuraciones de vacunas, planes nutricionales y parámetros de crecimiento
        </p>
      </div>

      <ConfiguracionTabs />
    </div>
  );
} 