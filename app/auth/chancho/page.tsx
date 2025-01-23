'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LoginChancho = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    setError(""); // Limpiar errores anteriores

    // Verifica que los campos no estén vacíos
    if (!username || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    // Verifica si las credenciales son correctas
    if (username === "admin" && password === "12345") {
      // Si las credenciales son correctas, redirige al dashboard de chanchos
      router.push("/admin/dash-chanchos/");
    } else {
      setError("Credenciales incorrectas. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
      {/* Título en la parte superior */}
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Sistema de Control de Producción de Chanchos
      </h1>

      {/* Contenedor principal con borde ajustado */}
      <div className="border-4 border-red-500 rounded-2xl p-4 max-w-4xl">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Sección de la imagen */}
          <div className="w-full md:w-1/2 relative p-4">
            <Image
              src="/images/cerdito3.jpg" // Reemplaza con la ruta correcta de la imagen
              alt="Imagen de un chancho"
              layout="responsive"
              width={500}
              height={500}
              className="object-cover rounded-lg shadow-lg border-4 border-pink-500"
            />
          </div>

          {/* Sección del formulario */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
              Iniciar Sesión
            </h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
                {error}
              </div>
            )}
            <form
              className="space-y-6"
              onSubmit={handleLogin} // Llamar al handleLogin cuando se envíe el formulario
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Usuario
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Ingresar
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              ¿Aún no tienes una cuenta?{" "}
              <a
                href="/register-chancho"
                className="text-red-500 hover:underline font-medium"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginChancho;
