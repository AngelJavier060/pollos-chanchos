"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/dropdown-menu";
import { Bird, Rat, Search, Lock } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLoginClick = (type?: string) => {
    if (type) {
      localStorage.setItem('userType', type);
    }
    
    if (type === "pollos") {
      router.push('/auth/pollo');
    } else if (type === "chanchos") {
      router.push('/auth/chancho');
    } else {
      router.push('/auth/admin');
    }
  };

  const handleAdminClick = () => {
    router.push('/auth/admin');
  };

  return (
    <div>
      {/* Barra superior */}
      <div className="bg-blue-800 text-white">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center">
            <img
              src="/images/logo1.webp"
              alt="Logo"
              className="h-10"
            />
            <span className="ml-3 text-lg font-bold">Granja Elvita</span>
          </div>

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
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-white hover:text-yellow-300"
              >
                Intranet
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-4 text-black z-50">
                  <button
                    onClick={() => handleLoginClick("admin")}
                    className="flex items-center block px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Administrador
                  </button>
                  <button
                    onClick={() => handleLoginClick("pollos")}
                    className="flex items-center block px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Bird className="mr-2 h-4 w-4" />
                    Pollos
                  </button>
                  <button
                    onClick={() => handleLoginClick("chanchos")}
                    className="flex items-center block px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Rat className="mr-2 h-4 w-4" />
                    Chanchos
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <img
          src="/images/cerdito1.jpg"
          alt="Producción de Cerdos"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center">
            Sistema de Control de Cerdos y Pollos
          </h1>
        </div>
      </div>

      {/* Sección de descripción */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Mejora tu Producción Agropecuaria</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Este sistema te ayudará a controlar la producción de cerdos y pollos con datos detallados sobre crecimiento, alimentación y rendimiento. Organiza y maximiza tus recursos de forma eficiente y profesional.
          </p>
        </div>
      </div>

      {/* Sección de tarjetas */}
      <div className="py-16 bg-white">
        <div className="container mx-auto grid md:grid-cols-2 gap-8">
          {/* Tarjeta de Cerdos */}
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img
              src="/images/cerdito2.jpg"
              alt="Producción de Cerdos"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 p-8 flex flex-col justify-end">
              <h3 className="text-3xl font-bold text-white mb-4">Producción de Cerdos</h3>
              <p className="text-white text-lg">
                Gestiona toda la información sobre la producción de cerdos: inventarios, alimentación, y datos de crecimiento.
              </p>
            </div>
          </div>

          {/* Tarjeta de Pollos */}
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img
              src="/images/pollo1.jpg"
              alt="Producción de Pollos"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 p-8 flex flex-col justify-end">
              <h3 className="text-3xl font-bold text-white mb-4">Producción de Pollos</h3>
              <p className="text-white text-lg">
                Administra toda la producción de pollos con herramientas avanzadas para maximizar su rendimiento.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>© 2025 Granja Elvita. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
