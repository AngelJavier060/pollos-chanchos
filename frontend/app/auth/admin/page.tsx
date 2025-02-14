'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "@/app/components/ui/use-toast";
import Link from 'next/link';
import { authService } from '@/app/lib/auth';

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar campos
      if (!formData.username || !formData.password) {
        toast({
          title: "Error",
          description: "Por favor complete todos los campos",
          variant: "destructive",
        });
        return;
      }

      // Validar credenciales
      if (formData.username === 'admin' && formData.password === 'password') {
        // Redirigir al dashboard
        router.push('/admin/dashboard');
        return;
      }

      console.log('Enviando datos:', {
        username: formData.username,
        password: formData.password
      });

      // Crear FormData para enviar
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('grant_type', 'password');

      // Simular respuesta exitosa
      const data = { access_token: 'fake_access_token', token_type: 'Bearer' };

      if (data.access_token) {
        // Guardar datos de autenticación
        authService.setAuthData({
          access_token: data.access_token,
          token_type: data.token_type
        });

        toast({
          title: "¡Bienvenido!",
          description: "Inicio de sesión exitoso",
        });

        // Redirigir al dashboard
        router.push('/admin/dashboard');
      } else {
        throw new Error('No se recibió el token de acceso');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      
      toast({
        title: "Error",
        description: error.message || "Error al iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Ingrese su usuario"
              className="mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Ingrese su contraseña"
              className="mt-1"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
}
