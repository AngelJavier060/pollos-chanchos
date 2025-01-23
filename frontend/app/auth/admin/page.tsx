'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";  // Usamos useRouter de Next.js para la redirección
import { Button } from "@/components/ui/button"; // Asegúrate de tener estos componentes
import { Input } from "@/components/ui/input"; // Asegúrate de tener estos componentes
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    setError(""); // Limpiar el mensaje de error

    // Lógica de autenticación (esto debe ser reemplazado por una verificación real)
    if (username === "admin" && password === "12345") {
      // Autenticación exitosa
      localStorage.setItem("userType", "admin"); // Guardar el tipo de usuario en el localStorage (si es necesario)
      router.push("/admin/dashboard"); // Redirigir al dashboard del administrador
    } else {
      // Autenticación fallida
      setError("Credenciales incorrectas. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <User className="h-6 w-6 text-blue-500" />
          </div>
          <CardTitle>Acceso Administrador</CardTitle>
          <CardDescription>Portal de administración general</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="button" onClick={handleLogin} className="w-full">
              Ingresar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
