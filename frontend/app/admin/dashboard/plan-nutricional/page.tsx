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
import { PlusCircle, Edit2, Trash2, Plus, Calendar } from 'lucide-react';

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

interface PlanMedicacion {
  id: string;
  tipo_animal: 'pollos' | 'chanchos';
  etapa: string;
  medicina_nombre: string;
  dosis_ml: number;
  dias_aplicacion: number;
  via_administracion: string;
  observaciones?: string;
}

interface Cronograma {
  id: string;
  tipo_animal: 'pollos' | 'chanchos';
  fecha_inicio: string;
  planes_alimentacion: {
    plan_id: string;
    dias: number[];
  }[];
  planes_medicacion: {
    plan_id: string;
    dias: number[];
  }[];
  notas: string;
}

interface ProgramacionCiclo {
  id: string;
  tipo_animal: 'pollos' | 'chanchos';
  edad_inicio: number;
  edad_fin: number;
  duracion_ciclo: number; // duración en días
  alimentacion: {
    etapa: string;
    horarios: {
      manana: {
        hora: string;
        cantidad: number;
      };
      tarde: {
        hora: string;
        cantidad: number;
      };
    };
  };
  medicacion: {
    etapa: string;
    medicina: string;
    dosis: number;
    dias_aplicacion: number; // cada cuántos días
    hora: string;
  }[];
  notas: string;
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
  detalle: string;
  tipo: string;
  tipo_animal: string;
  cantidad: number;
  unidad_medida: string;
  precio_unitario: number;
  proveedor: string;
}

