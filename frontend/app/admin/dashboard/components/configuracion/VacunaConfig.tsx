'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { toast } from "@/app/components/ui/use-toast";
import { api } from '@/app/lib/api';
import { Vacuna, PlanVacunacion } from '../../types/vacunacion';
import { Producto } from '../../types/inventario';
import { Raza } from '../types/configuracion';
import VacunaForm from './VacunaForm';
import PlanVacunacionForm from './PlanVacunacionForm';

interface VacunaConfigProps {
  razas: Raza[];
}

const VacunaConfig: FC<VacunaConfigProps> = ({ razas }) => {
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [planes, setPlanes] = useState<PlanVacunacion[]>([]);
  const [medicinas, setMedicinas] = useState<Producto[]>([]);
  const [isVacunaDialogOpen, setIsVacunaDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [editingVacuna, setEditingVacuna] = useState<Vacuna | null>(null);
  const [editingPlan, setEditingPlan] = useState<PlanVacunacion | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Solo agregamos estos logs
      console.log('Intentando cargar medicinas...');
      const medicinasResponse = await api.get('/api/inventario/productos/medicinas');
      console.log('Medicinas recibidas:', medicinasResponse);
      
      if (medicinasResponse && medicinasResponse.length > 0) {
        setMedicinas(medicinasResponse);
      } else {
        console.log('No se encontraron medicinas');
        toast({
          title: "Advertencia",
          description: "No hay medicinas registradas en el inventario",
          variant: "warning",
        });
      }

      // Luego cargamos el resto de los datos
      const [vacunasResponse, planesResponse] = await Promise.all([
        api.get('/api/vacunacion/vacunas'),
        api.get('/api/vacunacion/planes')
      ]);

      setVacunas(vacunasResponse || []);
      setPlanes(planesResponse || []);

    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast({
        title: "Error",
        description: "Error al cargar las medicinas",
        variant: "destructive",
      });
    }
  };

  const handleVacunaSubmit = async (data: Partial<Vacuna>) => {
    try {
      if (editingVacuna) {
        await api.put(`/api/vacunacion/vacunas/${editingVacuna.id}`, data);
        toast({
          title: "Éxito",
          description: "Vacuna actualizada correctamente",
        });
      } else {
        await api.post('/api/vacunacion/vacunas', data);
        toast({
          title: "Éxito",
          description: "Vacuna creada correctamente",
        });
      }
      cargarDatos();
      setIsVacunaDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al procesar la vacuna",
        variant: "destructive",
      });
    }
  };

  const handlePlanSubmit = async (data: Partial<PlanVacunacion>) => {
    try {
      if (editingPlan) {
        await api.put(`/api/vacunacion/planes/${editingPlan.id}`, data);
        toast({
          title: "Éxito",
          description: "Plan actualizado correctamente",
        });
      } else {
        await api.post('/api/vacunacion/planes', data);
        toast({
          title: "Éxito",
          description: "Plan creado correctamente",
        });
      }
      cargarDatos();
      setIsPlanDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al procesar el plan",
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs defaultValue="vacunas" className="space-y-6">
      <TabsList>
        <TabsTrigger value="vacunas">Vacunas</TabsTrigger>
        <TabsTrigger value="planes">Planes de Vacunación</TabsTrigger>
      </TabsList>

      <TabsContent value="vacunas">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Vacunas Registradas</h3>
            <Dialog open={isVacunaDialogOpen} onOpenChange={setIsVacunaDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingVacuna(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Nueva Vacuna
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]" aria-describedby="vacuna-form-description">
                <DialogHeader>
                  <DialogTitle>
                    {editingVacuna ? 'Editar Vacuna' : 'Nueva Vacuna'}
                  </DialogTitle>
                  <p id="vacuna-form-description" className="text-sm text-muted-foreground">
                    {editingVacuna 
                      ? 'Modifique los detalles de la vacuna existente' 
                      : 'Complete el formulario para registrar una nueva vacuna'}
                  </p>
                </DialogHeader>
                <VacunaForm
                  onSubmit={handleVacunaSubmit}
                  initialData={editingVacuna}
                  medicinas={medicinas}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacunas.map((vacuna) => (
              <div key={vacuna.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{vacuna.nombre}</h4>
                    <p className="text-sm text-muted-foreground">
                      {vacuna.producto_nombre}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingVacuna(vacuna);
                        setIsVacunaDialogOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="planes">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Planes de Vacunación</h3>
            <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingPlan(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Plan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingPlan ? 'Editar Plan' : 'Nuevo Plan'}
                  </DialogTitle>
                </DialogHeader>
                <PlanVacunacionForm
                  onSubmit={handlePlanSubmit}
                  initialData={editingPlan}
                  razas={razas}
                  vacunas={vacunas}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planes.map((plan) => (
              <div key={plan.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{plan.nombre}</h4>
                    <p className="text-sm text-muted-foreground">
                      {plan.raza_nombre}
                    </p>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default VacunaConfig; 