'use client';

import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Vacuna, PlanVacunacion, Raza } from '../types/configuracion';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface VacunaConfigProps {
  vacunas: Vacuna[];
  planesVacunacion: PlanVacunacion[];
  razas: Raza[];
  onAddVacuna: (vacuna: Partial<Vacuna>) => void;
  onUpdateVacuna: (id: number, vacuna: Partial<Vacuna>) => void;
  onDeleteVacuna: (id: number) => void;
  onAddPlan: (plan: Partial<PlanVacunacion>) => void;
  onUpdatePlan: (id: number, plan: Partial<PlanVacunacion>) => void;
  onDeletePlan: (id: number) => void;
}

const VacunaForm: FC<{ onSubmit: (data: Partial<Vacuna>) => void; initialData?: Vacuna }> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    tipoAnimal: initialData?.tipoAnimal || 'pollo',
    edad: initialData?.edad?.toString() || '',
    dosis: initialData?.dosis?.toString() || '',
    unidadDosis: initialData?.unidadDosis || '',
    intervalo: initialData?.intervalo?.toString() || '',
    descripcion: initialData?.descripcion || '',
    obligatoria: initialData?.obligatoria || false,
    efectosSecundarios: initialData?.efectosSecundarios || '',
    precauciones: initialData?.precauciones || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      edad: parseInt(formData.edad),
      dosis: parseFloat(formData.dosis),
      intervalo: formData.intervalo ? parseInt(formData.intervalo) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? 'Editar Vacuna' : 'Agregar Nueva Vacuna'}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre de la Vacuna</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="tipoAnimal">Tipo de Animal</Label>
          <select
            id="tipoAnimal"
            value={formData.tipoAnimal}
            onChange={(e) => setFormData({ ...formData, tipoAnimal: e.target.value as 'pollo' | 'cerdo' })}
            className="w-full border rounded-md p-2"
            required
          >
            <option value="pollo">Pollo</option>
            <option value="cerdo">Cerdo</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="edad">Edad de Aplicación (días)</Label>
          <Input
            id="edad"
            type="number"
            value={formData.edad}
            onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="dosis">Dosis</Label>
          <Input
            id="dosis"
            type="number"
            step="0.01"
            value={formData.dosis}
            onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="unidadDosis">Unidad</Label>
          <Input
            id="unidadDosis"
            value={formData.unidadDosis}
            onChange={(e) => setFormData({ ...formData, unidadDosis: e.target.value })}
            placeholder="ml, cc, etc."
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="intervalo">Intervalo para Refuerzo (días)</Label>
        <Input
          id="intervalo"
          type="number"
          value={formData.intervalo}
          onChange={(e) => setFormData({ ...formData, intervalo: e.target.value })}
          placeholder="Opcional"
        />
      </div>

      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          className="w-full border rounded-md p-2 min-h-[100px]"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="obligatoria"
          checked={formData.obligatoria}
          onChange={(e) => setFormData({ ...formData, obligatoria: e.target.checked })}
          className="rounded border-gray-300"
        />
        <Label htmlFor="obligatoria">Vacuna Obligatoria</Label>
      </div>

      <div>
        <Label htmlFor="efectosSecundarios">Efectos Secundarios</Label>
        <textarea
          id="efectosSecundarios"
          value={formData.efectosSecundarios}
          onChange={(e) => setFormData({ ...formData, efectosSecundarios: e.target.value })}
          className="w-full border rounded-md p-2"
          placeholder="Opcional"
        />
      </div>

      <div>
        <Label htmlFor="precauciones">Precauciones</Label>
        <textarea
          id="precauciones"
          value={formData.precauciones}
          onChange={(e) => setFormData({ ...formData, precauciones: e.target.value })}
          className="w-full border rounded-md p-2"
          placeholder="Opcional"
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Actualizar Vacuna' : 'Agregar Vacuna'}
      </Button>
    </form>
  );
};

