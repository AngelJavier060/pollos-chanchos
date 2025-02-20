'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "@/app/components/ui/use-toast";
import Image from "next/image";

export default function LoginChancho() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Intentando login con:', { ...formData, password: '[PROTECTED]' });

      // Simulación temporal para desarrollo del frontend
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          user: { rol: 'chancho' },
          token: 'mock-token-for-development'
        })
      };

      const response = mockResponse;

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      
      if (data.user.rol !== 'chancho') {
        throw new Error('Acceso no autorizado');
      }

      localStorage.setItem('token', data.token);
      
      toast({
        title: "Éxito",
        description: "Inicio de sesión exitoso",
      });

      router.push('/admin/dash-chanchos/');
    } catch (error) {
      console.error('Error completo:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Sistema de Control de Producción de Chanchos
      </h1>

      <div className="border-4 border-red-500 rounded-2xl p-4 max-w-4xl">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="w-full md:w-1/2 relative p-4">
            <Image
              src="/images/cerdito3.jpg"
              alt="Imagen de un chancho"
              layout="responsive"
              width={500}
              height={500}
              className="object-cover rounded-lg shadow-lg border-4 border-pink-500"
            />
          </div>

          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Acceso Gestión de Chanchos</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Usuario</label>
                <Input
                  type="text"
                  value={formData.usuario}
                  onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
