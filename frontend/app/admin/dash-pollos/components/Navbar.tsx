'use client';

import { FC } from 'react';
import { 
  ClipboardList,
  Utensils,
  Pill
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar: FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'registro', label: 'Registro', icon: <ClipboardList className="w-4 h-4 mr-2" /> },
    { id: 'alimento', label: 'Alimento', icon: <Utensils className="w-4 h-4 mr-2" /> },
    { id: 'medicina', label: 'Medicina', icon: <Pill className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-purple-600">Gestión de Pollos</span>
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
