'use client';

import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, Home, ClipboardList, Bird, PiggyBank, 
  Settings, FileText, LogOut, DogIcon
} from 'lucide-react';
import { clearSession } from "@/app/lib/auth";

const menuItems = [
  { icon: Home, label: 'General', href: '/admin/dashboard' },
  { icon: Users, label: 'Usuarios', href: '/admin/dashboard/usuarios' },
  { icon: DogIcon, label: 'Lotes', href: '/admin/dashboard/razas' },
  { icon: Bird, label: 'Pollos', href: '/admin/dashboard/pollos' },
  { icon: PiggyBank, label: 'Chanchos', href: '/admin/dashboard/chanchos' },
  { icon: FileText, label: 'Reportes', href: '/admin/dashboard/reportes' },
  { icon: Settings, label: 'Configuración', href: '/admin/dashboard/configuracion' },
];

const Sidebar = () => {
  const pathname = usePathname();

  const handleLogout = () => {
    clearSession();
    window.location.href = '/auth/login';
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900">
      <div className="px-3 py-2">
        <Link href="/admin/dashboard">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-white">
            Sistema de Gestión
          </h2>
        </Link>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className={cn("w-full justify-start", {
                  'bg-gray-800 text-white hover:bg-gray-800': pathname === item.href,
                  'text-gray-400 hover:text-white hover:bg-gray-800': pathname !== item.href
                })}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3">
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;