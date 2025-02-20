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

interface PlanAlimentacion {
  id: number;
  nombreEtapa: string;
  diasInicio: number;
  diasFin: number;
  consumoDiario: number;
  energia: number;
  pesoObjetivo: number;
  tipoAlimento: 'Polvo' | 'Granulado' | 'Peletizado';
  descripcionAlimento: string;
  tipoAnimal: 'pollo' | 'cerdo';
}

const alimentacionInicial: PlanAlimentacion[] = [
  {
    id: 1,
    nombreEtapa: "Iniciador",
    diasInicio: 1,
    diasFin: 14,
    consumoDiario: 15,
    energia: 2950,
    pesoObjetivo: 0.19,
    tipoAlimento: "Polvo",
    descripcionAlimento: "Alimento iniciador con alto contenido proteico",
    tipoAnimal: "pollo"
  }
];

export default function PlanNutricionalPage() {
  const { theme } = useTheme();
  const [alimentacion, setAlimentacion] = useState<PlanAlimentacion[]>(alimentacionInicial);
  const [animalSeleccionado, setAnimalSeleccionado] = useState<'pollo' | 'cerdo'>('pollo');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [etapaParaEditar, setEtapaParaEditar] = useState<PlanAlimentacion | null>(null);
  const [nuevaEtapa, setNuevaEtapa] = useState<Partial<PlanAlimentacion>>({
    nombreEtapa: '',
    diasInicio: 1,
    diasFin: 1,
    consumoDiario: 0,
    energia: 0,
    pesoObjetivo: 0,
    descripcionAlimento: '',
    tipoAlimento: 'Polvo',
    tipoAnimal: animalSeleccionado
  });

  const handleEliminarEtapa = (id: number) => {
    if (confirm('¿Está seguro que desea eliminar esta etapa?')) {
      setAlimentacion(prev => prev.filter(etapa => etapa.id !== id));
    }
  };

  const handleIniciarEdicion = (etapa: PlanAlimentacion) => {
    setEtapaParaEditar(etapa);
    setNuevaEtapa(etapa);
    setIsDialogOpen(true);
  };

  const handleCrearOActualizarEtapa = () => {
    if (!nuevaEtapa.nombreEtapa) {
      alert('Por favor complete el nombre de la etapa');
      return;
    }

    const etapaActualizada: PlanAlimentacion = {
      id: etapaParaEditar?.id || alimentacion.length + 1,
      nombreEtapa: nuevaEtapa.nombreEtapa,
      diasInicio: Number(nuevaEtapa.diasInicio) || 1,
      diasFin: Number(nuevaEtapa.diasFin) || 1,
      consumoDiario: Number(nuevaEtapa.consumoDiario) || 0,
      energia: Number(nuevaEtapa.energia) || 0,
      pesoObjetivo: Number(nuevaEtapa.pesoObjetivo) || 0,
      tipoAlimento: nuevaEtapa.tipoAlimento || 'Polvo',
      descripcionAlimento: nuevaEtapa.descripcionAlimento || '',
      tipoAnimal: nuevaEtapa.tipoAnimal || animalSeleccionado
    };

    if (etapaParaEditar) {
      setAlimentacion(prev => prev.map(etapa => 
        etapa.id === etapaParaEditar.id ? etapaActualizada : etapa
      ));
    } else {
      setAlimentacion(prev => [...prev, etapaActualizada]);
    }

    setIsDialogOpen(false);
    setEtapaParaEditar(null);
    setNuevaEtapa({
      nombreEtapa: '',
      diasInicio: 1,
      diasFin: 1,
      consumoDiario: 0,
      energia: 0,
      pesoObjetivo: 0,
      descripcionAlimento: '',
      tipoAlimento: 'Polvo',
      tipoAnimal: animalSeleccionado
    });
  };

  const handleTabChange = (value: string) => {
    setAnimalSeleccionado(value as 'pollo' | 'cerdo');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Plan de Alimentación</h2>
      
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
            <DialogContent className="sm:max-w-[725px]">
              <DialogHeader>
                <DialogTitle>
                  {etapaParaEditar ? 'Editar Etapa de Alimentación' : 'Nueva Etapa de Alimentación'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
                      <SelectValue placeholder="Seleccione tipo de animal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pollo">Pollos</SelectItem>
                      <SelectItem value="cerdo">Cerdos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombreEtapa" className="text-right">
                    Nombre Etapa
                  </Label>
                  <Input
                    id="nombreEtapa"
                    className="col-span-3"
                    value={nuevaEtapa.nombreEtapa}
                    onChange={(e) => setNuevaEtapa({...nuevaEtapa, nombreEtapa: e.target.value})}
                    placeholder="Ej: Iniciador, Crecimiento, etc."
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tipoAlimento" className="text-right">
                    Tipo de Alimento
                  </Label>
                  <Select
                    value={nuevaEtapa.tipoAlimento}
                    onValueChange={(value: 'Polvo' | 'Granulado' | 'Peletizado') => 
                      setNuevaEtapa({...nuevaEtapa, tipoAlimento: value})
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione tipo de alimento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Polvo">Polvo</SelectItem>
                      <SelectItem value="Granulado">Granulado</SelectItem>
                      <SelectItem value="Peletizado">Peletizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="diasInicio" className="text-right">
                    Día Inicio
                  </Label>
                  <Input
                    id="diasInicio"
                    type="number"
                    min="1"
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
                    min="1"
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
                    min="0"
                    step="0.1"
                    className="col-span-3"
                    value={nuevaEtapa.consumoDiario}
                    onChange={(e) => setNuevaEtapa({...nuevaEtapa, consumoDiario: Number(e.target.value)})}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pesoObjetivo" className="text-right">
                    Peso Objetivo (kg)
                  </Label>
                  <Input
                    id="pesoObjetivo"
                    type="number"
                    min="0"
                    step="0.01"
                    className="col-span-3"
                    value={nuevaEtapa.pesoObjetivo}
                    onChange={(e) => setNuevaEtapa({...nuevaEtapa, pesoObjetivo: Number(e.target.value)})}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    setEtapaParaEditar(null);
                  }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCrearOActualizarEtapa} className="bg-green-600 hover:bg-green-700">
                    {etapaParaEditar ? 'Actualizar' : 'Guardar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="pollo">
          <Card>
            <CardHeader>
              <CardTitle>Plan de Alimentación para Pollos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Días</TableHead>
                    <TableHead>Tipo Alimento</TableHead>
                    <TableHead>Consumo Diario (g)</TableHead>
                    <TableHead>Peso Objetivo (kg)</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alimentacion
                    .filter(etapa => etapa.tipoAnimal === 'pollo')
                    .map((etapa) => (
                      <TableRow key={etapa.id}>
                        <TableCell>{etapa.nombreEtapa}</TableCell>
                        <TableCell>{etapa.diasInicio}-{etapa.diasFin}</TableCell>
                        <TableCell>{etapa.tipoAlimento}</TableCell>
                        <TableCell>{etapa.consumoDiario}</TableCell>
                        <TableCell>{etapa.pesoObjetivo}</TableCell>
                        <TableCell className="space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleIniciarEdicion(etapa)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => handleEliminarEtapa(etapa.id)}
                          >
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
                    <TableHead>Energía (Kcal)</TableHead>
                    <TableHead>Peso Objetivo (kg)</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alimentacion
                    .filter(etapa => etapa.tipoAnimal === 'cerdo')
                    .map((etapa) => (
                      <TableRow key={etapa.id}>
                        <TableCell>{etapa.nombreEtapa}</TableCell>
                        <TableCell>{etapa.diasInicio}-{etapa.diasFin}</TableCell>
                        <TableCell>{etapa.consumoDiario}</TableCell>
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