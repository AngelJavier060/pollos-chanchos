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

interface PlanMedicacion {
  id: number;
  nombreEtapa: string;
  diasInicio: number;
  diasFin: number;
  vacunas: string[];
  antibioticos?: string;
  vitaminas?: string;
  otros?: string;
  tipoAnimal: 'pollo' | 'cerdo';
}

const medicacionInicial: PlanMedicacion[] = [
  {
    id: 1,
    nombreEtapa: "Iniciación",
    diasInicio: 1,
    diasFin: 7,
    vacunas: ["Marek", "Newcastle", "Gumboro"],
    vitaminas: "Complejo vitamínico y electrolitos",
    otros: "Coccidiostatos preventivos",
    tipoAnimal: "pollo"
  },
  {
    id: 2,
    nombreEtapa: "Iniciación",
    diasInicio: 1,
    diasFin: 15,
    vacunas: ["Mycoplasma", "Circovirus"],
    vitaminas: "Complejo multivitamínico",
    antibioticos: "Según prescripción veterinaria",
    tipoAnimal: "cerdo"
  }
];

// Agregar estas constantes para las opciones predefinidas
const VACUNAS_POLLOS = ['Marek', 'Newcastle', 'Gumboro', 'Bronquitis'];
const VACUNAS_CERDOS = ['Mycoplasma', 'Circovirus', 'Fiebre Porcina', 'Aujeszky'];

const ANTIBIOTICOS_OPCIONES = [
  'Enrofloxacina',
  'Amoxicilina',
  'Oxitetraciclina',
  'Tilosina',
  'Otro'
];

const VITAMINAS_OPCIONES = [
  'Complejo B',
  'Vitamina A+D3+E',
  'Multivitamínico',
  'Electrolitos',
  'Otro'
];

const OTROS_OPCIONES = [
  'Coccidiostatos',
  'Desparasitante',
  'Probióticos',
  'Minerales',
  'Otro'
];

