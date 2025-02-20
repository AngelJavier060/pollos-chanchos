'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { toast } from "@/app/components/ui/use-toast";
import Navbar from './components/Navbar';
import DashboardContent from './components/Dashboard';

interface Lote {
  id: number;
  nombre: string;
  raza: string;
  cantidad: number;
  fecha_nacimiento: string;
  tipo_animal: string;
}

// Datos de ejemplo para desarrollo
const datosEjemplo: Lote[] = [
  {
    id: 1,
    nombre: 'Lote-CH-001',
    raza: 'Landrace',
    cantidad: 50,
    fecha_nacimiento: '2024-01-15',
    tipo_animal: 'chancho'
  },
  {
    id: 2,
    nombre: 'Lote-CH-002',
    raza: 'Yorkshire',
    cantidad: 30,
    fecha_nacimiento: '2024-02-01',
    tipo_animal: 'chancho'
  }
];

export default function DashboardChancho() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lotes, setLotes] = useState<Lote[]>(datosEjemplo);

  // Calcular días desde el nacimiento
  const calcularDiasDesdeNacimiento = (fecha: string) => {
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    const diferencia = hoy.getTime() - nacimiento.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  };

  const LotesView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lotes.map((lote) => (
        <Card key={lote.id} className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">{lote.nombre}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Raza:</span>
                <span className="font-medium">{lote.raza}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Cantidad:</span>
                <span className="font-medium">{lote.cantidad} chanchos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Edad:</span>
                <span className="font-medium">{calcularDiasDesdeNacimiento(lote.fecha_nacimiento)} días</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => toast({
                  title: "Próximamente",
                  description: "Detalles del lote y seguimiento",
                })}
              >
                Ver Detalles
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'lotes':
        return <LotesView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="p-8 pt-20">
        <h1 className="text-2xl font-bold mb-6">
          {activeTab === 'dashboard' ? 'Panel de Control' :
           activeTab === 'lotes' ? 'Mis Lotes' : 
           'Panel de Control'}
        </h1>
        
        {renderContent()}
      </main>
    </div>
  );
}
