'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "@/app/components/ui/use-toast";
import Link from 'next/link';
import { authService } from '@/app/lib/auth';
import { User, KeyRound } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-gray-900">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Acceso Administrativo</h1>
          <p className="text-gray-600 mt-2">Ingrese sus credenciales para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Ingrese su usuario"
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Ingrese su contraseña"
                className="pl-10"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
        
        <div className="text-center">
          <Link 
            href="/auth/forgot-password" 
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
}
