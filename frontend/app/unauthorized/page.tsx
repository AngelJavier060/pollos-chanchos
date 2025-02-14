'use client';

import { Button } from "@/app/components/ui/button";
import { useRouter } from 'next/navigation';
import { authService } from '@/app/lib/auth';

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso No Autorizado</h1>
        <p className="text-gray-600 mb-6">
          No tiene los permisos necesarios para acceder a esta sección.
        </p>
        <Button onClick={handleLogout} className="w-full">
          Volver al Login
        </Button>
      </div>
    </div>
  );
} 