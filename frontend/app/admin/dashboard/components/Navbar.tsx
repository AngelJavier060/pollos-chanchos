'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { 
  Home, Users, Package, Settings, FileText, DogIcon, LogOut
} from 'lucide-react';
import { authService } from '@/app/lib/auth';

const navigationItems = [
  { label: "General", href: "/admin/dashboard", icon: Home },
  { label: "Usuarios", href: "/admin/dashboard/usuarios", icon: Users },
  { label: "Registro de Lotes", href: "/admin/dashboard/razas", icon: DogIcon },
  { label: "Inventario", href: "/admin/dashboard/inventario", icon: Package },
  { label: "Configuración", href: "/admin/dashboard/configuracion", icon: Settings },
  { label: "Reportes", href: "/admin/dashboard/reportes", icon: FileText },
];

const Navbar = () => {
  const pathname = usePathname();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold">Panel Administrador</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-black dark:text-white"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            
            <div className="border-l pl-4 ml-4">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
