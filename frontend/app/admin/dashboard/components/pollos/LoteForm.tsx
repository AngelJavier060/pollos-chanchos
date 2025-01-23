'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lote } from '../types/pollo';
import { Raza } from '../types/raza';

interface LoteFormProps {
  onSubmit: (data: Partial<Lote>) => void;
  initialData?: Lote | null;
  razas: Raza[];
}

const LoteForm: FC<LoteFormProps> = ({ onSubmit, initialData, razas }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    cantidadInicial: '',
    razaId: '',
    galpón: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        codigo: initialData.codigo,
        fechaIngreso: initialData.fechaIngreso.split('T')[0],
        cantidadInicial: initialData.cantidadInicial.toString(),
        razaId: initialData.razaId.toString(),
        galpón: initialData.galpón,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      cantidadInicial: parseInt(formData.cantidadInicial),
      cantidadActual: parseInt(formData.cantidadInicial), // Al crear, es igual a la inicial
      razaId: parseInt(formData.razaId),
      estado: 'activo' as const,
      mortalidad: 0,
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? 'Editar Lote' : 'Crear Nuevo Lote'}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="codigo">Código del Lote</Label>
          <Input
            id="codigo"
            value={formData.codigo}
            onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
            placeholder="Ej: L-2024-001"
            required
          />
        </div>

        <div>
          <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
          <Input
            id="fechaIngreso"
            type="date"
            value={formData.fechaIngreso}
            onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cantidadInicial">Cantidad Inicial</Label>
          <Input
            id="cantidadInicial"
            type="number"
            value={formData.cantidadInicial}
            onChange={(e) => setFormData({ ...formData, cantidadInicial: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="razaId">Raza</Label>
          <select
            id="razaId"
            value={formData.razaId}
            onChange={(e) => setFormData({ ...formData, razaId: e.target.value })}
            className="w-full border rounded-md p-2"
            required
          >
            <option value="">Seleccione una raza</option>
            {razas
              .filter(raza => raza.tipoAnimal === 'pollo')
              .map(raza => (
                <option key={raza.id} value={raza.id}>
                  {raza.nombre}
                </option>
              ))
            }
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="galpón">Galpón</Label>
        <Input
          id="galpón"
          value={formData.galpón}
          onChange={(e) => setFormData({ ...formData, galpón: e.target.value })}
          placeholder="Ubicación del lote"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Actualizar Lote' : 'Crear Lote'}
      </Button>
    </form>
  );
};

export default LoteForm; 