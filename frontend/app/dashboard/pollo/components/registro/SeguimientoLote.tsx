'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Plus, ChevronLeft } from "lucide-react";
import { toast } from "@/app/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";

interface SeguimientoProps {
  loteId: number;
  loteName: string;
  cantidadInicial: number;
  fechaAdquisicion: string;
  onBack: () => void;
}

interface RegistroPeso {
  id: number;
  fecha: string;
  peso_promedio: number;
  muestra_tamano: number;
  observaciones: string;
}

interface RegistroMortalidad {
  id: number;
  fecha: string;
  cantidad: number;
  causa: string;
  observaciones: string;
}

export default function SeguimientoLote({ loteId, loteName, cantidadInicial, fechaAdquisicion, onBack }: SeguimientoProps) {
  const [isOpenPeso, setIsOpenPeso] = useState(false);
  const [isOpenMortalidad, setIsOpenMortalidad] = useState(false);
  const [registrosPeso, setRegistrosPeso] = useState<RegistroPeso[]>([]);
  const [registrosMortalidad, setRegistrosMortalidad] = useState<RegistroMortalidad[]>([]);
  const [cantidadActual, setCantidadActual] = useState(cantidadInicial);
  const [diasNacidos, setDiasNacidos] = useState(0);

  const [formDataPeso, setFormDataPeso] = useState({
    peso_promedio: '',
    muestra_tamano: '',
    observaciones: ''
  });

  const [formDataMortalidad, setFormDataMortalidad] = useState({
    cantidad: '',
    causa: '',
    observaciones: ''
  });

  useEffect(() => {
    // Calcular días desde la adquisición
    const fechaInicio = new Date(fechaAdquisicion);
    const hoy = new Date();
    const diferencia = hoy.getTime() - fechaInicio.getTime();
    setDiasNacidos(Math.floor(diferencia / (1000 * 3600 * 24)));

    // Calcular cantidad actual
    const mortalidadTotal = registrosMortalidad.reduce((sum, reg) => sum + reg.cantidad, 0);
    setCantidadActual(cantidadInicial - mortalidadTotal);
  }, [fechaAdquisicion, cantidadInicial, registrosMortalidad]);

  const handleSubmitPeso = (e: React.FormEvent) => {
    e.preventDefault();
    const newRegistro = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      peso_promedio: parseFloat(formDataPeso.peso_promedio),
      muestra_tamano: parseInt(formDataPeso.muestra_tamano),
      observaciones: formDataPeso.observaciones
    };

    setRegistrosPeso([...registrosPeso, newRegistro]);
    setIsOpenPeso(false);
    setFormDataPeso({ peso_promedio: '', muestra_tamano: '', observaciones: '' });
    toast({
      title: "Registro agregado",
      description: "El registro de peso ha sido agregado exitosamente",
    });
  };

  const handleSubmitMortalidad = (e: React.FormEvent) => {
    e.preventDefault();
    const newRegistro = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      cantidad: parseInt(formDataMortalidad.cantidad),
      causa: formDataMortalidad.causa,
      observaciones: formDataMortalidad.observaciones
    };

    setRegistrosMortalidad([...registrosMortalidad, newRegistro]);
    setIsOpenMortalidad(false);
    setFormDataMortalidad({ cantidad: '', causa: '', observaciones: '' });
    toast({
      title: "Registro agregado",
      description: "El registro de mortalidad ha sido agregado exitosamente",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h2 className="text-2xl font-bold">Seguimiento del Lote: {loteName}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Días de Nacidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{diasNacidos}</div>
            <p className="text-sm text-gray-500">días</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cantidad Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{cantidadActual}</div>
            <p className="text-sm text-gray-500">de {cantidadInicial} iniciales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mortalidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">
              {((cantidadInicial - cantidadActual) / cantidadInicial * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-gray-500">tasa de mortalidad</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="peso" className="w-full">
        <TabsList>
          <TabsTrigger value="peso">Registro de Peso</TabsTrigger>
          <TabsTrigger value="mortalidad">Registro de Mortalidad</TabsTrigger>
        </TabsList>

        <TabsContent value="peso">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Historial de Peso</h3>
              <Dialog open={isOpenPeso} onOpenChange={setIsOpenPeso}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Registro
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Peso</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitPeso} className="space-y-4">
                    <div>
                      <Label htmlFor="peso_promedio">Peso Promedio (kg)</Label>
                      <Input
                        id="peso_promedio"
                        type="number"
                        step="0.01"
                        value={formDataPeso.peso_promedio}
                        onChange={(e) => setFormDataPeso({ ...formDataPeso, peso_promedio: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="muestra_tamano">Tamaño de Muestra</Label>
                      <Input
                        id="muestra_tamano"
                        type="number"
                        value={formDataPeso.muestra_tamano}
                        onChange={(e) => setFormDataPeso({ ...formDataPeso, muestra_tamano: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="observaciones_peso">Observaciones</Label>
                      <Textarea
                        id="observaciones_peso"
                        value={formDataPeso.observaciones}
                        onChange={(e) => setFormDataPeso({ ...formDataPeso, observaciones: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Guardar Registro
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Peso Promedio (kg)</TableHead>
                  <TableHead>Muestra</TableHead>
                  <TableHead>Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrosPeso.map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell>{new Date(registro.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{registro.peso_promedio.toFixed(2)}</TableCell>
                    <TableCell>{registro.muestra_tamano}</TableCell>
                    <TableCell>{registro.observaciones}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="mortalidad">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Registro de Mortalidad</h3>
              <Dialog open={isOpenMortalidad} onOpenChange={setIsOpenMortalidad}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Registro
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Mortalidad</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitMortalidad} className="space-y-4">
                    <div>
                      <Label htmlFor="cantidad">Cantidad</Label>
                      <Input
                        id="cantidad"
                        type="number"
                        value={formDataMortalidad.cantidad}
                        onChange={(e) => setFormDataMortalidad({ ...formDataMortalidad, cantidad: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="causa">Causa</Label>
                      <Input
                        id="causa"
                        value={formDataMortalidad.causa}
                        onChange={(e) => setFormDataMortalidad({ ...formDataMortalidad, causa: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="observaciones_mortalidad">Observaciones</Label>
                      <Textarea
                        id="observaciones_mortalidad"
                        value={formDataMortalidad.observaciones}
                        onChange={(e) => setFormDataMortalidad({ ...formDataMortalidad, observaciones: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Guardar Registro
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Causa</TableHead>
                  <TableHead>Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrosMortalidad.map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell>{new Date(registro.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{registro.cantidad}</TableCell>
                    <TableCell>{registro.causa}</TableCell>
                    <TableCell>{registro.observaciones}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 