'use client';

import { useState } from 'react';
import { useTheme } from "next-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface EtapaNutricional {
  id: number;
  nombreEtapa: string;
  diasInicio: number;
  diasFin: number;
  consumoDiario: number;
  proteina: number;
  energia: number;
  pesoObjetivo: number;
  descripcionAlimento: string;
  tipoAnimal: 'pollo' | 'cerdo';
}

const etapasIniciales: EtapaNutricional[] = [
  {
    id: 1,
    nombreEtapa: "Pre-iniciación",
    diasInicio: 1,
    diasFin: 7,
    consumoDiario: 15,
    proteina: 22.5,
    energia: 2950,
    pesoObjetivo: 0.19,
    descripcionAlimento: "Preiniciador Premium",
    tipoAnimal: "pollo"
  }
];

export default function PlanNutricionalPage() {
  const { theme } = useTheme();
  const [etapas, setEtapas] = useState<EtapaNutricional[]>(etapasIniciales);
  const [animalSeleccionado, setAnimalSeleccionado] = useState<'pollo' | 'cerdo'>('pollo');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nuevaEtapa, setNuevaEtapa] = useState<Partial<EtapaNutricional>>({
    nombreEtapa: '',
    diasInicio: 1,
    diasFin: 1,
    consumoDiario: 0,
    proteina: 0,
    energia: 0,
    pesoObjetivo: 0,
    descripcionAlimento: '',
    tipoAnimal: 'pollo'
  });

  const handleCrearEtapa = () => {
    if (!nuevaEtapa.nombreEtapa || !nuevaEtapa.descripcionAlimento) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const nuevaEtapaCompleta: EtapaNutricional = {
      id: etapas.length + 1,
      ...nuevaEtapa as EtapaNutricional
    };

    setEtapas([...etapas, nuevaEtapaCompleta]);
    setIsDialogOpen(false);
    setNuevaEtapa({
      nombreEtapa: '',
      diasInicio: 1,
      diasFin: 1,
      consumoDiario: 0,
      proteina: 0,
      energia: 0,
      pesoObjetivo: 0,
      descripcionAlimento: '',
      tipoAnimal: animalSeleccionado
    });
  };

  const handleTabChange = (value: string) => {
    setAnimalSeleccionado(value as 'pollo' | 'cerdo');
    setNuevaEtapa(prev => ({
      ...prev,
      tipoAnimal: value as 'pollo' | 'cerdo'
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Plan Nutricional</h2>
      
      <Tabs defaultValue="pollo" className="space-y-4" onValueChange={handleTabChange}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="pollo">Pollos</TabsTrigger>
            <TabsTrigger value="cerdo">Cerdos</TabsTrigger>
          </TabsList>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva Etapa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Crear Nueva Etapa Nutricional</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombreEtapa" className="text-right">
                    Nombre Etapa
                  </Label>
                  <Input
                    id="nombreEtapa"
                    className="col-span-3"
                    value={nuevaEtapa.nombreEtapa}
                    onChange={(e) => setNuevaEtapa({...nuevaEtapa, nombreEtapa: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="diasInicio" className="text-right">
                    Día Inicio
                  </Label>
                  <Input
                    id="diasInicio"
                    type="number"
                    className="col-span-3"
                    value={nuevaEtapa.diasInicio}
                    onChange={(e) => setNuevaEtapa({...nuevaEtapa, diasInicio: Number(e.target.value)})}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="diasFin" className="text-right">
                    Día Fin
                  </Label>
                  <Input
                    id="diasFin"
                    type="number"
                    className="col-span-3"
                    value={nuevaEtapa.diasFin}
                    onChange={(e) => setNuevaEtapa({...nuevaEtapa, diasFin: Number(e.target.value)})}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="consumoDiario" className="text-right">
                    Consumo Diario (g)
                  </Label>
                  <Input
                    id="consumoDiario"
                    type="number"
                    className="col-span-3"
                    value={nuevaEtapa.consumoDiario}
                    onChange={(e) => setNuevaEtapa({...nuevaEtapa, consumoDiario: Number(e.target.value)})}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="proteina" className="text-right">
                    Proteína (%)
                  </Label>
                  <Input
                    id="proteina"
                    type="number"
                    className="col-span-3"
                    value={nuevaEtapa.proteina}
                    onChange={(e) => setNuevaEtapa({...nuevaEtapa, proteina: Number(e.target.value)})}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="energia" className="text-right">
                    Energía (Kcal)
                  </Label>
                  <Input
                    id="energia"
                    type="number"
                    className="col-span-3"
                    value={nuevaEtapa.energia}
                    onChange={(e) => setNuevaEtapa({...nuevaEtapa, energia: Number(e.target.value)})}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pesoObjetivo" className="text-right">
                    Peso Objetivo (kg)
                  </Label>
                  <Input
                    id="pesoObjetivo"
                    type="number"
                    className="col-span-3"
                    value={nuevaEtapa.pesoObjetivo}
                    onChange={(e) => setNuevaEtapa({...nuevaEtapa, pesoObjetivo: Number(e.target.value)})}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="descripcionAlimento" className="text-right">
                    Descripción del Alimento
                  </Label>
                  <Input
                    id="descripcionAlimento"
                    className="col-span-3"
                    value={nuevaEtapa.descripcionAlimento}
                    onChange={(e) => setNuevaEtapa({...nuevaEtapa, descripcionAlimento: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tipoAnimal" className="text-right">
                    Tipo de Animal
                  </Label>
                  <Select
                    value={nuevaEtapa.tipoAnimal}
                    onValueChange={(value: 'pollo' | 'cerdo') => 
                      setNuevaEtapa({...nuevaEtapa, tipoAnimal: value})
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pollo">Pollo</SelectItem>
                      <SelectItem value="cerdo">Cerdo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCrearEtapa}>
                    Guardar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="pollo">
          <Card>
            <CardHeader>
              <CardTitle>Plan Nutricional para Pollos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Días</TableHead>
                    <TableHead>Consumo Diario (g)</TableHead>
                    <TableHead>Proteína (%)</TableHead>
                    <TableHead>Energía (Kcal)</TableHead>
                    <TableHead>Peso Objetivo (kg)</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {etapas
                    .filter(etapa => etapa.tipoAnimal === 'pollo')
                    .map((etapa) => (
                      <TableRow key={etapa.id}>
                        <TableCell>{etapa.nombreEtapa}</TableCell>
                        <TableCell>{etapa.diasInicio}-{etapa.diasFin}</TableCell>
                        <TableCell>{etapa.consumoDiario}</TableCell>
                        <TableCell>{etapa.proteina}%</TableCell>
                        <TableCell>{etapa.energia}</TableCell>
                        <TableCell>{etapa.pesoObjetivo}</TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cerdo">
          <Card>
            <CardHeader>
              <CardTitle>Plan Nutricional para Cerdos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Días</TableHead>
                    <TableHead>Consumo Diario (g)</TableHead>
                    <TableHead>Proteína (%)</TableHead>
                    <TableHead>Energía (Kcal)</TableHead>
                    <TableHead>Peso Objetivo (kg)</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {etapas
                    .filter(etapa => etapa.tipoAnimal === 'cerdo')
                    .map((etapa) => (
                      <TableRow key={etapa.id}>
                        <TableCell>{etapa.nombreEtapa}</TableCell>
                        <TableCell>{etapa.diasInicio}-{etapa.diasFin}</TableCell>
                        <TableCell>{etapa.consumoDiario}</TableCell>
                        <TableCell>{etapa.proteina}%</TableCell>
                        <TableCell>{etapa.energia}</TableCell>
                        <TableCell>{etapa.pesoObjetivo}</TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 