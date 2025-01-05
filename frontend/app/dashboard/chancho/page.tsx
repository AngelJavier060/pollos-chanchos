"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateToken } from '@/services/authService';

const DashboardChancho = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token_chancho");

    if (token) {
      try {
        const decoded = JSON.parse(token); // Simulación del token decodificado

        if (decoded.role !== "chancho") {
          console.log("Rol no autorizado. Redirigiendo al login...");
          router.push("/login-chancho");
        }
      } catch (error) {
        console.log("Error al procesar el token. Redirigiendo al login...");
        router.push("/login-chancho");
      }
    } else {
      console.log("Token no encontrado. Redirigiendo al login...");
      router.push("/login-chancho");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-100">
      <h1 className="text-3xl font-bold text-red-800">
        Bienvenido al Dashboard de Chanchos
      </h1>
    </div>
  );
};

export default DashboardChancho;
