'use client';

import { FC, useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { PlanNutricional, FaseNutricional, Raza } from '../types/configuracion';
import { Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { toast } from "@/app/components/ui/use-toast";

interface PlanNutricionalProps {
  planes: PlanNutricional[];
  razas: Raza[];
  onAddPlan: (plan: Partial<PlanNutricional>) => void;
  onUpdatePlan: (id: number, plan: Partial<PlanNutricional>) => void;
  onDeletePlan: (id: number) => void;
}

const PlanNutricionalComponent: FC<PlanNutricionalProps> = ({
  planes,
  razas,
  onAddPlan,
  onUpdatePlan,
  onDeletePlan,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanNutricional | null>(null);
  const [formData, setFormData] = useState<Partial<PlanNutricional>>({
    nombre: '',
    tipoAnimal: 'pollo',
    razaId: 0,
    fases: [],
    estado: true
  });

  const [nuevaFase, setNuevaFase] = useState<Partial<FaseNutricional>>({
    nombre: '',
    diaInicio: 0,
    diaFin: 0,
    proteina: 0,
    energia: 0,
    fibra: 0,
    minerales: 0,
    descripcion: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await onUpdatePlan(editingPlan.id, formData);
      } else {
        await onAddPlan(formData);
      }
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el plan nutricional",
        variant: "destructive",
      });
    }
  };

  const agregarFase = () => {
    if (!nuevaFase.nombre || nuevaFase.diaInicio >= nuevaFase.diaFin) {
      toast({
        title: "Error",
        description: "Por favor complete correctamente los datos de la fase",
        variant: "destructive",
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      fases: [...(prev.fases || []), { ...nuevaFase, id: Date.now() } as FaseNutricional]
    }));

    setNuevaFase({
      nombre: '',
      diaInicio: 0,
      diaFin: 0,
      proteina: 0,
      energia: 0,
      fibra: 0,
      minerales: 0,
      descripcion: ''
    });
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      tipoAnimal: 'pollo',
      razaId: 0,
      fases: [],
      estado: true
    });
    setEditingPlan(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Planes Nutricionales</h3>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Plan
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Plan</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="raza">Raza</Label>
                <select
                  id="raza"
                  value={formData.razaId}
                  onChange={(e) => setFormData(prev => ({ ...prev, razaId: Number(e.target.value) }))}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Seleccione una raza</option>
                  {razas.filter(r => r.tipo_animal === formData.tipoAnimal).map(raza => (
                    <option key={raza.id} value={raza.id}>{raza.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border p-4 rounded-md space-y-4">
              <h4 className="font-medium">Fases Nutricionales</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre de la Fase</Label>
                  <Input
                    value={nuevaFase.nombre}
                    onChange={(e) => setNuevaFase(prev => ({ ...prev, nombre: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Día Inicio</Label>
                    <Input
                      type="number"
                      value={nuevaFase.diaInicio}
                      onChange={(e) => setNuevaFase(prev => ({ ...prev, diaInicio: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Día Fin</Label>
                    <Input
                      type="number"
                      value={nuevaFase.diaFin}
                      onChange={(e) => setNuevaFase(prev => ({ ...prev, diaFin: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Proteína (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={nuevaFase.proteina}
                    onChange={(e) => setNuevaFase(prev => ({ ...prev, proteina: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Energía (kcal)</Label>
                  <Input
                    type="number"
                    value={nuevaFase.energia}
                    onChange={(e) => setNuevaFase(prev => ({ ...prev, energia: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fibra (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={nuevaFase.fibra}
                    onChange={(e) => setNuevaFase(prev => ({ ...prev, fibra: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minerales (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={nuevaFase.minerales}
                    onChange={(e) => setNuevaFase(prev => ({ ...prev, minerales: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <Button type="button" onClick={agregarFase}>
                Agregar Fase
              </Button>

              <div className="mt-4">
                {formData.fases?.map((fase, index) => (
                  <div key={fase.id} className="flex items-center justify-between p-2 border rounded mb-2">
                    <span>{fase.nombre} (Días {fase.diaInicio}-{fase.diaFin})</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          fases: prev.fases?.filter(f => f.id !== fase.id)
                        }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit">
              {editingPlan ? 'Actualizar' : 'Crear'} Plan Nutricional
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {planes.map((plan) => (
          <div key={plan.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{plan.nombre}</h4>
                <p className="text-sm text-muted-foreground">
                  {razas.find(r => r.id === plan.razaId)?.nombre}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeletePlan(plan.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanNutricionalComponent; 