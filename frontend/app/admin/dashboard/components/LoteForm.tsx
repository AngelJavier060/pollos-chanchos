'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Lote, TipoAnimal } from '../types/lote';

interface LoteFormProps {
  onSubmit: (data: Partial<Lote>) => void;
  onCancel: () => void;
  initialData?: Lote;
}

export default function LoteForm({ onSubmit, onCancel, initialData }: LoteFormProps) {
  const [formData, setFormData] = useState<Partial<Lote>>({
    nombre: '',
    tipo_animal: 'POLLO',
    cantidad: 0,
    fecha_nacimiento: '',
    costo: 0,
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre del Lote
        </label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          placeholder="Ingrese el nombre del lote"
          required
        />
      </div>

      <div>
        <label htmlFor="tipo_animal" className="block text-sm font-medium text-gray-700">
          Tipo de Animal
        </label>
        <Select
          value={formData.tipo_animal}
          onValueChange={(value: TipoAnimal) => setFormData({ ...formData, tipo_animal: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="POLLO">Pollos</SelectItem>
            <SelectItem value="CHANCHO">Chanchos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">
          Cantidad de Lote
        </label>
        <Input
          id="cantidad"
          type="number"
          min="1"
          value={formData.cantidad}
          onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) })}
          placeholder="Ingrese la cantidad"
          required
        />
      </div>

      <div>
        <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700">
          Fecha de Nacimiento
        </label>
        <Input
          id="fecha_nacimiento"
          type="date"
          value={formData.fecha_nacimiento}
          onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="costo" className="block text-sm font-medium text-gray-700">
          Costo del Lote
        </label>
        <Input
          id="costo"
          type="number"
          step="0.01"
          min="0"
          value={formData.costo}
          onChange={(e) => setFormData({ ...formData, costo: parseFloat(e.target.value) })}
          placeholder="Ingrese el costo"
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
