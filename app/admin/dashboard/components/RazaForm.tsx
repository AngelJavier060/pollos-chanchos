'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Raza } from './types/raza';

interface RazaFormProps {
  onSubmit: (data: Partial<Raza>) => void;
  initialData?: Raza | null;
}

const RazaForm: FC<RazaFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipoAnimal: 'pollo',
    pesoPromedio: '',
    tamanioPromedio: '',
    edadMadurez: '',
    tiempoCrecimiento: '',
    descripcion: '',
    imagen: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        tipoAnimal: initialData.tipoAnimal || 'pollo',
        pesoPromedio: initialData.pesoPromedio?.toString() || '',
        tamanioPromedio: initialData.tamanioPromedio?.toString() || '',
        edadMadurez: initialData.edadMadurez?.toString() || '',
        tiempoCrecimiento: initialData.tiempoCrecimiento?.toString() || '',
        descripcion: initialData.descripcion || '',
        imagen: initialData.imagen || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      pesoPromedio: parseFloat(formData.pesoPromedio),
      tamanioPromedio: parseFloat(formData.tamanioPromedio),
      edadMadurez: parseFloat(formData.edadMadurez),
      tiempoCrecimiento: parseFloat(formData.tiempoCrecimiento)
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? 'Editar Raza' : 'Agregar Raza'}
      </h3>

      <div>
        <Label htmlFor="nombre">Nombre de la Raza</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          placeholder="Ej: Pollo Broiler"
          required
        />
      </div>

      <div>
        <Label htmlFor="tipoAnimal">Tipo de Animal</Label>
        <select
          id="tipoAnimal"
          value={formData.tipoAnimal}
          onChange={(e) => setFormData({ ...formData, tipoAnimal: e.target.value })}
          className="w-full border rounded-md p-2"
          required
        >
          <option value="pollo">Pollo</option>
          <option value="cerdo">Cerdo</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pesoPromedio">Peso Promedio (kg)</Label>
          <Input
            id="pesoPromedio"
            type="number"
            step="0.1"
            value={formData.pesoPromedio}
            onChange={(e) => setFormData({ ...formData, pesoPromedio: e.target.value })}
            placeholder="Ej: 3.5"
            required
          />
        </div>

        <div>
          <Label htmlFor="tamanioPromedio">Tamaño Promedio (cm)</Label>
          <Input
            id="tamanioPromedio"
            type="number"
            value={formData.tamanioPromedio}
            onChange={(e) => setFormData({ ...formData, tamanioPromedio: e.target.value })}
            placeholder="Ej: 40"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edadMadurez">Edad de Madurez (meses)</Label>
          <Input
            id="edadMadurez"
            type="number"
            step="0.5"
            value={formData.edadMadurez}
            onChange={(e) => setFormData({ ...formData, edadMadurez: e.target.value })}
            placeholder="Ej: 4"
            required
          />
        </div>

        <div>
          <Label htmlFor="tiempoCrecimiento">Tiempo de Crecimiento (meses)</Label>
          <Input
            id="tiempoCrecimiento"
            type="number"
            step="0.5"
            value={formData.tiempoCrecimiento}
            onChange={(e) => setFormData({ ...formData, tiempoCrecimiento: e.target.value })}
            placeholder="Ej: 4"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="descripcion">Descripción y Características Adicionales</Label>
        <textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          className="w-full border rounded-md p-2 min-h-[100px]"
          placeholder="Describe las características especiales de esta raza..."
        />
      </div>

      <div>
        <Label htmlFor="imagen">URL de la Imagen (opcional)</Label>
        <Input
          id="imagen"
          value={formData.imagen}
          onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Actualizar Raza' : 'Crear Raza'}
      </Button>
    </form>
  );
};

export default RazaForm; 