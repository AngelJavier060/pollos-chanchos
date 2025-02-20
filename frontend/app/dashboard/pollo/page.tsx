'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { toast } from "@/app/components/ui/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Info } from 'lucide-react';
import Navbar from './components/Navbar';
import RegistroLotes from './components/registro/RegistroLotes';
import DashboardContent from './components/Dashboard';

interface Lote {
  id: string;
  nombre: string;
  raza: string;
  cantidad: number;
  fecha_nacimiento: string;
  tipo_animal: string;
  registros?: {
    fecha: string;
    alimento: number;
    agua: number;
    mortalidad: string;
    observaciones: string;
  }[];
}

interface RegistroDiario {
  fecha: string;
  alimento: number;
  agua: number;
  mortalidad: string;
  observaciones: string;
}

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
  tipoAlimento: string;
  descripcionAlimento: string;
  tipoAnimal: 'pollos' | 'cerdos';
}

// Función para calcular días desde nacimiento
const calcularDiasDesdeNacimiento = (fecha: string) => {
  const nacimiento = new Date(fecha);
  const hoy = new Date();
  const diferencia = hoy.getTime() - nacimiento.getTime();
  return Math.floor(diferencia / (1000 * 60 * 60 * 24));
};

// Componente de Alerta Nutricional
const AlertaNutricional = ({ lote }: { lote: Lote }) => {
  const [planNutricional, setPlanNutricional] = useState<PlanAlimentacion | null>(null);
  const edad = calcularDiasDesdeNacimiento(lote.fecha_nacimiento);

  useEffect(() => {
    const planesGuardados = localStorage.getItem('planesNutricionales');
    if (planesGuardados) {
      try {
        const planes = JSON.parse(planesGuardados);
        console.log('Planes guardados:', planes);
        console.log('Edad actual:', edad);
        
        const planActual = planes.find((plan: PlanAlimentacion) => 
          plan.tipoAnimal === 'pollos' && 
          edad >= plan.diasInicio && 
          edad <= plan.diasFin
        );
        
        console.log('Plan actual encontrado:', planActual);
        setPlanNutricional(planActual || null);
      } catch (error) {
        console.error('Error al cargar planes nutricionales:', error);
      }
    }
  }, [edad]);

  if (!planNutricional) {
    return (
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>No hay plan nutricional</AlertTitle>
        <AlertDescription>
          No se encontró un plan nutricional para el día {edad}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="font-semibold text-blue-800 mb-2">
        Plan Nutricional - Día {edad}
      </h4>
      <div className="text-sm text-blue-700">
        <p><strong>Etapa:</strong> {planNutricional.nombreEtapa}</p>
        <p><strong>Forma de alimento:</strong> {planNutricional.tipoAlimento}</p>
        <p><strong>Consumo diario:</strong> {planNutricional.consumoDiario}g por ave</p>
        <p><strong>Consumo de agua:</strong> {planNutricional.consumoAgua} {planNutricional.unidadAgua} por ave</p>
        <p><strong>Peso objetivo:</strong> {planNutricional.pesoObjetivo}kg</p>
        {planNutricional.descripcionAlimento && (
          <p><strong>Recomendación:</strong> {planNutricional.descripcionAlimento}</p>
        )}
      </div>
    </div>
  );
};

export default function DashboardPollo() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loteSeleccionado, setLoteSeleccionado] = useState<Lote | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [registroDiario, setRegistroDiario] = useState<RegistroDiario>({
    fecha: new Date().toISOString().split('T')[0],
    alimento: 0,
    agua: 0,
    mortalidad: 'Bueno',
    observaciones: ''
  });
  const [planesNutricionales, setPlanesNutricionales] = useState<PlanAlimentacion[]>([]);

  // Cargar lotes del localStorage
  useEffect(() => {
    const lotesGuardados = localStorage.getItem('lotes');
    if (lotesGuardados) {
      const todosLotes = JSON.parse(lotesGuardados);
      const lotesPollos = todosLotes.filter((lote: Lote) => 
        lote.tipo_animal === 'pollo' || lote.raza.toLowerCase().includes('pollo')
      );
      setLotes(lotesPollos);
    }
  }, []);

  // Cargar planes nutricionales
  useEffect(() => {
    const planesGuardados = localStorage.getItem('planesNutricionales');
    if (planesGuardados) {
      const planes = JSON.parse(planesGuardados);
      setPlanesNutricionales(planes.filter((plan: PlanAlimentacion) => plan.tipoAnimal === 'pollos'));
    }
  }, []);

  const handleOpenDialog = (lote: Lote) => {
    setLoteSeleccionado(lote);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setLoteSeleccionado(null);
  };

  const guardarCambios = () => {
    if (!loteSeleccionado) return;

    const lotesActualizados = lotes.map(lote => {
      if (lote.id === loteSeleccionado.id) {
        const registros = lote.registros || [];
        return {
          ...lote,
          registros: [...registros, registroDiario]
        };
      }
      return lote;
    });

    localStorage.setItem('lotes', JSON.stringify(lotesActualizados));
    setLotes(lotesActualizados);
    
    const nuevoLote = lotesActualizados.find(l => l.id === loteSeleccionado.id);
    if (nuevoLote) {
      setLoteSeleccionado(nuevoLote);
    }

    toast({
      title: "Registro guardado",
      description: "El registro diario se ha guardado correctamente.",
    });

    // Solo resetear el formulario, mantener el diálogo abierto
    setRegistroDiario({
      fecha: new Date().toISOString().split('T')[0],
      alimento: 0,
      agua: 0,
      mortalidad: 'Bueno',
      observaciones: ''
    });
  };

  // Obtener plan nutricional actual basado en la edad
  const obtenerPlanNutricionalActual = (edad: number) => {
    return planesNutricionales.find(
      plan => edad >= plan.diasInicio && edad <= plan.diasFin
    );
  };

  const LotesView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lotes.filter(lote => lote.tipo_animal === 'pollo').map((lote) => {
        const edadLote = calcularDiasDesdeNacimiento(lote.fecha_nacimiento);
        const planActual = obtenerPlanNutricionalActual(edadLote);
        
        return (
          <div key={lote.id} className="bg-white rounded-lg shadow-sm p-6">
            <AlertaNutricional lote={lote} />
            <h3 className="text-lg font-semibold mb-4">{lote.nombre}</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Raza:</span>
                <span className="text-right">{lote.raza}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cantidad:</span>
                <span className="text-right">{lote.cantidad} aves</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Edad:</span>
                <span className="text-right">{edadLote} días</span>
              </div>
              <button 
                className="w-full mt-4 py-2 text-center text-gray-600 hover:text-gray-800 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                onClick={() => handleOpenDialog(lote)}
              >
                Ver Detalles
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'lotes':
        return <LotesView />;
      case 'registro':
        return <RegistroLotes />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="p-8 pt-20">
        <h1 className="text-2xl font-bold mb-6">
          {activeTab === 'dashboard' ? 'Panel de Control' :
           activeTab === 'lotes' ? 'Mis Lotes' : 
           activeTab === 'registro' ? 'Registro de Lotes' : 
           'Panel de Control'}
        </h1>
        
        {renderContent()}
      </main>

      {/* Diálogo de Detalles del Lote */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles del Lote</DialogTitle>
            <DialogDescription>
              Gestión diaria del lote de pollos
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="registro" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="registro">Registro Diario</TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
              <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
            </TabsList>

            <TabsContent value="registro" className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fecha" className="text-right">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={registroDiario.fecha}
                    onChange={(e) => setRegistroDiario({...registroDiario, fecha: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="alimento" className="text-right">Alimento (kg)</Label>
                  <Input
                    id="alimento"
                    type="number"
                    value={registroDiario.alimento}
                    onChange={(e) => setRegistroDiario({...registroDiario, alimento: Number(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="agua" className="text-right">Agua (L)</Label>
                  <Input
                    id="agua"
                    type="number"
                    value={registroDiario.agua}
                    onChange={(e) => setRegistroDiario({...registroDiario, agua: Number(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="mortalidad" className="text-right">Mortalidad</Label>
                  <Select
                    value={registroDiario.mortalidad}
                    onValueChange={(value) => setRegistroDiario({ ...registroDiario, mortalidad: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bueno">Bueno</SelectItem>
                      <SelectItem value="Enfermo">Enfermo</SelectItem>
                      <SelectItem value="Muerto">Muerto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="observaciones" className="text-right">Observaciones</Label>
                  <Input
                    id="observaciones"
                    value={registroDiario.observaciones}
                    onChange={(e) => setRegistroDiario({...registroDiario, observaciones: e.target.value})}
                    className="col-span-3"
                    placeholder="Ej: Estado de salud, comportamiento..."
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="historial">
              <div className="space-y-4">
                {loteSeleccionado?.registros?.map((registro, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="text-sm">
                        <div className="font-semibold">{new Date(registro.fecha).toLocaleDateString()}</div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>Alimento: {registro.alimento} kg</div>
                          <div>Agua: {registro.agua} L</div>
                          <div>Mortalidad: {registro.mortalidad}</div>
                          {registro.observaciones && (
                            <div className="col-span-2">Observaciones: {registro.observaciones}</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="estadisticas">
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="font-semibold">Resumen del Lote</div>
                      <div>Consumo promedio de alimento: {
                        loteSeleccionado?.registros?.reduce((acc, reg) => acc + reg.alimento, 0) / 
                        (loteSeleccionado?.registros?.length || 1)
                      } kg/día</div>
                      <div>Consumo promedio de agua: {
                        loteSeleccionado?.registros?.reduce((acc, reg) => acc + reg.agua, 0) / 
                        (loteSeleccionado?.registros?.length || 1)
                      } L/día</div>
                      <div>Mortalidad total: {
                        loteSeleccionado?.registros?.filter(reg => reg.mortalidad === 'Muerto').length
                      } aves</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button 
              onClick={guardarCambios}
              disabled={!registroDiario.fecha || !loteSeleccionado}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}