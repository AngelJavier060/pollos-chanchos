'use client';

import { ClockIcon, CubeIcon, ChevronDownIcon } from '@heroicons/react/24/outline'; // Asegúrate de importar todos los íconos correctamente

const Navbar: React.FC<any> = ({ activeTab, setActiveTab, isMenuOpen, setIsMenuOpen }) => {
  return (
    <div>
      {/* Menú Dashboard */}
      <div
        className={`mb-8 flex flex-col items-center ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-400'}`}
        onClick={() => setActiveTab('dashboard')}
      >
        <ClockIcon className="h-8 w-8 hover:text-white transition" />
        <p className="text-xs mt-1 text-center">Dashboard</p>
      </div>

      {/* Registro con lista desplegable */}
      <div
        className="mb-8 flex flex-col items-center text-gray-400 cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="flex items-center space-x-1">
          <CubeIcon className="h-8 w-8 hover:text-white transition" />
          <ChevronDownIcon className="h-5 w-5 hover:text-white transition" />
        </div>
        <p className="text-xs mt-1 text-center">Registro</p>

        {/* Opciones desplegables */}
        {isMenuOpen && (
          <div className="mt-2 bg-white shadow-lg rounded-md p-2 text-gray-700">
            <div
              className="hover:bg-gray-100 p-2 rounded cursor-pointer"
              onClick={() => setActiveTab('registro-pollos')}
            >
              Pollo
            </div>
            <div
              className="hover:bg-gray-100 p-2 rounded cursor-pointer"
              onClick={() => setActiveTab('registro-alimentos')}
            >
              Alimento
            </div>
            <div
              className="hover:bg-gray-100 p-2 rounded cursor-pointer"
              onClick={() => setActiveTab('registro-medicinas')}
            >
              Medicina
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
