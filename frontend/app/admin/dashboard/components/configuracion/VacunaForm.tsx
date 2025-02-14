'use client';

import { FC, useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Textarea } from "@/app/components/ui/textarea";
import { Vacuna } from '../../types/vacunacion';
import { Producto } from '../../types/inventario';

interface VacunaFormProps {
  onSubmit: (data: Partial<Vacuna>) => void;
  initialData?: Vacuna | null;
  medicinas: Producto[];
}

const VacunaForm: FC<VacunaFormProps> = ({ onSubmit, initialData, medicinas }) => {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    tipo_animal: initialData?.tipo_animal || 'pollo',
    edad_aplicacion: initialData?.edad_aplicacion?.toString() || '',
    dosis: initialData?.dosis?.toString() || '',
    unidad_dosis: initialData?.unidad_dosis || '',
    intervalo_dosis: initialData?.intervalo_dosis?.toString() || '',
    descripcion: initialData?.descripcion || '',
    obligatoria: initialData?.obligatoria || false,
    efectos_secundarios: initialData?.efectos_secundarios || '',
    precauciones: initialData?.precauciones || '',
    producto_id: initialData?.producto_id?.toString() || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      edad_aplicacion: parseInt(formData.edad_aplicacion),
      dosis: parseFloat(formData.dosis),
      intervalo_dosis: formData.intervalo_dosis ? parseInt(formData.intervalo_dosis) : undefined,
      producto_id: parseInt(formData.producto_id)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Medicina</Label>
          <Select
            value={formData.producto_id || undefined}
            onValueChange={(value) => setFormData(prev => ({ ...prev, producto_id: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar medicina" />
            </SelectTrigger>
            <SelectContent>
              {medicinas && medicinas.length > 0 ? (
                medicinas.map((medicina) => (
                  <SelectItem key={medicina.id} value={medicina.id.toString()}>
                    {medicina.nombre || 'Medicina sin nombre'}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-medicinas" disabled>
                  No hay medicinas disponibles
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tipo de Animal</Label>
          <Select
            value={formData.tipo_animal}
            onValueChange={(value: 'pollo' | 'cerdo') => 
              setFormData(prev => ({ ...prev, tipo_animal: value }))
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pollo">Pollo</SelectItem>
              <SelectItem value="cerdo">Cerdo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Nombre de la Vacuna</Label>
          <Input
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Edad de Aplicación (días)</Label>
          <Input
            type="number"
            value={formData.edad_aplicacion}
            onChange={(e) => setFormData(prev => ({ ...prev, edad_aplicacion: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Dosis</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.dosis}
            onChange={(e) => setFormData(prev => ({ ...prev, dosis: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Unidad de Dosis</Label>
          <Input
            value={formData.unidad_dosis}
            onChange={(e) => setFormData(prev => ({ ...prev, unidad_dosis: e.target.value }))}
            placeholder="ml, cc, g, etc."
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descripción</Label>
        <Textarea
          value={formData.descripcion}
          onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="obligatoria"
          checked={formData.obligatoria}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, obligatoria: checked as boolean }))
          }
        />
        <Label htmlFor="obligatoria">Vacuna Obligatoria</Label>
      </div>

      <div className="space-y-2">
        <Label>Efectos Secundarios</Label>
        <Textarea
          value={formData.efectos_secundarios}
          onChange={(e) => setFormData(prev => ({ ...prev, efectos_secundarios: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Precauciones</Label>
        <Textarea
          value={formData.precauciones}
          onChange={(e) => setFormData(prev => ({ ...prev, precauciones: e.target.value }))}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit">
          {initialData ? 'Actualizar' : 'Crear'} Vacuna
        </Button>
      </div>
    </form>
  );
};

export default VacunaForm; 