'use client';

import { useState, useEffect, useMemo } from 'react';
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
import Link from 'next/link';

interface PlanAlimentacion {
  id: number;
  nombreEtapa: string;
  diasInicio: number;
  diasFin: number;
  consumoDiario: number;
  consumoAgua: number;
  unidadAgua: 'ml' | 'L';
  energia: number;
  pesoObjetivo: number;
  tipoAlimento: 'Polvo' | 'Granulado' | 'Peletizado';
  descripcionAlimento: string;
  tipoAnimal: 'pollos' | 'cerdos';
}

interface Producto {
  id: number;
  nombre: string;
  detalle: string;
  tipo: 'alimento';
  tipo_animal: 'pollos' | 'cerdos';
  forma_alimento: 'Polvo' | 'Granulado' | 'Peletizado';
}

const alimentacionInicial: PlanAlimentacion[] = [
  {
    id: 1,
    nombreEtapa: "Iniciador",
    diasInicio: 1,
    diasFin: 14,
    consumoDiario: 15,
    consumoAgua: 30,
    unidadAgua: 'ml',
    energia: 2950,
    pesoObjetivo: 0.19,
    tipoAlimento: "Polvo",
    descripcionAlimento: "Alimento iniciador con alto contenido proteico",
    tipoAnimal: "pollos"
  }
];

