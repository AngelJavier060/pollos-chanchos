'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClockIcon, CubeIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Navbar from './components/Navbar'; // Importamos el Navbar
import RegistroLotes from './components/registro/RegistroLotes'; // Registro de Lotes
import RegistroAlimentos from './components/RegistroAlimentos'; // Registro de Alimentos
import RegistroMedicinas from './components/RegistroMedicinas'; // Registro de Medicinas

// Importa el componente DashboardContent donde tienes las gráficas
import DashboardContent from './components/Dashboard'; // Importamos DashboardContent para las gráficas

const DashboardPollos = () => {
  const [activeTab, setActiveTab] = useState('registro');

  const renderContent = () => {
    switch (activeTab) {
      case 'registro':
        return <RegistroLotes />;
      case 'alimento':
        return <RegistroAlimentos />;
      case 'medicina':
        return <RegistroMedicinas />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="p-8 pt-20">
        <h1 className="text-2xl font-bold mb-6">
          {activeTab === 'registro' ? 'Registro de Lotes' : 
           activeTab === 'alimento' ? 'Registro de Alimento' : 
           'Registro de Medicina'}
        </h1>
        
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardPollos;
