'use client';

import { FC, useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import VacunaConfig from './VacunaConfig';
import PlanNutricionalComponent from './PlanNutricional';
import ParametrosCrecimiento from './ParametrosCrecimiento';
import { api } from '@/app/lib/api';
import { toast } from "@/app/components/ui/use-toast";
import { Vacuna, PlanVacunacion, PlanNutricional as IPlanNutricional, Raza } from '../types/configuracion';

const ConfiguracionTabs: FC = () => {
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [planesVacunacion, setPlanesVacunacion] = useState<PlanVacunacion[]>([]);
  const [planesNutricionales, setPlanesNutricionales] = useState<IPlanNutricional[]>([]);
  const [razas, setRazas] = useState<Raza[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [vacunasData, planesVacData, planesNutData, razasData] = await Promise.all([
        api.get('/api/vacunas'),
        api.get('/api/planes-vacunacion'),
        api.get('/api/planes-nutricionales'),
        api.get('/api/razas')
      ]);

      setVacunas(vacunasData);
      setPlanesVacunacion(planesVacData);
      setPlanesNutricionales(planesNutData);
      setRazas(razasData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de configuración",
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs defaultValue="vacunas" className="space-y-4">
      <TabsList>
        <TabsTrigger value="vacunas">Vacunas</TabsTrigger>
        <TabsTrigger value="nutricion">Planes Nutricionales</TabsTrigger>
        <TabsTrigger value="crecimiento">Parámetros de Crecimiento</TabsTrigger>
      </TabsList>

      <TabsContent value="vacunas">
        <VacunaConfig
          vacunas={vacunas}
          planesVacunacion={planesVacunacion}
          razas={razas}
          onAddVacuna={async (vacuna) => {
            try {
              const response = await api.post('/api/vacunas', vacuna);
              setVacunas([...vacunas, response]);
              toast({
                title: "Éxito",
                description: "Vacuna agregada correctamente",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "No se pudo agregar la vacuna",
                variant: "destructive",
              });
            }
          }}
          onUpdateVacuna={async (id, vacuna) => {
            try {
              const response = await api.put(`/api/vacunas/${id}`, vacuna);
              setVacunas(vacunas.map(v => v.id === id ? response : v));
              toast({
                title: "Éxito",
                description: "Vacuna actualizada correctamente",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "No se pudo actualizar la vacuna",
                variant: "destructive",
              });
            }
          }}
          onDeleteVacuna={async (id) => {
            try {
              await api.delete(`/api/vacunas/${id}`);
              setVacunas(vacunas.filter(v => v.id !== id));
              toast({
                title: "Éxito",
                description: "Vacuna eliminada correctamente",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "No se pudo eliminar la vacuna",
                variant: "destructive",
              });
            }
          }}
        />
      </TabsContent>

      <TabsContent value="nutricion">
        <PlanNutricionalComponent
          planes={planesNutricionales}
          razas={razas}
          onAddPlan={async (plan) => {
            try {
              const response = await api.post('/api/planes-nutricionales', plan);
              setPlanesNutricionales([...planesNutricionales, response]);
              toast({
                title: "Éxito",
                description: "Plan nutricional agregado correctamente",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "No se pudo agregar el plan nutricional",
                variant: "destructive",
              });
            }
          }}
          onUpdatePlan={async (id, plan) => {
            try {
              const response = await api.put(`/api/planes-nutricionales/${id}`, plan);
              setPlanesNutricionales(planes => 
                planes.map(p => p.id === id ? response : p)
              );
              toast({
                title: "Éxito",
                description: "Plan nutricional actualizado correctamente",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "No se pudo actualizar el plan nutricional",
                variant: "destructive",
              });
            }
          }}
          onDeletePlan={async (id) => {
            try {
              await api.delete(`/api/planes-nutricionales/${id}`);
              setPlanesNutricionales(planes => 
                planes.filter(p => p.id !== id)
              );
              toast({
                title: "Éxito",
                description: "Plan nutricional eliminado correctamente",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "No se pudo eliminar el plan nutricional",
                variant: "destructive",
              });
            }
          }}
        />
      </TabsContent>

      <TabsContent value="crecimiento">
        <ParametrosCrecimiento razas={razas} />
      </TabsContent>
    </Tabs>
  );
};

export default ConfiguracionTabs; 