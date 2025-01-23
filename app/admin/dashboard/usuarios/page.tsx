'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import { toast } from "@/components/ui/use-toast";
import Navbar from "../components/Navbar";

const UsuariosPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([
    // ... tus datos de usuarios
  ]);

  const handleAddUser = (formData: any) => {
    if (!formData.nombre || !formData.apellido || !formData.nombreUsuario || !formData.email || !formData.password || formData.vigencia <= 0) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios y la vigencia debe ser mayor a 0.",
        variant: "destructive",
      });
      return;
    }

    setUsers([...users, { ...formData, id: Date.now() }]);
    toast({
      title: "Usuario creado",
      description: `El usuario ${formData.nombreUsuario} ha sido creado correctamente.`,
      variant: "success",
      duration: 3000,
    });
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="p-8 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Usuarios</h1>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Agregar Usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <UserForm onSubmit={handleAddUser} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <UserTable users={users} />
        </div>
      </main>
    </div>
  );
};

export default UsuariosPage; 