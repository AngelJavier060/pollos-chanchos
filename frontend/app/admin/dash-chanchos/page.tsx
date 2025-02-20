'use client';

import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

interface Lote {
  id: string;
  nombre: string;
  raza: string;
  cantidad: number;
  fecha_nacimiento: string;
  tipo_animal: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lotes, setLotes] = useState<Lote[]>([]);

  // Cargar lotes desde localStorage
  useEffect(() => {
    const lotesGuardados = localStorage.getItem('lotes');
    if (lotesGuardados) {
      const todosLotes = JSON.parse(lotesGuardados);
      // Filtrar solo los lotes de chanchos
      const lotesChanchos = todosLotes.filter((lote: Lote) => 
        lote.tipo_animal === 'chancho' || lote.raza.toLowerCase().includes('chancho')
      );
      setLotes(lotesChanchos);
    }
  }, []);

  // Calcular días desde el nacimiento
  const calcularDiasDesdeNacimiento = (fecha: string) => {
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    const diferencia = hoy.getTime() - nacimiento.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  };

  const LotesView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {lotes.length === 0 ? (
        <div className="col-span-full text-center py-10 text-gray-500">
          No hay lotes registrados
        </div>
      ) : (
        lotes.map((lote, index) => (
          <div key={lote.id} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Lote {index + 1}</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Raza:</span>
                <span className="text-right">{lote.raza}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cantidad:</span>
                <span className="text-right">{lote.cantidad} chanchos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Edad:</span>
                <span className="text-right">{calcularDiasDesdeNacimiento(lote.fecha_nacimiento)} días</span>
              </div>
              <button 
                className="w-full mt-4 py-2 text-center text-gray-600 hover:text-gray-800 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                onClick={() => {
                  // Aquí irá la funcionalidad de ver detalles
                }}
              >
                Ver Detalles
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="p-8 pt-20">
        <h1 className="text-2xl font-bold mb-6">
          {activeTab === 'dashboard' ? 'Panel de Control' : 'Mis Lotes'}
        </h1>
        
        {activeTab === 'dashboard' ? <Dashboard /> : <LotesView />}
      </main>
    </div>
  );
}
