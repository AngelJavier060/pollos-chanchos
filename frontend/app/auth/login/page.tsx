'use client';

import { LoginForm } from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingrese sus credenciales para acceder
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}