'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClockIcon, CubeIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Navbar from './components/Navbar'; // Importamos el Navbar
import RegistroPollos from './components/RegistroPollos'; // Registro de Pollos
import RegistroAlimentos from './components/RegistroAlimentos'; // Registro de Alimentos
import RegistroMedicinas from './components/RegistroMedicinas'; // Registro de Medicinas

// Importa el componente DashboardContent donde tienes las gráficas
import DashboardContent from './components/Dashboard'; // Importamos DashboardContent para las gráficas

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // Estado para manejar las pestañas
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para manejar el desplegable
  const router = useRouter(); // Hook para manejar redirección

  const handleLogout = () => {
    router.push('/'); // Redirige a la página principal
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Franja superior */}
      <div className="bg-white shadow flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          <button className="bg-purple-600 text-white p-2 rounded">
            <ClockIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            onClick={handleLogout}
          >
            Salir
          </button>
        </div>
      </div>

      <div className="flex flex-grow">
        {/* Menú lateral */}
        <aside className="w-20 bg-blue-900 shadow-lg min-h-screen flex flex-col items-center py-4">
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </aside>

        {/* Contenido principal */}
        <div className="flex-1 p-6">
          {/* Mostrar el contenido de cada pestaña */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-700">Dashboard de Pollos</h1>
              <p className="text-gray-600">Bienvenido al panel de control de Pollos.</p>
              {/* Aquí se añaden las gráficas */}
              <DashboardContent /> {/* Esta es la parte que renderiza el gráfico */}
            </div>
          )}
          {activeTab === 'registro-pollos' && <RegistroPollos />}
          {activeTab === 'registro-alimentos' && <RegistroAlimentos />}
          {activeTab === 'registro-medicinas' && <RegistroMedicinas />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