export default function PlanNutricionalPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('plan-alimentacion');
  const [planes, setPlanes] = useState<PlanAlimentacion[]>([]);
  const [programacion, setProgramacion] = useState<ProgramacionCiclo[]>([]);
  const [medicaciones, setMedicaciones] = useState<PlanMedicacion[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editando, setEditando] = useState<any | null>(null);
  const [selectedAlimento, setSelectedAlimento] = useState<string>('');
  const [etapasDisponibles, setEtapasDisponibles] = useState<string[]>([]);
  const [cronogramas, setCronogramas] = useState<Cronograma[]>([]);

  // Cargar datos del localStorage
  useEffect(() => {
    const planesGuardados = localStorage.getItem('planes_alimentacion');
    if (planesGuardados) {
      try {
        const planesParseados = JSON.parse(planesGuardados);
        setPlanes(planesParseados);
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
      try {
        const medicacionesParseadas = JSON.parse(medicacionesGuardadas);
        setMedicaciones(medicacionesParseadas);
      } catch (error) {
        console.error('Error al cargar medicaciones:', error);
        setMedicaciones([]);
      }
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

    const cronogramasGuardados = localStorage.getItem('cronogramas');
    if (cronogramasGuardados) {
      try {
        const cronogramasParseados = JSON.parse(cronogramasGuardados);
        setCronogramas(cronogramasParseados);
      } catch (error) {
        console.error('Error al cargar cronogramas:', error);
      }
    }
  }, []);

  // Actualizar etapas disponibles cuando se selecciona una medicina
  useEffect(() => {
    if (activeTab === 'medicacion') {
      // Obtener todas las etapas disponibles del inventario para medicamentos
      const etapasInventario = productos
        .filter(p => p.tipo.toLowerCase() === 'medicina')
        .map(p => p.detalle)
        .filter((detalle, index, self) => 
          detalle && 
          detalle.trim() !== '' && 
          self.indexOf(detalle) === index
        );
      
      setEtapasDisponibles(etapasInventario);
    }
  }, [activeTab, productos]);

  // Cuando se abre el diálogo para editar, establecer el alimento seleccionado
  useEffect(() => {
    if (editando) {
      setSelectedAlimento(editando.alimento_nombre || editando.medicina_nombre);
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
    
    if (activeTab === 'medicacion') {
      const nuevaMedicacion = {
        id: editando ? editando.id : Date.now().toString(),
        tipo_animal: formData.get('tipo_animal'),
        etapa: formData.get('etapa'),
        medicina_nombre: selectedAlimento, // Aquí usamos selectedAlimento para el nombre de la medicina
        dosis_ml: parseFloat(formData.get('dosis_ml') as string),
        dias_aplicacion: parseInt(formData.get('dias_aplicacion') as string),
        via_administracion: formData.get('via_administracion'),
        observaciones: formData.get('observaciones')
      };

      const nuevasMedicaciones = editando 
        ? medicaciones.map(med => med.id === editando.id ? nuevaMedicacion : med)
        : [...medicaciones, nuevaMedicacion];
      
      setMedicaciones(nuevasMedicaciones);
      localStorage.setItem('plan_medicacion', JSON.stringify(nuevasMedicaciones));
    } else if (activeTab === 'plan-alimentacion') {
      let nuevosPlanes;
      if (editando) {
        nuevosPlanes = planes.map(plan =>
          plan.id === editando.id ? {
            id: editando.id,
            tipo_animal: formData.get('tipo_animal'),
            etapa: formData.get('etapa'),
            edad_inicio: parseInt(formData.get('edad_inicio') as string),
            edad_fin: parseInt(formData.get('edad_fin') as string),
            alimento_nombre: selectedAlimento,
            consumo_diario: parseFloat(formData.get('consumo_diario') as string),
            temperatura: parseInt(formData.get('temperatura') as string),
            observaciones: formData.get('observaciones')
          } : plan
        );
      } else {
        nuevosPlanes = [...planes, {
          id: Date.now().toString(),
          tipo_animal: formData.get('tipo_animal'),
          etapa: formData.get('etapa'),
          edad_inicio: parseInt(formData.get('edad_inicio') as string),
          edad_fin: parseInt(formData.get('edad_fin') as string),
          alimento_nombre: selectedAlimento,
          consumo_diario: parseFloat(formData.get('consumo_diario') as string),
          temperatura: parseInt(formData.get('temperatura') as string),
          observaciones: formData.get('observaciones')
        }];
      }

      // Actualizar el estado y localStorage inmediatamente
      setPlanes(nuevosPlanes);
      localStorage.setItem('planes_alimentacion', JSON.stringify(nuevosPlanes));
    } else if (activeTab === 'programacion') {
      const nuevoCronograma = {
        id: Date.now().toString(),
        tipo_animal: formData.get('tipo_animal'),
        fecha_inicio: formData.get('fecha_inicio'),
        planes_alimentacion: [],
        planes_medicacion: [],
        notas: formData.get('notas')
      };

      const nuevosCronogramas = [...cronogramas, nuevoCronograma];
      setCronogramas(nuevosCronogramas);
      localStorage.setItem('cronogramas', JSON.stringify(nuevosCronogramas));
    }

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
            <TabsTrigger value="medicacion">Plan de Medicación</TabsTrigger>
            <TabsTrigger value="programacion">Programación de Planes</TabsTrigger>
          </TabsList>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                {activeTab === 'plan-alimentacion' ? 'Nueva Etapa' :
                 activeTab === 'programacion' ? 'Nuevo Cronograma' :
                 'Nueva Medicación'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editando ? 'Editar Plan' : 'Nuevo Plan'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  {activeTab === 'medicacion' ? (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tipo_animal" className="text-right">
                          Tipo
                        </Label>
                        <Select
                          name="tipo_animal"
                          defaultValue={editando?.tipo_animal || "pollos"}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pollos">Pollos</SelectItem>
                            <SelectItem value="chanchos">Chanchos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="medicina" className="text-right">
                          Medicina
                        </Label>
                        <Select
                          name="medicina"
                          value={selectedAlimento}
                          onValueChange={setSelectedAlimento}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar medicina" />
                          </SelectTrigger>
                          <SelectContent>
                            {productos
                              .filter(p => p.tipo.toLowerCase() === 'medicina')
                              .map(producto => (
                                <SelectItem key={producto.id} value={producto.nombre}>
                                  {producto.nombre}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="etapa" className="text-right">
                          Etapa
                        </Label>
                        <Select name="etapa" defaultValue={editando?.etapa}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar etapa" />
                          </SelectTrigger>
                          <SelectContent>
                            {etapasDisponibles.map(etapa => (
                              <SelectItem key={etapa} value={etapa}>
                                {etapa}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dosis_ml" className="text-right">
                          Dosis (ml)
                        </Label>
                        <Input
                          id="dosis_ml"
                          name="dosis_ml"
                          type="number"
                          step="0.1"
                          defaultValue={editando?.dosis_ml}
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dias_aplicacion" className="text-right">
                          Días de aplicación
                        </Label>
                        <Input
                          id="dias_aplicacion"
                          name="dias_aplicacion"
                          type="number"
                          defaultValue={editando?.dias_aplicacion}
                          className="col-span-3"
                          placeholder="Cada cuántos días"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="via_administracion" className="text-right">
                          Vía
                        </Label>
                        <Input
                          id="via_administracion"
                          name="via_administracion"
                          defaultValue={editando?.via_administracion}
                          className="col-span-3"
                          placeholder="Ej: Oral, Inyectable"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="observaciones" className="text-right">
                          Observaciones
                        </Label>
                        <Textarea
                          id="observaciones"
                          name="observaciones"
                          defaultValue={editando?.observaciones}
                          className="col-span-3"
                        />
                      </div>
                    </>
                  ) : activeTab === 'programacion' ? (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tipo_animal" className="text-right">Tipo</Label>
                        <Select name="tipo_animal">
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pollos">Pollos</SelectItem>
                            <SelectItem value="chanchos">Chanchos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dia" className="text-right">Día</Label>
                        <Input
                          id="dia"
                          name="dia"
                          type="number"
                          min="1"
                          className="col-span-3"
                          placeholder="Número de día"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="plan_alimentacion" className="text-right">
                          Plan Alimentación
                        </Label>
                        <Select name="plan_alimentacion">
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {planes.map(plan => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.etapa}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="plan_medicacion" className="text-right">
                          Plan Medicación
                        </Label>
                        <Select name="plan_medicacion">
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {medicaciones.map(med => (
                              <SelectItem key={med.id} value={med.id}>
                                {med.medicina_nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    // Aquí va el formulario original del plan de alimentación
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tipo_animal" className="text-right">
                          Tipo
                        </Label>
                        <Select
                          name="tipo_animal"
                          defaultValue={editando?.tipo_animal || "pollos"}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pollos">Pollos</SelectItem>
                            <SelectItem value="chanchos">Chanchos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="alimento" className="text-right">
                          Alimento
                        </Label>
                        <Select
                          name="alimento"
                          value={selectedAlimento}
                          onValueChange={setSelectedAlimento}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar alimento" />
                          </SelectTrigger>
                          <SelectContent>
                            {productos
                              .filter(p => p.tipo.toLowerCase() === 'alimento')
                              .map(producto => (
                                <SelectItem key={producto.id} value={producto.nombre}>
                                  {producto.nombre}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="etapa" className="text-right">
                          Etapa
                        </Label>
                        <Select name="etapa" defaultValue={editando?.etapa}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar etapa" />
                          </SelectTrigger>
                          <SelectContent>
                            {etapasDisponibles.map(etapa => (
                              <SelectItem key={etapa} value={etapa}>
                                {etapa}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edad_inicio" className="text-right">
                          Edad Inicio (días)
                        </Label>
                        <Input
                          id="edad_inicio"
                          name="edad_inicio"
                          type="number"
                          defaultValue={editando?.edad_inicio}
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edad_fin" className="text-right">
                          Edad Fin (días)
                        </Label>
                        <Input
                          id="edad_fin"
                          name="edad_fin"
                          type="number"
                          defaultValue={editando?.edad_fin}
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="consumo_diario" className="text-right">
                          Consumo Diario (kg)
                        </Label>
                        <Input
                          id="consumo_diario"
                          name="consumo_diario"
                          type="number"
                          step="0.01"
                          defaultValue={editando?.consumo_diario}
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="temperatura" className="text-right">
                          Temperatura (°C)
                        </Label>
                        <Input
                          id="temperatura"
                          name="temperatura"
                          type="number"
                          step="0.1"
                          defaultValue={editando?.temperatura}
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="observaciones" className="text-right">
                          Observaciones
                        </Label>
                        <Textarea
                          id="observaciones"
                          name="observaciones"
                          defaultValue={editando?.observaciones}
                          className="col-span-3"
                        />
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editando ? 'Actualizar' : 'Guardar'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="plan-alimentacion" className="space-y-4">
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

        <TabsContent value="medicacion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan de Medicación</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Medicina</TableHead>
                    <TableHead>Dosis</TableHead>
                    <TableHead>Días de aplicación</TableHead>
                    <TableHead>Vía</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicaciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No hay medicaciones registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    medicaciones.map((med) => (
                      <TableRow key={med.id}>
                        <TableCell>{med.tipo_animal}</TableCell>
                        <TableCell>{med.etapa}</TableCell>
                        <TableCell>{med.medicina_nombre}</TableCell>
                        <TableCell>{med.dosis_ml} ml</TableCell>
                        <TableCell>Cada {med.dias_aplicacion} días</TableCell>
                        <TableCell>{med.via_administracion || '-'}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditando(med);
                              setSelectedAlimento(med.medicina_nombre);
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
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programacion" className="space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Calendario Semanal</CardTitle>
              <Button onClick={() => setShowDialog(true)}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Agregar Plan
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia) => (
                  <div key={dia} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-center mb-4">{dia}</h3>
                    
                    {/* Sección de Alimentación */}
                    <div className="space-y-2 mb-4">
                      <div className="bg-green-50 rounded-md p-2">
                        <h4 className="font-medium text-sm text-green-800">Alimentación</h4>
                        <div className="text-sm space-y-1">
                          <p className="text-green-700">Mañana (8:00 AM):</p>
                          <p className="text-green-600">Alimento Inicial - 2.5kg</p>
                          <p className="text-green-700 mt-2">Tarde (4:00 PM):</p>
                          <p className="text-green-600">Alimento Inicial - 2.5kg</p>
                        </div>
                      </div>

                      {/* Sección de Medicación */}
                      <div className="bg-blue-50 rounded-md p-2">
                        <h4 className="font-medium text-sm text-blue-800">Medicación</h4>
                        <div className="text-sm space-y-1">
                          <p className="text-blue-700">9:00 AM:</p>
                          <p className="text-blue-600">Vitamina C - 5ml</p>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-2 mt-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setEditando({ dia });
                        setShowDialog(true);
                      }}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editando ? 'Editar Plan' : 'Nuevo Plan'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dia" className="text-right">Día</Label>
                  <Select name="dia" defaultValue={editando?.dia}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar día" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(dia => (
                        <SelectItem key={dia} value={dia}>{dia}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Alimentación</h4>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="alimento_manana" className="text-right">Mañana</Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        id="hora_manana"
                        name="hora_manana"
                        type="time"
                        defaultValue="08:00"
                      />
                      <Select name="alimento_manana">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar alimento" />
                        </SelectTrigger>
                        <SelectContent>
                          {planes.map(plan => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.alimento_nombre} - {plan.consumo_diario}kg
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="alimento_tarde" className="text-right">Tarde</Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        id="hora_tarde"
                        name="hora_tarde"
                        type="time"
                        defaultValue="16:00"
                      />
                      <Select name="alimento_tarde">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar alimento" />
                        </SelectTrigger>
                        <SelectContent>
                          {planes.map(plan => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.alimento_nombre} - {plan.consumo_diario}kg
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Medicación</h4>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="medicacion" className="text-right">Medicina</Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        id="hora_medicina"
                        name="hora_medicina"
                        type="time"
                        defaultValue="09:00"
                      />
                      <Select name="medicacion">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar medicina" />
                        </SelectTrigger>
                        <SelectContent>
                          {medicaciones.map(med => (
                            <SelectItem key={med.id} value={med.id}>
                              {med.medicina_nombre} - {med.dosis_ml}ml
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit">Guardar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}