export default function PlanNutricionalPage() {
  const { theme } = useTheme();
  const [alimentacion, setAlimentacion] = useState<PlanAlimentacion[]>([]);
  const [tipoAnimal, setTipoAnimal] = useState<'pollos' | 'cerdos'>('pollos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [etapaParaEditar, setEtapaParaEditar] = useState<PlanAlimentacion | null>(null);
  const [productosInventario, setProductosInventario] = useState<Producto[]>([]);
  const [nuevaEtapa, setNuevaEtapa] = useState<Partial<PlanAlimentacion>>({
    nombreEtapa: '',
    diasInicio: 1,
    diasFin: 1,
    consumoDiario: 0,
    consumoAgua: 0,
    unidadAgua: 'ml',
    energia: 0,
    pesoObjetivo: 0,
    tipoAlimento: 'Polvo',
    descripcionAlimento: '',
    tipoAnimal: 'pollos'
  });

  // Cargar planes nutricionales al inicio
  useEffect(() => {
    const planesGuardados = localStorage.getItem('planesNutricionales');
    if (planesGuardados) {
      setAlimentacion(JSON.parse(planesGuardados));
    } else {
      setAlimentacion(alimentacionInicial);
      localStorage.setItem('planesNutricionales', JSON.stringify(alimentacionInicial));
    }
  }, []);

  // Guardar cambios en localStorage cada vez que se actualice la alimentación
  useEffect(() => {
    localStorage.setItem('planesNutricionales', JSON.stringify(alimentacion));
  }, [alimentacion]);

  // Cargar productos del inventario
  useEffect(() => {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      const productos = JSON.parse(productosGuardados);
      const alimentosInventario = productos.filter((p: Producto) => 
        p.tipo === 'alimento' && p.tipo_animal === tipoAnimal
      );
      setProductosInventario(alimentosInventario);
    }
  }, [tipoAnimal]);

  // Obtener nombres de etapas del inventario
  const etapasDisponibles = useMemo(() => {
    return productosInventario.map(p => ({
      value: p.detalle,
      label: p.detalle,
      formaAlimento: p.forma_alimento || 'Polvo',
      id: p.id
    }));
  }, [productosInventario]);

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
      nombreEtapa: nuevaEtapa.nombreEtapa!,
      diasInicio: nuevaEtapa.diasInicio!,
      diasFin: nuevaEtapa.diasFin!,
      consumoDiario: nuevaEtapa.consumoDiario!,
      consumoAgua: nuevaEtapa.consumoAgua!,
      unidadAgua: nuevaEtapa.unidadAgua as 'ml' | 'L',
      energia: nuevaEtapa.energia!,
      pesoObjetivo: nuevaEtapa.pesoObjetivo!,
      tipoAlimento: nuevaEtapa.tipoAlimento as 'Polvo' | 'Granulado' | 'Peletizado',
      descripcionAlimento: nuevaEtapa.descripcionAlimento!,
      tipoAnimal: nuevaEtapa.tipoAnimal as 'pollos' | 'cerdos'
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
      consumoAgua: 0,
      unidadAgua: 'ml',
      energia: 0,
      pesoObjetivo: 0,
      descripcionAlimento: '',
      tipoAlimento: 'Polvo',
      tipoAnimal: 'pollos'
    });
  };

  const handleTabChange = (value: string) => {
    setTipoAnimal(value as 'pollos' | 'cerdos');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <nav className="flex space-x-4">
          <Link 
            href="/admin/dashboard/plan-nutricional"
            className="px-4 py-2 rounded-lg hover:bg-gray-100 bg-gray-100 font-semibold"
          >
            Plan de Alimentación
          </Link>
          <Link 
            href="/admin/dashboard/plan-medicacion"
            className="px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Plan de Medicación
          </Link>
        </nav>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Plan de Alimentación</h2>
      
      <Tabs defaultValue="pollos" className="space-y-4" onValueChange={handleTabChange}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="pollos">Pollos</TabsTrigger>
            <TabsTrigger value="cerdos">Cerdos</TabsTrigger>
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
                  {etapaParaEditar ? 'Editar Etapa' : 'Nueva Etapa de Alimentación'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tipoAnimal" className="text-right">
                    Tipo de Animal
                  </Label>
                  <Select
                    value={tipoAnimal}
                    onValueChange={(valor: 'pollos' | 'cerdos') => {
                      setTipoAnimal(valor);
                      setNuevaEtapa(prev => ({
                        ...prev,
                        tipoAnimal: valor,
                        nombreEtapa: ''
                      }));
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione el tipo de animal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pollos">Pollos</SelectItem>
                      <SelectItem value="cerdos">Cerdos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombreEtapa" className="text-right">
                    Nombre de la Etapa
                  </Label>
                  <Select
                    value={nuevaEtapa.nombreEtapa}
                    onValueChange={(valor) => {
                      const etapaSeleccionada = etapasDisponibles.find(e => e.value === valor);
                      setNuevaEtapa({
                        ...nuevaEtapa,
                        nombreEtapa: valor,
                        tipoAlimento: etapaSeleccionada?.formaAlimento || 'Polvo'
                      });
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione la etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      {etapasDisponibles
                        .filter((etapa, index, self) => 
                          index === self.findIndex((t) => t.value === etapa.value)
                        )
                        .map((etapa) => (
                          <SelectItem key={etapa.id} value={etapa.value}>
                            {etapa.label}
                          </SelectItem>
                      ))}
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
                  <Label htmlFor="consumoAgua" className="text-right">
                    Consumo de Agua
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Input
                      id="consumoAgua"
                      type="number"
                      min="0"
                      step="0.1"
                      className="flex-1"
                      value={nuevaEtapa.consumoAgua}
                      onChange={(e) => setNuevaEtapa({...nuevaEtapa, consumoAgua: Number(e.target.value)})}
                    />
                    <Select
                      value={nuevaEtapa.unidadAgua}
                      onValueChange={(valor: 'ml' | 'L') => setNuevaEtapa({...nuevaEtapa, unidadAgua: valor})}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="energia" className="text-right">
                    Energía (kcal)
                  </Label>
                  <Input
                    id="energia"
                    type="number"
                    min="0"
                    step="0.1"
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

        <TabsContent value="pollos">
          <Card>
            <CardHeader>
              <CardTitle>Plan de Alimentación para Pollos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre de la Etapa</TableHead>
                    <TableHead>Días Inicio</TableHead>
                    <TableHead>Días Fin</TableHead>
                    <TableHead>Consumo Diario (g)</TableHead>
                    <TableHead>Consumo Agua</TableHead>
                    <TableHead>Energía (kcal)</TableHead>
                    <TableHead>Peso Objetivo (kg)</TableHead>
                    <TableHead>Forma de alimento</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alimentacion
                    .filter(etapa => etapa.tipoAnimal === 'pollos')
                    .map((etapa) => (
                      <TableRow key={etapa.id}>
                        <TableCell>{etapa.nombreEtapa}</TableCell>
                        <TableCell>{etapa.diasInicio}</TableCell>
                        <TableCell>{etapa.diasFin}</TableCell>
                        <TableCell>{etapa.consumoDiario}</TableCell>
                        <TableCell>{etapa.consumoAgua} {etapa.unidadAgua}/día</TableCell>
                        <TableCell>{etapa.energia}</TableCell>
                        <TableCell>{etapa.pesoObjetivo}</TableCell>
                        <TableCell>{etapa.tipoAlimento}</TableCell>
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

        <TabsContent value="cerdos">
          <Card>
            <CardHeader>
              <CardTitle>Plan Nutricional para Cerdos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre de la Etapa</TableHead>
                    <TableHead>Días Inicio</TableHead>
                    <TableHead>Días Fin</TableHead>
                    <TableHead>Consumo Diario (g)</TableHead>
                    <TableHead>Consumo Agua</TableHead>
                    <TableHead>Energía (kcal)</TableHead>
                    <TableHead>Peso Objetivo (kg)</TableHead>
                    <TableHead>Forma de alimento</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alimentacion
                    .filter(etapa => etapa.tipoAnimal === 'cerdos')
                    .map((etapa) => (
                      <TableRow key={etapa.id}>
                        <TableCell>{etapa.nombreEtapa}</TableCell>
                        <TableCell>{etapa.diasInicio}</TableCell>
                        <TableCell>{etapa.diasFin}</TableCell>
                        <TableCell>{etapa.consumoDiario}</TableCell>
                        <TableCell>{etapa.consumoAgua} {etapa.unidadAgua}/día</TableCell>
                        <TableCell>{etapa.energia}</TableCell>
                        <TableCell>{etapa.pesoObjetivo}</TableCell>
                        <TableCell>{etapa.tipoAlimento}</TableCell>
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