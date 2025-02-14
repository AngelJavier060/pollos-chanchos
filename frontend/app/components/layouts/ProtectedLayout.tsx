'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkSession } from '@/app/lib/auth';
import { toast } from "@/app/components/ui/use-toast";

export default function ProtectedLayout({
  children,
  requiredRole = ['admin']
}: {
  children: React.ReactNode;
  requiredRole?: string[];
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (!checkSession()) {
        toast({
          title: "Sesión expirada",
          description: "Por favor, inicie sesión nuevamente",
          variant: "destructive",
        });
        router.push('/auth/admin');
        return;
      }

      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        if (!requiredRole.includes(user.rol)) {
          toast({
            title: "Acceso denegado",
            description: "No tiene permisos para acceder a esta sección",
            variant: "destructive",
          });
          router.push('/');
        }
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000 * 60); // Verificar cada minuto
    
    return () => clearInterval(interval);
  }, [router, requiredRole]);

  return <>{children}</>;
} 