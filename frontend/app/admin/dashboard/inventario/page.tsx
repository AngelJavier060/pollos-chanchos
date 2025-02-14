'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import InventarioList from '../components/inventario/InventarioList';
import ControlStock from '../components/inventario/ControlStock';

export default function InventarioPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Inventario</h2>
      </div>

      <Tabs defaultValue="inventario" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventario">Inventario</TabsTrigger>
          <TabsTrigger value="stock">Control de Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="inventario" className="space-y-4">
          <InventarioList />
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <ControlStock />
        </TabsContent>
      </Tabs>
    </div>
  );
}