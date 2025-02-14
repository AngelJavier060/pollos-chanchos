'use client';

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from "@/app/components/ui/dialog";
import { UserPlus } from "lucide-react";
import UserForm from "./UserForm";
import UserTable from "./UserTable";
import { toast } from "@/app/components/ui/use-toast";
import { User } from './types/user';
import { api } from '@/app/lib/api';

const UsersView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.get('/api/usuarios');
      console.log('Usuarios cargados:', data);
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        throw new Error('Formato de datos inválido');
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar usuarios');
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = async (user: User) => {
    setEditingUser(user);
    setIsOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      if (!window.confirm('¿Está seguro de eliminar este usuario?')) {
        return;
      }

      await api.delete(`/api/usuarios/${userId}`);
      
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente",
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (formData: Partial<User>) => {
    try {
      const data = {
        ...formData,
        vigencia: parseInt(formData.vigencia?.toString() || '30'),
        estado: formData.estado ?? true
      };

      if (editingUser) {
        await api.put(`/api/usuarios/${editingUser.id}`, data);
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...data } : user
        ));
        toast({
          title: "Usuario actualizado",
          description: "El usuario ha sido actualizado exitosamente",
        });
      } else {
        const response = await api.post('/api/usuarios', data);
        setUsers([...users, response.user]);
        toast({
          title: "Usuario creado",
          description: "El usuario ha sido creado exitosamente",
        });
      }

      setIsOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el usuario",
        variant: "destructive",
      });
    }
  };

  const handleUserCreated = () => {
    fetchUsers();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUser(null)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </DialogTitle>
              <DialogDescription>
                Complete el formulario para {editingUser ? 'editar el' : 'crear un nuevo'} usuario.
              </DialogDescription>
            </DialogHeader>
            <UserForm
              onSubmit={handleSubmit}
              initialData={editingUser}
              open={isOpen}
              onOpenChange={setIsOpen}
              onUserCreated={handleUserCreated}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading && <div className="text-center py-4">Cargando usuarios...</div>}
      {error && <div className="text-red-500 text-center py-4">{error}</div>}
      
      {!loading && !error && (
        <UserTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onUserUpdated={fetchUsers}
        />
      )}
    </div>
  );
};

export default UsersView; 