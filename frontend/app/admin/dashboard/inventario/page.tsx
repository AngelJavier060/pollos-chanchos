'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Package2, LineChart } from 'lucide-react';
import InventarioList from '../components/inventario/InventarioList';
import ControlStock from '../components/inventario/ControlStock';

export default function InventarioPage() {
  return (
    <div className="space-y-6 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Gestión de Inventario
        </h2>
        <p className="mt-1 text-gray-600">
          Administra el inventario y monitorea el stock de productos
        </p>
      </div>

      <Tabs defaultValue="inventario" className="space-y-6">
        <div className="bg-white rounded-lg border p-1 inline-flex">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="inventario" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
              <Package2 className="w-4 h-4 mr-2" />
              Inventario
            </TabsTrigger>
            <TabsTrigger value="stock" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
              <LineChart className="w-4 h-4 mr-2" />
              Control de Stock
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="inventario" className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <InventarioList />
          </div>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <ControlStock />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}