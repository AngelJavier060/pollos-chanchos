'use client';

import { useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { toast } from "@/app/components/ui/use-toast";
import { User } from '../types/user';

interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: any) => void;
}

const UserForm = ({ initialData, onSubmit }: UserFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    apellido: initialData?.apellido || '',
    usuario: initialData?.usuario || '',
    correo: initialData?.correo || '',
    password: '',
    rol: initialData?.rol || 'admin',
    vigencia: initialData?.vigencia || 30,
    estado: initialData?.estado ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Si es admin, no enviamos vigencia
      const dataToSubmit = formData.rol === 'admin' 
        ? { ...formData, vigencia: 365 } 
        : formData;
      
      await onSubmit(dataToSubmit);
    } catch (error) {
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombres</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido">Apellidos</Label>
          <Input
            id="apellido"
            value={formData.apellido}
            onChange={(e) => setFormData(prev => ({ ...prev, apellido: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="usuario">Usuario</Label>
        <Input
          id="usuario"
          value={formData.usuario}
          onChange={(e) => setFormData(prev => ({ ...prev, usuario: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="correo">Correo Electrónico</Label>
        <Input
          id="correo"
          type="email"
          value={formData.correo}
          onChange={(e) => setFormData(prev => ({ ...prev, correo: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña {!initialData && <span className="text-red-500">*</span>}</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          required={!initialData}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rol">Rol</Label>
        <Select
          value={formData.rol}
          onValueChange={(value) => setFormData(prev => ({ ...prev, rol: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="pollo">Usuario de Pollo</SelectItem>
            <SelectItem value="chancho">Usuario de Chancho</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.rol !== 'admin' && (
        <div className="space-y-2">
          <Label htmlFor="vigencia">Días de Vigencia</Label>
          <Input
            id="vigencia"
            type="number"
            min="1"
            value={formData.vigencia}
            onChange={(e) => setFormData(prev => ({ ...prev, vigencia: parseInt(e.target.value) }))}
            required
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.estado}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, estado: checked }))}>
        </Switch>
        <Label>Usuario Activo</Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Procesando..." : initialData ? "Actualizar Usuario" : "Crear Usuario"}
      </Button>
    </form>
  );
};

export default UserForm;
