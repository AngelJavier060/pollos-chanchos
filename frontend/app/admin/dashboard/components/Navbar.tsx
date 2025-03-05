'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { 
  Home, Users, Package, Settings, FileText, DogIcon, LogOut,
  Utensils, ChevronDown
} from 'lucide-react';
import { authService } from '@/app/lib/auth';
import Image from 'next/image';

const navigationItems = [
  { label: "General", href: "/admin/dashboard", icon: Home },
  { label: "Usuarios", href: "/admin/dashboard/usuarios", icon: Users },
  { label: "Registro de Lotes", href: "/admin/dashboard/razas", icon: DogIcon },
  { label: "Inventario", href: "/admin/dashboard/inventario", icon: Package },
  { label: "Plan Nutricional", href: "/admin/dashboard/plan-nutricional", icon: Utensils },
  { label: "Configuración", href: "/admin/dashboard/configuracion", icon: Settings },
  { label: "Reportes", href: "/admin/dashboard/reportes", icon: FileText },
];

const Navbar = () => {
  const pathname = usePathname();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <nav className="bg-white border-b border-blue-100 shadow-md relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo y Título */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">GE</span>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Granja Elvita
              </span>
              <span className="text-sm text-gray-500 block">Panel Administrador</span>
            </div>
          </div>
          
          {/* Navegación */}
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-200",
                    pathname === item.href
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className={cn(
                      "h-4 w-4 transition-colors duration-200",
                      pathname === item.href
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-blue-600"
                    )} />
                    <span>{item.label}</span>
                  </div>
                  {pathname === item.href && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600" />
                  )}
                </Button>
              </Link>
            ))}
            
            {/* Botón de Salir */}
            <div className="border-l border-blue-100 pl-4 ml-4">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="relative group px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-red-50"
              >
                <div className="flex items-center space-x-2 text-red-600 group-hover:text-red-700">
                  <LogOut className="h-4 w-4" />
                  <span>Salir</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