const PlanVacunacionForm: FC<{ 
  onSubmit: (data: Partial<PlanVacunacion>) => void;
  initialData?: PlanVacunacion;
  vacunas: Vacuna[];
  razas: Raza[];
}> = ({ onSubmit, initialData, vacunas, razas }) => {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    tipoAnimal: initialData?.tipoAnimal || 'pollo',
    razaId: initialData?.razaId?.toString() || '',
    vacunas: initialData?.vacunas || []
  });

  const [selectedVacuna, setSelectedVacuna] = useState('');
  const [diaAplicacion, setDiaAplicacion] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const handleAddVacuna = () => {
    if (selectedVacuna && diaAplicacion) {
      setFormData({
        ...formData,
        vacunas: [
          ...formData.vacunas,
          {
            vacunaId: parseInt(selectedVacuna),
            diaAplicacion: parseInt(diaAplicacion),
            observaciones
          }
        ]
      });
      setSelectedVacuna('');
      setDiaAplicacion('');
      setObservaciones('');
    }
  };

  const handleRemoveVacuna = (index: number) => {
    setFormData({
      ...formData,
      vacunas: formData.vacunas.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      razaId: formData.razaId ? parseInt(formData.razaId) : undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? 'Editar Plan de Vacunación' : 'Crear Plan de Vacunación'}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre del Plan</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="tipoAnimal">Tipo de Animal</Label>
          <select
            id="tipoAnimal"
            value={formData.tipoAnimal}
            onChange={(e) => setFormData({ ...formData, tipoAnimal: e.target.value as 'pollo' | 'cerdo' })}
            className="w-full border rounded-md p-2"
            required
          >
            <option value="pollo">Pollo</option>
            <option value="cerdo">Cerdo</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="razaId">Raza (Opcional)</Label>
        <select
          id="razaId"
          value={formData.razaId}
          onChange={(e) => setFormData({ ...formData, razaId: e.target.value })}
          className="w-full border rounded-md p-2"
        >
          <option value="">Todas las razas</option>
          {razas
            .filter(raza => raza.tipoAnimal === formData.tipoAnimal)
            .map(raza => (
              <option key={raza.id} value={raza.id}>
                {raza.nombre}
              </option>
            ))
          }
        </select>
      </div>

      <div className="border rounded-md p-4">
        <h4 className="font-medium mb-2">Agregar Vacunas al Plan</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="vacuna">Vacuna</Label>
            <select
              id="vacuna"
              value={selectedVacuna}
              onChange={(e) => setSelectedVacuna(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">Seleccionar vacuna</option>
              {vacunas
                .filter(v => v.tipoAnimal === formData.tipoAnimal)
                .map(vacuna => (
                  <option key={vacuna.id} value={vacuna.id}>
                    {vacuna.nombre}
                  </option>
                ))
              }
            </select>
          </div>

          <div>
            <Label htmlFor="diaAplicacion">Día de Aplicación</Label>
            <Input
              id="diaAplicacion"
              type="number"
              value={diaAplicacion}
              onChange={(e) => setDiaAplicacion(e.target.value)}
              placeholder="Día"
            />
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Input
              id="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Opcional"
            />
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={handleAddVacuna}
        >
          Agregar Vacuna al Plan
        </Button>

        <div className="mt-4 space-y-2">
          {formData.vacunas.map((v, index) => {
            const vacuna = vacunas.find(vac => vac.id === v.vacunaId);
            return (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span>
                  {vacuna?.nombre} - Día {v.diaAplicacion}
                  {v.observaciones && ` (${v.observaciones})`}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveVacuna(index)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Actualizar Plan' : 'Crear Plan'}
      </Button>
    </form>
  );
};

const VacunaConfig: FC<VacunaConfigProps> = ({
  vacunas,
  planesVacunacion,
  razas,
  onAddVacuna,
  onUpdateVacuna,
  onDeleteVacuna,
  onAddPlan,
  onUpdatePlan,
  onDeletePlan
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVacuna, setEditingVacuna] = useState<Vacuna | null>(null);

  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanVacunacion | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Configuración de Vacunas</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingVacuna(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Vacuna
            </Button>
          </DialogTrigger>
          <DialogContent>
            <VacunaForm 
              onSubmit={(data) => {
                if (editingVacuna) {
                  onUpdateVacuna(editingVacuna.id, data);
                } else {
                  onAddVacuna(data);
                }
                setIsDialogOpen(false);
              }}
              initialData={editingVacuna}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lista de Vacunas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Vacunas Registradas</h3>
          <div className="space-y-4">
            {vacunas.map((vacuna) => (
              <div 
                key={vacuna.id} 
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{vacuna.nombre}</h4>
                    <p className="text-sm text-gray-500">
                      {vacuna.tipoAnimal === 'pollo' ? '🐔' : '🐷'} 
                      Aplicar a los {vacuna.edad} días
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Dosis: {vacuna.dosis} {vacuna.unidadDosis}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingVacuna(vacuna);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteVacuna(vacuna.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Planes de Vacunación */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Planes de Vacunación</h3>
            <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    setEditingPlan(null);
                    setIsPlanDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <PlanVacunacionForm 
                  onSubmit={(data) => {
                    if (editingPlan) {
                      onUpdatePlan(editingPlan.id, data);
                    } else {
                      onAddPlan(data);
                    }
                    setIsPlanDialogOpen(false);
                  }}
                  initialData={editingPlan}
                  vacunas={vacunas}
                  razas={razas}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {planesVacunacion.map((plan) => (
              <div 
                key={plan.id} 
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{plan.nombre}</h4>
                    <p className="text-sm text-gray-500">
                      {plan.tipoAnimal === 'pollo' ? '🐔' : '🐷'} 
                      {plan.razaId ? ` - ${razas.find(r => r.id === plan.razaId)?.nombre}` : ' - Todas las razas'}
                    </p>
                    <div className="mt-2">
                      {plan.vacunas.map((v, index) => {
                        const vacuna = vacunas.find(vac => vac.id === v.vacunaId);
                        return (
                          <div key={index} className="text-sm text-gray-600">
                            • Día {v.diaAplicacion}: {vacuna?.nombre}
                            {v.observaciones && ` (${v.observaciones})`}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPlan(plan);
                        setIsPlanDialogOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeletePlan(plan.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacunaConfig; 