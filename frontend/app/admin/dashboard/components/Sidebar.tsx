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
  { icon: DogIcon, label: 'Razas', href: '/admin/dashboard/razas' },
  { icon: Bird, label: 'Pollos', href: '/admin/dashboard/pollos' },
  { icon: PiggyBank, label: 'Chanchos', href: '/admin/dashboard/chanchos' },
  { icon: FileText, label: 'Reportes', href: '/admin/dashboard/reportes' },
  { icon: Settings, label: 'Configuración', href: '/admin/dashboard/configuracion' },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    clearSession();
    window.location.href = '/auth/login';
  };

  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Panel Admin</h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", 
                    pathname === item.href && "bg-primary/10")}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 