'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Hook para manejar la navegación en Next.js
import Image from 'next/image';

const LoginPollo: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Usamos el hook para redirigir al usuario

  // Datos de usuario simulados para pruebas
  const mockUser = {
    username: 'admin',   // Usuario simulado
    password: '12345',   // Contraseña simulada
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reiniciar el error antes de la validación

    // Validación básica de campos
    if (!username || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Verificación de las credenciales con los datos simulados
    console.log('Intentando login con:', username, password); // Verifica los valores ingresados
    if (username === mockUser.username && password === mockUser.password) {
      console.log('Credenciales correctas'); // Confirmar que las credenciales son correctas
      // Si las credenciales son correctas, redirigir al dashboard de Pollos
      localStorage.setItem(
        'token_pollo',
        JSON.stringify({ role: 'pollos', username: mockUser.username })
      );

      // Redirigir al dashboard de Pollos
      router.push('/admin/dash-pollos'); // Redirigir al panel de Pollos
    } else {
      setError('Credenciales incorrectas. Intenta nuevamente.');
      console.log('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-teal-500 to-indigo-600">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Sistema de Control de Producción de Pollos
      </h1>
      <div className="border-4 border-indigo-500 rounded-2xl p-4 max-w-4xl">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="w-full md:w-1/2 relative p-4">
            <Image
              src="/images/pollo2.jpg"
              alt="Imagen de un pollo"
              width={500}  // Establecer el ancho
              height={500} // Establecer la altura
              className="object-cover rounded-lg shadow-lg border-4 border-teal-500"
            />
          </div>
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
              Iniciar Sesión
            </h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
                {error}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Usuario</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition duration-300"
              >
                Ingresar
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              ¿Aún no tienes una cuenta?{' '}
              <a href="/register-pollo" className="text-teal-600 hover:underline font-medium">
                Regístrate
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPollo;
