"use client";

import { useState } from "react";
import Link from "next/link"; // Importar Link desde Next.js

export default function Home() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div>
      {/* Barra superior */}
      <div className="bg-blue-800 text-white">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/images/logo1.webp" // Cambia por tu logotipo
              alt="Logo"
              className="h-10"
            />
            <span className="ml-3 text-lg font-bold">Granja Elvita</span>
          </div>

          {/* Opciones del menú */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-white hover:text-yellow-300">
              Programas y Soluciones
            </a>
            <a href="#" className="text-white hover:text-yellow-300">
              Sectores
            </a>
            <a href="#" className="text-white hover:text-yellow-300">
              Investigación e Innovación
            </a>
            <a href="#" className="text-white hover:text-yellow-300">
              Soporte
            </a>
            <a href="#" className="text-white hover:text-yellow-300">Mail</a>
            {/* Enlace con menú desplegable */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-white hover:text-yellow-300"
              >
                Intranet
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-4 text-black z-50">
                  <Link
                    href="/login-pollo"
                    className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    Chicken
                  </Link>
                  <Link
                    href="/login-chancho"
                    className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    Pig
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Ícono de búsqueda */}
          <div className="hidden md:block">
            <button className="text-white hover:text-yellow-300">🔍</button>
          </div>
        </div>
      </div>

      {/* Encabezado con imagen destacada */}
      <div className="relative">
        <img
          src="/images/cerdito1.jpg" // Coloca una imagen de alta calidad aquí
          alt="Producción de Cerdos"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center">
            Sistema de Control de Cerdos y Pollos
          </h1>
        </div>
      </div>

      {/* Sección Descriptiva */}
      <div className="max-w-6xl mx-auto p-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          Mejora tu Producción Agropecuaria
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Este sistema te ayudará a controlar la producción de cerdos y pollos
          con datos detallados sobre crecimiento, alimentación y rendimiento.
          Organiza y maximiza tus recursos de forma eficiente y profesional.
        </p>
      </div>

      {/* Opciones de Producción */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tarjeta Cerdos */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src="/images/cerdito2.jpg"
              alt="Producción de Cerdos"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-green-500 mb-4">
                Producción de Cerdos
              </h3>
              <p className="text-gray-700">
                Gestiona toda la información sobre la producción de cerdos:
                inventarios, alimentación, y datos de crecimiento.
              </p>
              <div className="mt-4 flex space-x-8">
                <Link href="/login-chancho">
                  <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition">
                    Login
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Tarjeta Pollos */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src="/images/pollo1.jpg"
              alt="Producción de Pollos"
              className="w-full h-48 object-cover object-top"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-yellow-500 mb-4">
                Producción de Pollos
              </h3>
              <p className="text-gray-700">
                Administra toda la producción de pollos con herramientas
                avanzadas para maximizar su rendimiento.
              </p>
              <div className="mt-4 flex space-x-8">
                <Link href="/login-pollo">
                  <button className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition">
                    Login
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de estadísticas */}
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">En Granja Elvita</h2>
          <p className="text-lg mb-10">
            Estamos comprometidos a ofrecer el <span className="font-semibold">mejor</span>{" "}
            servicio garantizado.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-white rounded-lg p-6">
              <h3 className="text-4xl font-bold">120</h3>
              <p className="mt-2 text-lg">Cerdos en Producción</p>
            </div>
            <div className="border border-white rounded-lg p-6">
              <h3 className="text-4xl font-bold">95</h3>
              <p className="mt-2 text-lg">Pollos en Producción</p>
            </div>
            <div className="border border-white rounded-lg p-6">
              <h3 className="text-4xl font-bold">200+</h3>
              <p className="mt-2 text-lg">Clientes Satisfechos</p>
            </div>
          </div>
          <div className="mt-8">
            <button className="bg-blue-700 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition">
              Conócenos
            </button>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <footer className="bg-gray-800 text-gray-400 py-6">
        <div className="max-w-6xl mx-auto text-center">
          <p>© 2025 Granja Elvita. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