export default function PlanMedicacionPage() {
  const { theme } = useTheme();
  const [medicacion, setMedicacion] = useState<PlanMedicacion[]>(medicacionInicial);
  const [animalSeleccionado, setAnimalSeleccionado] = useState<'pollo' | 'cerdo'>('pollo');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nuevaMedicacion, setNuevaMedicacion] = useState<Partial<PlanMedicacion>>({
    nombreEtapa: '',
    diasInicio: 1,
    diasFin: 1,
    vacunas: [],
    tipoAnimal: 'pollo'
  });
  const [medicacionParaEditar, setMedicacionParaEditar] = useState<PlanMedicacion | null>(null);

  const handleCrearMedicacion = () => {
    if (!nuevaMedicacion.nombreEtapa) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const nuevaMedicacionCompleta: PlanMedicacion = {
      id: medicacion.length + 1,
      nombreEtapa: nuevaMedicacion.nombreEtapa || '',
      diasInicio: nuevaMedicacion.diasInicio || 1,
      diasFin: nuevaMedicacion.diasFin || 1,
      vacunas: nuevaMedicacion.vacunas || [],
      antibioticos: nuevaMedicacion.antibioticos,
      vitaminas: nuevaMedicacion.vitaminas,
      otros: nuevaMedicacion.otros,
      tipoAnimal: nuevaMedicacion.tipoAnimal || 'pollo'
    };

    setMedicacion([...medicacion, nuevaMedicacionCompleta]);
    setIsDialogOpen(false);
    setNuevaMedicacion({
      nombreEtapa: '',
      diasInicio: 1,
      diasFin: 1,
      vacunas: [],
      tipoAnimal: animalSeleccionado
    });
  };

  const handleTabChange = (value: string) => {
    setAnimalSeleccionado(value as 'pollo' | 'cerdo');
    setNuevaMedicacion(prev => ({
      ...prev,
      tipoAnimal: value as 'pollo' | 'cerdo'
    }));
  };

  const handleCrearOActualizarMedicacion = () => {
    if (!nuevaMedicacion.nombreEtapa) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    if (medicacionParaEditar) {
      // Actualizar la medicación existente
      const medicacionActualizada = medicacion.map(med =>
        med.id === medicacionParaEditar.id ? { ...medicacionParaEditar, ...nuevaMedicacion } : med
      );
      setMedicacion(medicacionActualizada);
    } else {
      // Crear una nueva medicación
      handleCrearMedicacion();
    }

    setIsDialogOpen(false);
    setMedicacionParaEditar(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Plan de Medicación</h2>
      
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
                Nueva Medicación
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
              <DialogHeader>
                <DialogTitle>
                  {medicacionParaEditar ? 'Editar Etapa de Medicación' : 'Nueva Etapa de Medicación'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tipoAnimal" className="text-right">
                    Tipo de Animal
                  </Label>
                  <Select
                    value={nuevaMedicacion.tipoAnimal}
                    onValueChange={(value: 'pollo' | 'cerdo') => {
                      setNuevaMedicacion({
                        ...nuevaMedicacion,
                        tipoAnimal: value,
                        // Resetear vacunas al cambiar el tipo de animal
                        vacunas: []
                      });
                    }}
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
                    value={nuevaMedicacion.nombreEtapa}
                    onChange={(e) => setNuevaMedicacion({...nuevaMedicacion, nombreEtapa: e.target.value})}
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
                    value={nuevaMedicacion.diasInicio}
                    onChange={(e) => setNuevaMedicacion({...nuevaMedicacion, diasInicio: Number(e.target.value)})}
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
                    value={nuevaMedicacion.diasFin}
                    onChange={(e) => setNuevaMedicacion({...nuevaMedicacion, diasFin: Number(e.target.value)})}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vacunas" className="text-right">
                    Vacunas
                  </Label>
                  <Select
                    value={nuevaMedicacion.vacunas[0] || ''}
                    onValueChange={(value: string) => {
                      setNuevaMedicacion({
                        ...nuevaMedicacion,
                        vacunas: [value]
                      });
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione vacunas" />
                    </SelectTrigger>
                    <SelectContent>
                      {(nuevaMedicacion.tipoAnimal === 'pollo' ? VACUNAS_POLLOS : VACUNAS_CERDOS).map(
                        (vacuna) => (
                          <SelectItem key={vacuna} value={vacuna}>
                            {vacuna}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="antibioticos" className="text-right">
                    Antibióticos
                  </Label>
                  <Select
                    value={nuevaMedicacion.antibioticos || ''}
                    onValueChange={(value: string) => {
                      setNuevaMedicacion({
                        ...nuevaMedicacion,
                        antibioticos: value
                      });
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione antibiótico" />
                    </SelectTrigger>
                    <SelectContent>
                      {ANTIBIOTICOS_OPCIONES.map((antibiotico) => (
                        <SelectItem key={antibiotico} value={antibiotico}>
                          {antibiotico}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vitaminas" className="text-right">
                    Vitaminas
                  </Label>
                  <Select
                    value={nuevaMedicacion.vitaminas || ''}
                    onValueChange={(value: string) => {
                      setNuevaMedicacion({
                        ...nuevaMedicacion,
                        vitaminas: value
                      });
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione vitaminas" />
                    </SelectTrigger>
                    <SelectContent>
                      {VITAMINAS_OPCIONES.map((vitamina) => (
                        <SelectItem key={vitamina} value={vitamina}>
                          {vitamina}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="otros" className="text-right">
                    Otros
                  </Label>
                  <Select
                    value={nuevaMedicacion.otros || ''}
                    onValueChange={(value: string) => {
                      setNuevaMedicacion({
                        ...nuevaMedicacion,
                        otros: value
                      });
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione otros tratamientos" />
                    </SelectTrigger>
                    <SelectContent>
                      {OTROS_OPCIONES.map((otro) => (
                        <SelectItem key={otro} value={otro}>
                          {otro}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    setMedicacionParaEditar(null);
                  }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCrearOActualizarMedicacion} className="bg-green-600 hover:bg-green-700">
                    {medicacionParaEditar ? 'Actualizar' : 'Guardar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="pollo">
          <Card>
            <CardHeader>
              <CardTitle>Plan de Medicación para Pollos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Días</TableHead>
                    <TableHead>Vacunas</TableHead>
                    <TableHead>Antibióticos</TableHead>
                    <TableHead>Vitaminas</TableHead>
                    <TableHead>Otros</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicacion
                    .filter(med => med.tipoAnimal === 'pollo')
                    .map((med) => (
                      <TableRow key={med.id}>
                        <TableCell>{med.nombreEtapa}</TableCell>
                        <TableCell>{med.diasInicio}-{med.diasFin}</TableCell>
                        <TableCell>{med.vacunas.join(', ')}</TableCell>
                        <TableCell>{med.antibioticos || '-'}</TableCell>
                        <TableCell>{med.vitaminas || '-'}</TableCell>
                        <TableCell>{med.otros || '-'}</TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setMedicacionParaEditar(med);
                            setNuevaMedicacion({
                              nombreEtapa: med.nombreEtapa,
                              diasInicio: med.diasInicio,
                              diasFin: med.diasFin,
                              vacunas: med.vacunas,
                              antibioticos: med.antibioticos,
                              vitaminas: med.vitaminas,
                              otros: med.otros,
                              tipoAnimal: med.tipoAnimal
                            });
                          }}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => {
                            // Implementar la lógica para eliminar la medicación
                          }}>
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
              <CardTitle>Plan de Medicación para Cerdos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Días</TableHead>
                    <TableHead>Vacunas</TableHead>
                    <TableHead>Antibióticos</TableHead>
                    <TableHead>Vitaminas</TableHead>
                    <TableHead>Otros</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicacion
                    .filter(med => med.tipoAnimal === 'cerdo')
                    .map((med) => (
                      <TableRow key={med.id}>
                        <TableCell>{med.nombreEtapa}</TableCell>
                        <TableCell>{med.diasInicio}-{med.diasFin}</TableCell>
                        <TableCell>{med.vacunas.join(', ')}</TableCell>
                        <TableCell>{med.antibioticos || '-'}</TableCell>
                        <TableCell>{med.vitaminas || '-'}</TableCell>
                        <TableCell>{med.otros || '-'}</TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setMedicacionParaEditar(med);
                            setNuevaMedicacion({
                              nombreEtapa: med.nombreEtapa,
                              diasInicio: med.diasInicio,
                              diasFin: med.diasFin,
                              vacunas: med.vacunas,
                              antibioticos: med.antibioticos,
                              vitaminas: med.vitaminas,
                              otros: med.otros,
                              tipoAnimal: med.tipoAnimal
                            });
                          }}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => {
                            // Implementar la lógica para eliminar la medicación
                          }}>
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