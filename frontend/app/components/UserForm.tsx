'use client';

import { useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select } from "@/app/components/ui/select";
import { toast } from "@/app/components/ui/use-toast";
import { api } from '@/app/lib/api';

interface UserFormProps {
  user?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    usuario: user?.usuario || '',
    correo: user?.correo || '',
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    password: '',
    rol: user?.rol || 'usuario',
    vigencia: user?.vigencia || 365,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (user) {
        // Actualizar usuario
        await api.put(`/auth/users/${user.id}`, formData);
        toast({
          title: "Usuario actualizado",
          description: "El usuario se ha actualizado correctamente",
        });
      } else {
        // Crear nuevo usuario
        await api.post('/auth/users', formData);
        toast({
          title: "Usuario creado",
          description: "El usuario se ha creado correctamente",
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Hubo un error al procesar la solicitud",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="usuario">Usuario</label>
        <Input
          id="usuario"
          value={formData.usuario}
          onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
          required
        />
      </div>
      
      {/* Agregar campos similares para correo, nombre, apellido */}
      
      {!user && (
        <div>
          <label htmlFor="password">Contraseña</label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!user}
          />
        </div>
      )}

      <div>
        <label htmlFor="rol">Rol</label>
        <Select
          id="rol"
          value={formData.rol}
          onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
        >
          <option value="admin">Administrador</option>
          <option value="usuario">Usuario</option>
        </Select>
      </div>

      <div>
        <label htmlFor="vigencia">Días de vigencia</label>
        <Input
          id="vigencia"
          type="number"
          value={formData.vigencia}
          onChange={(e) => setFormData({ ...formData, vigencia: parseInt(e.target.value) })}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : user ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  );
} 