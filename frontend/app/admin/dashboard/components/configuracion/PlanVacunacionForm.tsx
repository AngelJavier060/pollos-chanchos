'use client';

import { FC, useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { Plus, Trash2 } from 'lucide-react';
import { PlanVacunacion, Vacuna, VacunaPlan } from '../../types/vacunacion';
import { Raza } from '../types/configuracion';

interface PlanVacunacionFormProps {
  onSubmit: (data: Partial<PlanVacunacion>) => void;
  initialData?: PlanVacunacion | null;
  razas: Raza[];
  vacunas: Vacuna[];
}

const PlanVacunacionForm: FC<PlanVacunacionFormProps> = ({
  onSubmit,
  initialData,
  razas,
  vacunas
}) => {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    tipo_animal: initialData?.tipo_animal || 'pollo',
    raza_id: initialData?.raza_id?.toString() || '',
    descripcion: initialData?.descripcion || '',
    vacunas: initialData?.vacunas || []
  });

  const [nuevaVacuna, setNuevaVacuna] = useState<Partial<VacunaPlan>>({
    vacuna_id: 0,
    dia_aplicacion: 0,
    observaciones: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      raza_id: parseInt(formData.raza_id)
    });
  };

  const agregarVacuna = () => {
    if (nuevaVacuna.vacuna_id && nuevaVacuna.dia_aplicacion) {
      setFormData(prev => ({
        ...prev,
        vacunas: [...prev.vacunas, nuevaVacuna as VacunaPlan]
      }));
      setNuevaVacuna({
        vacuna_id: 0,
        dia_aplicacion: 0,
        observaciones: ''
      });
    }
  };

  const eliminarVacuna = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vacunas: prev.vacunas.filter((_, i) => i !== index)
    }));
  };

  const razasFiltradas = razas.filter(raza => raza.tipo_animal === formData.tipo_animal);
  const vacunasFiltradas = vacunas.filter(vacuna => vacuna.tipo_animal === formData.tipo_animal);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nombre del Plan</Label>
          <Input
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Animal</Label>
          <Select
            value={formData.tipo_animal}
            onValueChange={(value: 'pollo' | 'cerdo') => {
              setFormData(prev => ({
                ...prev,
                tipo_animal: value,
                raza_id: '',
                vacunas: []
              }));
            }}
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
          <Label>Raza</Label>
          <Select
            value={formData.raza_id}
            onValueChange={(value) => setFormData(prev => ({ ...prev, raza_id: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar raza" />
            </SelectTrigger>
            <SelectContent>
              {razasFiltradas.map((raza) => (
                <SelectItem key={raza.id} value={raza.id.toString()}>
                  {raza.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descripción</Label>
        <Textarea
          value={formData.descripcion}
          onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Vacunas del Plan</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Vacuna</Label>
            <Select
              value={nuevaVacuna.vacuna_id?.toString()}
              onValueChange={(value) => 
                setNuevaVacuna(prev => ({ ...prev, vacuna_id: parseInt(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar vacuna" />
              </SelectTrigger>
              <SelectContent>
                {vacunasFiltradas.map((vacuna) => (
                  <SelectItem key={vacuna.id} value={vacuna.id.toString()}>
                    {vacuna.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Día de Aplicación</Label>
            <Input
              type="number"
              value={nuevaVacuna.dia_aplicacion || ''}
              onChange={(e) => 
                setNuevaVacuna(prev => ({ 
                  ...prev, 
                  dia_aplicacion: parseInt(e.target.value) 
                }))
              }
            />
          </div>

          <div className="flex items-end">
            <Button type="button" onClick={agregarVacuna}>
              <Plus className="h-4 w-4 mr-2" /> Agregar
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {formData.vacunas.map((vacuna, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <div>
                <span className="font-medium">
                  {vacunas.find(v => v.id === vacuna.vacuna_id)?.nombre}
                </span>
                <span className="ml-2 text-muted-foreground">
                  Día {vacuna.dia_aplicacion}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => eliminarVacuna(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit">
          {initialData ? 'Actualizar' : 'Crear'} Plan
        </Button>
      </div>
    </form>
  );
};

export default PlanVacunacionForm; 