'use client';

import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlanNutricional, FaseNutricional, Raza } from '../types/configuracion';
import { Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

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
  onDeletePlan
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    tipoAnimal: 'pollo' as const,
    razaId: '',
    descripcion: '',
    fases: [] as FaseNutricional[],
    activo: true
  });

  const [faseActual, setFaseActual] = useState({
    nombre: '',
    diaInicio: '',
    diaFin: '',
    consumoDiario: '',
    unidadMedida: 'kg',
    tipoAlimento: '',
    proteina: '',
    energia: ''
  });

  const agregarFase = () => {
    if (!faseActual.nombre || !faseActual.diaInicio || !faseActual.diaFin) {
      toast({
        title: "Error",
        description: "Complete todos los campos de la fase",
        variant: "destructive"
      });
      return;
    }

    const nuevaFase = {
      ...faseActual,
      id: Date.now(),
      diaInicio: parseInt(faseActual.diaInicio),
      diaFin: parseInt(faseActual.diaFin),
      consumoDiario: parseFloat(faseActual.consumoDiario),
      proteina: parseFloat(faseActual.proteina),
      energia: parseFloat(faseActual.energia)
    } as FaseNutricional;

    setFormData(prev => ({
      ...prev,
      fases: [...prev.fases, nuevaFase]
    }));

    // Limpiar el formulario de fase
    setFaseActual({
      nombre: '',
      diaInicio: '',
      diaFin: '',
      consumoDiario: '',
      unidadMedida: 'kg',
      tipoAlimento: '',
      proteina: '',
      energia: ''
    });

    toast({
      title: "Fase agregada",
      description: "La fase ha sido agregada al plan"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.fases.length === 0) {
      toast({
        title: "Error",
        description: "Debe agregar al menos una fase al plan nutricional",
        variant: "destructive"
      });
      return;
    }
    
    const planData = {
      ...formData,
      razaId: formData.razaId ? parseInt(formData.razaId) : undefined
    };

    onAddPlan(planData);
    setIsOpen(false);
    setFormData({
      nombre: '',
      tipoAnimal: 'pollo',
      razaId: '',
      descripcion: '',
      fases: [],
      activo: true
    });
    
    toast({
      title: "Plan creado",
      description: "El plan nutricional ha sido creado exitosamente"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Planes Nutricionales</h2>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Plan
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Datos básicos del plan */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre del Plan</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tipoAnimal">Tipo de Animal</Label>
                <select
                  id="tipoAnimal"
                  value={formData.tipoAnimal}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    tipoAnimal: e.target.value as 'pollo' | 'cerdo',
                    razaId: ''
                  }))}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="pollo">Pollo</option>
                  <option value="cerdo">Cerdo</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                className="w-full border rounded-md p-2 min-h-[100px]"
                required
              />
            </div>

            {/* Sección de fases */}
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4">Agregar Fase</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="nombreFase">Nombre de la Fase</Label>
                  <Input
                    id="nombreFase"
                    value={faseActual.nombre}
                    onChange={(e) => setFaseActual(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej: Iniciador"
                  />
                </div>
                <div>
                  <Label htmlFor="tipoAlimento">Tipo de Alimento</Label>
                  <Input
                    id="tipoAlimento"
                    value={faseActual.tipoAlimento}
                    onChange={(e) => setFaseActual(prev => ({ ...prev, tipoAlimento: e.target.value }))}
                    placeholder="Ej: Concentrado Iniciador"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="diaInicio">Día Inicio</Label>
                  <Input
                    id="diaInicio"
                    type="number"
                    value={faseActual.diaInicio}
                    onChange={(e) => setFaseActual(prev => ({ ...prev, diaInicio: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="diaFin">Día Fin</Label>
                  <Input
                    id="diaFin"
                    type="number"
                    value={faseActual.diaFin}
                    onChange={(e) => setFaseActual(prev => ({ ...prev, diaFin: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="consumoDiario">Consumo Diario (kg)</Label>
                  <Input
                    id="consumoDiario"
                    type="number"
                    step="0.01"
                    value={faseActual.consumoDiario}
                    onChange={(e) => setFaseActual(prev => ({ ...prev, consumoDiario: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="proteina">Proteína (%)</Label>
                  <Input
                    id="proteina"
                    type="number"
                    step="0.1"
                    value={faseActual.proteina}
                    onChange={(e) => setFaseActual(prev => ({ ...prev, proteina: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="energia">Energía (kcal/kg)</Label>
                  <Input
                    id="energia"
                    type="number"
                    value={faseActual.energia}
                    onChange={(e) => setFaseActual(prev => ({ ...prev, energia: e.target.value }))}
                  />
                </div>
              </div>

              <Button 
                type="button"
                onClick={agregarFase}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Fase
              </Button>

              {/* Lista de fases agregadas */}
              {formData.fases.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Fases del Plan:</h4>
                  {formData.fases.map((fase) => (
                    <div
                      key={fase.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                    >
                      <div>
                        <span className="font-medium">{fase.nombre}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          (Día {fase.diaInicio} - {fase.diaFin})
                        </span>
                        <div className="text-sm text-gray-600">
                          Consumo: {fase.consumoDiario} {fase.unidadMedida}/día
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            fases: prev.fases.filter(f => f.id !== fase.id)
                          }));
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full">
              Crear Plan Nutricional
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lista de planes existentes */}
      <div className="grid grid-cols-1 gap-4">
        {planes.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">{plan.nombre}</h3>
                <p className="text-sm text-gray-500">
                  {plan.tipoAnimal === 'pollo' ? '🐔' : '🐷'} 
                  {plan.razaId ? ` - ${razas.find(r => r.id === plan.razaId)?.nombre}` : ' - Todas las razas'}
                </p>
                <p className="mt-2 text-gray-600">{plan.descripcion}</p>
                {plan.fases.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <h4 className="text-sm font-medium">Fases:</h4>
                    {plan.fases.map((fase) => (
                      <div key={fase.id} className="text-sm text-gray-600 pl-2">
                        • {fase.nombre} (Día {fase.diaInicio} - {fase.diaFin})
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
        ))}
      </div>
    </div>
  );
};

export default PlanNutricionalComponent; 