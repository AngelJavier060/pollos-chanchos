'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { User } from './types/user';

interface UserFormProps {
  onSubmit: (data: Partial<User>) => void;
  initialData?: User | null;
}

const UserForm: FC<UserFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    nombreUsuario: '',
    email: '',
    password: '',
    rol: 'usuario',
    vigencia: 30,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        apellido: initialData.apellido || '',
        nombreUsuario: initialData.nombreUsuario || '',
        email: initialData.email || '',
        password: '',
        rol: initialData.rol || 'usuario',
        vigencia: initialData.vigencia || 30,
      });
    } else {
      // Resetear el formulario cuando no hay datos iniciales
      setFormData({
        nombre: '',
        apellido: '',
        nombreUsuario: '',
        email: '',
        password: '',
        rol: 'usuario',
        vigencia: 30,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'rol' && value === 'administrador' ? { vigencia: 999999 } : {})
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        vigencia: parseInt(formData.vigencia.toString())
      };
      onSubmit(submitData);
    } catch (error) {
      console.error('Error en el formulario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? 'Editar Usuario' : 'Crear Usuario'}
      </h3>
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="apellido">Apellido</Label>
        <Input
          id="apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="nombreUsuario">Nombre de Usuario</Label>
        <Input
          id="nombreUsuario"
          name="nombreUsuario"
          value={formData.nombreUsuario}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="rol">Rol</Label>
        <select
          id="rol"
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        >
          <option value="administrador">Administrador</option>
          <option value="usuario">Usuario</option>
        </select>
      </div>

      {formData.rol !== 'administrador' && (
        <div>
          <Label htmlFor="vigencia">Vigencia (días)</Label>
          <Input
            id="vigencia"
            name="vigencia"
            type="number"
            value={formData.vigencia}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
      )}

      <Button type="submit" className="w-full">
        {initialData ? 'Actualizar Usuario' : 'Crear Usuario'}
      </Button>
    </form>
  );
};

export default UserForm;
