'use client';

import { FC } from 'react';
import { 
  LayoutDashboard,
  Users,
  Bird,
  Warehouse,
  Syringe,
  LogOut,
  FileText
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar: FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'general', label: 'General', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { id: 'usuarios', label: 'Usuarios', icon: <Users className="w-4 h-4 mr-2" /> },
    { id: 'razas', label: 'Razas', icon: <Bird className="w-4 h-4 mr-2" /> },
    { id: 'inventario', label: 'Inventario', icon: <Warehouse className="w-4 h-4 mr-2" /> },
    { id: 'configuracion', label: 'Configuración', icon: <Syringe className="w-4 h-4 mr-2" /> },
    { id: 'reportes', label: 'Reportes', icon: <FileText className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-purple-600">Granja Elvita</span>
          </div>

          {/* Navegación */}
          <div className="flex items-center space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 ${
                  activeTab === tab.id ? 'bg-gray-100' : ''
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}

            <button 
              className="flex items-center px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
