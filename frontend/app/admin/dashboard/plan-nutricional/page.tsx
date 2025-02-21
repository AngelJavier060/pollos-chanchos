'use client';

import { useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Textarea } from "@/app/components/ui/textarea";
import { PlusCircle, Edit2, Trash2, Calendar } from 'lucide-react';

interface PlanAlimentacion {
  id: string;
  tipo_animal: 'pollos' | 'chanchos';
  etapa: string;
  edad_inicio: number;
  edad_fin: number;
  alimento_id: string;
  alimento_nombre: string;
  consumo_diario: number;
  temperatura: number;
  observaciones?: string;
}

interface ProgramacionSemanal {
  id: string;
  etapa_id: string;
  dia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  hora_manana: string;
  cantidad_manana: number;
  hora_tarde: string;
  cantidad_tarde: string;
  notas?: string;
}

interface Medicacion {
  id: string;
  etapa_id: string;
  medicina_id: string;
  medicina_nombre: string;
  dosis: number;
  unidad: string;
  frecuencia: string;
  duracion: number;
  via_administracion: string;
  notas?: string;
}

interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  tipo: string;
}

export default function PlanNutricionalPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('plan-alimentacion');
  const [planes, setPlanes] = useState<PlanAlimentacion[]>([]);
  const [programacion, setProgramacion] = useState<ProgramacionSemanal[]>([]);
  const [medicaciones, setMedicaciones] = useState<Medicacion[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editando, setEditando] = useState<any | null>(null);
  const [selectedAlimento, setSelectedAlimento] = useState<string>('');

  // Cargar datos del localStorage
  useEffect(() => {
    const planesGuardados = localStorage.getItem('planes_alimentacion');
    if (planesGuardados) {
      try {
        const planesParseados = JSON.parse(planesGuardados);
        setPlanes(planesParseados);
        console.log('Planes cargados:', planesParseados);
      } catch (error) {
        console.error('Error al cargar planes:', error);
      }
    }

    const programacionGuardada = localStorage.getItem('programacion_semanal');
    if (programacionGuardada) {
      setProgramacion(JSON.parse(programacionGuardada));
    }

    const medicacionesGuardadas = localStorage.getItem('plan_medicacion');
    if (medicacionesGuardadas) {
      setMedicaciones(JSON.parse(medicacionesGuardadas));
    }

    // Cargar productos del inventario
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      try {
        const productos = JSON.parse(productosGuardados);
        setProductos(productos || []);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setProductos([]);
      }
    }
  }, []);

  // Cuando se abre el diálogo para editar, establecer el alimento seleccionado
  useEffect(() => {
    if (editando) {
      setSelectedAlimento(editando.alimento_nombre);
    } else {
      setSelectedAlimento('');
    }
  }, [editando]);

  // Guardar planes en localStorage cada vez que cambien
  useEffect(() => {
    if (planes.length > 0) {
      localStorage.setItem('planes_alimentacion', JSON.stringify(planes));
    }
  }, [planes]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    
    const nuevoPlan = {
      id: editando ? editando.id : Date.now().toString(),
      tipo_animal: formData.get('tipo_animal'),
      etapa: formData.get('etapa'),
      edad_inicio: parseInt(formData.get('edad_inicio') as string),
      edad_fin: parseInt(formData.get('edad_fin') as string),
      alimento_nombre: selectedAlimento,
      consumo_diario: parseFloat(formData.get('consumo_diario') as string),
      temperatura: parseInt(formData.get('temperatura') as string),
      observaciones: formData.get('observaciones')
    };

    let nuevosPlanes;
    if (editando) {
      nuevosPlanes = planes.map(plan =>
        plan.id === editando.id ? nuevoPlan : plan
      );
    } else {
      nuevosPlanes = [...planes, nuevoPlan];
    }

    // Actualizar el estado y localStorage inmediatamente
    setPlanes(nuevosPlanes);
    localStorage.setItem('planes_alimentacion', JSON.stringify(nuevosPlanes));

    setShowDialog(false);
    setEditando(null);
    setSelectedAlimento('');
  };

  const eliminarItem = (id: string) => {
    if (activeTab === 'plan-alimentacion') {
      setPlanes(planes.filter(p => p.id !== id));
    } else if (activeTab === 'programacion') {
      setProgramacion(programacion.filter(p => p.id !== id));
    } else {
      setMedicaciones(medicaciones.filter(m => m.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Plan Nutricional y Medicación</h2>
        <p className="text-muted-foreground">
          Gestiona el plan de alimentación, programación semanal y medicación
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="plan-alimentacion">Plan de Alimentación</TabsTrigger>
            <TabsTrigger value="programacion">Programación Semanal</TabsTrigger>
            <TabsTrigger value="medicacion">Plan de Medicación</TabsTrigger>
          </TabsList>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                {activeTab === 'plan-alimentacion' ? 'Nueva Etapa' :
                 activeTab === 'programacion' ? 'Nueva Programación' :
                 'Nueva Medicación'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {activeTab === 'plan-alimentacion' ? 'Etapa de Alimentación' :
                   activeTab === 'programacion' ? 'Programación Semanal' :
                   'Plan de Medicación'}
                </DialogTitle>
              </DialogHeader>
              {/* Formulario dinámico según la pestaña activa */}
              {activeTab === 'plan-alimentacion' && (
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tipo_animal">Tipo</Label>
                        <Select
                          name="tipo_animal"
                          defaultValue={editando?.tipo_animal}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pollos">Pollos</SelectItem>
                            <SelectItem value="chanchos">Chanchos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="etapa">Etapa</Label>
                        <Input
                          id="etapa"
                          name="etapa"
                          defaultValue={editando?.etapa}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edad_inicio">Edad Inicio (días)</Label>
                        <Input
                          id="edad_inicio"
                          name="edad_inicio"
                          type="number"
                          defaultValue={editando?.edad_inicio}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="edad_fin">Edad Fin (días)</Label>
                        <Input
                          id="edad_fin"
                          name="edad_fin"
                          type="number"
                          defaultValue={editando?.edad_fin}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="alimento_id">Alimento</Label>
                        <Select
                          value={selectedAlimento}
                          onValueChange={setSelectedAlimento}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar alimento" />
                          </SelectTrigger>
                          <SelectContent>
                            {productos.map((producto) => (
                              <SelectItem key={producto.id} value={producto.nombre}>
                                {producto.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="consumo_diario">Consumo Diario (kg)</Label>
                        <Input
                          id="consumo_diario"
                          name="consumo_diario"
                          type="number"
                          step="0.01"
                          defaultValue={editando?.consumo_diario}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="temperatura">Temperatura (°C)</Label>
                      <Input
                        id="temperatura"
                        name="temperatura"
                        type="number"
                        step="0.1"
                        defaultValue={editando?.temperatura}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="observaciones">Observaciones</Label>
                      <Textarea
                        id="observaciones"
                        name="observaciones"
                        defaultValue={editando?.observaciones}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editando ? 'Actualizar' : 'Guardar'}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="plan-alimentacion">
          <Card>
            <CardHeader>
              <CardTitle>Plan de Alimentación</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Edad (días)</TableHead>
                    <TableHead>Alimento</TableHead>
                    <TableHead>Consumo Diario</TableHead>
                    <TableHead>Temperatura</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planes.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="capitalize">{plan.tipo_animal}</TableCell>
                      <TableCell>{plan.etapa}</TableCell>
                      <TableCell>{plan.edad_inicio} - {plan.edad_fin}</TableCell>
                      <TableCell>{plan.alimento_nombre}</TableCell>
                      <TableCell>{plan.consumo_diario} kg</TableCell>
                      <TableCell>{plan.temperatura}°C</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditando(plan);
                            setShowDialog(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarItem(plan.id)}
                          className="text-red-600"
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

        <TabsContent value="programacion">
          <Card>
            <CardHeader>
              <CardTitle>Programación Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia) => (
                  <Card key={dia} className="p-4">
                    <CardTitle className="text-lg mb-4">{dia}</CardTitle>
                    <div className="space-y-4">
                      {programacion
                        .filter(p => p.dia === dia)
                        .map(prog => (
                          <div key={prog.id} className="border p-2 rounded">
                            <div className="font-medium">Mañana: {prog.hora_manana}</div>
                            <div className="text-sm text-muted-foreground">
                              Cantidad: {prog.cantidad_manana} kg
                            </div>
                            <div className="font-medium mt-2">Tarde: {prog.hora_tarde}</div>
                            <div className="text-sm text-muted-foreground">
                              Cantidad: {prog.cantidad_tarde} kg
                            </div>
                            <div className="flex justify-end mt-2 space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditando(prog);
                                  setShowDialog(true);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => eliminarItem(prog.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicacion">
          <Card>
            <CardHeader>
              <CardTitle>Plan de Medicación</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Medicina</TableHead>
                    <TableHead>Dosis</TableHead>
                    <TableHead>Frecuencia</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Vía</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicaciones.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell>{planes.find(p => p.id === med.etapa_id)?.etapa}</TableCell>
                      <TableCell>{med.medicina_nombre}</TableCell>
                      <TableCell>{med.dosis} {med.unidad}</TableCell>
                      <TableCell>{med.frecuencia}</TableCell>
                      <TableCell>{med.duracion} días</TableCell>
                      <TableCell>{med.via_administracion}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditando(med);
                            setShowDialog(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarItem(med.id)}
                          className="text-red-600"
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
      </Tabs>
    </div>
  );
}