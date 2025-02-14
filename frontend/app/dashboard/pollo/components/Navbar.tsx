'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/app/components/ui/button";
import { LogOut } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/pollo');
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                activeTab === 'dashboard' 
                  ? 'border-b-2 border-blue-500 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onTabChange('registro')}
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                activeTab === 'registro' 
                  ? 'border-b-2 border-blue-500 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Registro de Lotes
            </button>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 