'use client';

import { FC } from 'react';
import VacunaConfig from './VacunaConfig';
import PlanNutricionalComponent from './PlanNutricional';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Vacuna, PlanVacunacion, PlanNutricional, Raza } from '../types/configuracion';

interface ConfiguracionTabsProps {
  // Props de VacunaConfig
  vacunas: Vacuna[];
  planesVacunacion: PlanVacunacion[];
  razas: Raza[];
  onAddVacuna: (vacuna: Partial<Vacuna>) => void;
  onUpdateVacuna: (id: number, vacuna: Partial<Vacuna>) => void;
  onDeleteVacuna: (id: number) => void;
  onAddPlanVacunacion: (plan: Partial<PlanVacunacion>) => void;
  onUpdatePlanVacunacion: (id: number, plan: Partial<PlanVacunacion>) => void;
  onDeletePlanVacunacion: (id: number) => void;
  
  // Props de PlanNutricional
  planesNutricionales: PlanNutricional[];
  onAddPlanNutricional: (plan: Partial<PlanNutricional>) => void;
  onUpdatePlanNutricional: (id: number, plan: Partial<PlanNutricional>) => void;
  onDeletePlanNutricional: (id: number) => void;
}

const ConfiguracionTabs: FC<ConfiguracionTabsProps> = (props) => {
  return (
    <Tabs defaultValue="vacunas">
      <TabsList className="mb-4">
        <TabsTrigger value="vacunas">Vacunas</TabsTrigger>
        <TabsTrigger value="nutricion">Planes Nutricionales</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vacunas">
        <VacunaConfig
          vacunas={props.vacunas}
          planesVacunacion={props.planesVacunacion}
          razas={props.razas}
          onAddVacuna={props.onAddVacuna}
          onUpdateVacuna={props.onUpdateVacuna}
          onDeleteVacuna={props.onDeleteVacuna}
          onAddPlan={props.onAddPlanVacunacion}
          onUpdatePlan={props.onUpdatePlanVacunacion}
          onDeletePlan={props.onDeletePlanVacunacion}
        />
      </TabsContent>
      
      <TabsContent value="nutricion">
        <PlanNutricionalComponent
          planes={props.planesNutricionales}
          razas={props.razas}
          onAddPlan={props.onAddPlanNutricional}
          onUpdatePlan={props.onUpdatePlanNutricional}
          onDeletePlan={props.onDeletePlanNutricional}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ConfiguracionTabs; 