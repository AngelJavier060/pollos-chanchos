'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { Home, Users, DogIcon, Package, Settings, FileText, LogOut } from "lucide-react";
import { Button } from "@/app/components/ui/button";

const navigationItems = [
  { label: "General", href: "/admin/dashboard", icon: Home },
  { label: "Usuarios", href: "/admin/dashboard/usuarios", icon: Users },
  { label: "Gestión de Razas", href: "/admin/dashboard/razas", icon: DogIcon },
  { label: "Inventario", href: "/admin/dashboard/inventario", icon: Package },
  { label: "Configuración", href: "/admin/dashboard/configuracion", icon: Settings },
  { label: "Reportes", href: "/admin/dashboard/reportes", icon: FileText },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <nav className="flex justify-between items-center border-b px-6 bg-white">
      <div className="flex space-x-6">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 py-4 text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="text-red-600 hover:text-red-800 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Salir
      </Button>
    </nav>
  );
}
