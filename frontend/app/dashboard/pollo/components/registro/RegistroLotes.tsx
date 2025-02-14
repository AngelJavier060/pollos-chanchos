'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Plus, Edit2, Trash2, LineChart } from "lucide-react";
import { toast } from "@/app/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import SeguimientoLote from "./SeguimientoLote";

interface Raza {
  id: number;
  nombre: string;
  tipo_animal: 'pollo' | 'chancho';
}

interface Lote {
  id: number;
  nombre: string;
  tipo_animal: string;
  raza_id: number;
  cantidad_inicial: number;
  cantidad_actual: number;
  fecha_ingreso: string;
  fecha_estimada_salida: string;
  estado: 'activo' | 'finalizado' | 'cancelado';
  observaciones: string;
  raza_nombre?: string;
}

export default function RegistroLotes() {
  const [isOpen, setIsOpen] = useState(false);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [razas, setRazas] = useState<Raza[]>([]);
  const [editingLote, setEditingLote] = useState<Lote | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: '',
    raza_id: '',
    fecha_estimada_salida: new Date().toISOString().split('T')[0],
    observaciones: ''
  });
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);

  // Cargar las razas al montar el componente
  useEffect(() => {
    const fetchRazas = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/razas');
        if (!response.ok) {
          throw new Error('Error al cargar las razas');
        }
        const data = await response.json();
        // Filtrar solo las razas de tipo pollo
        const razasPollo = data.filter((raza: Raza) => raza.tipo_animal === 'pollo');
        setRazas(razasPollo);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las razas",
          variant: "destructive",
        });
      }
    };

    fetchRazas();
  }, []);

  const fetchLotes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('Intentando cargar lotes con token:', token); // Debug

      const response = await fetch('http://localhost:3001/api/lotes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Respuesta del servidor (lotes):', data); // Debug

      if (!response.ok) {
        throw new Error(data.message || 'Error al cargar los lotes');
      }

      // Verificar que data es un array
      if (!Array.isArray(data)) {
        console.error('Datos recibidos no son un array:', data);
        throw new Error('Formato de datos inválido');
      }

      setLotes(data);
    } catch (error) {
      console.error('Error detallado al cargar lotes:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron cargar los lotes",
        variant: "destructive",
      });
    }
  };

  // Usar fetchLotes en useEffect
  useEffect(() => {
    fetchLotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Validar que todos los campos tengan valores válidos
      if (!formData.nombre || !formData.cantidad || !formData.raza_id || 
          !formData.fecha_estimada_salida) {
        throw new Error('Todos los campos son requeridos');
      }

      const loteData = {
        nombre: formData.nombre.trim(),
        cantidad: parseInt(formData.cantidad),
        raza_id: parseInt(formData.raza_id),
        fecha_estimada_salida: formData.fecha_estimada_salida,
        observaciones: formData.observaciones || ''
      };

      console.log('Datos a enviar:', loteData);

      const response = await fetch('http://localhost:3001/api/lotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(loteData)
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        if (data.error === 'DUPLICATE_LOTE') {
          toast({
            title: "Error",
            description: `Ya existe un lote con el nombre "${data.nombreExistente}"`,
            variant: "destructive",
          });
          return;
        }
        throw new Error(data.message || 'Error al crear el lote');
      }

      // Cerrar el modal y limpiar el formulario
      setIsOpen(false);
      setFormData({
        nombre: '',
        cantidad: '',
        raza_id: '',
        fecha_estimada_salida: new Date().toISOString().split('T')[0],
        observaciones: ''
      });

      // Recargar los lotes inmediatamente después de crear uno nuevo
      await fetchLotes();

      toast({
        title: "Éxito",
        description: "Lote registrado exitosamente",
      });
    } catch (error) {
      console.error('Error completo:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear el lote",
        variant: "destructive",
      });
    }
  };

  if (selectedLote) {
    return (
      <SeguimientoLote
        loteId={selectedLote.id}
        loteName={selectedLote.nombre}
        cantidadInicial={selectedLote.cantidad_inicial}
        fechaAdquisicion={selectedLote.fecha_estimada_salida}
        onBack={() => setSelectedLote(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión de Lotes</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Lote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLote ? 'Editar Lote' : 'Registrar Nuevo Lote'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Lote</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cantidad">Cantidad de Aves</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      value={formData.cantidad}
                      onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="fecha_estimada_salida">Fecha de Adquisición</Label>
                    <Input
                      id="fecha_estimada_salida"
                      type="date"
                      value={formData.fecha_estimada_salida}
                      onChange={(e) => setFormData({ ...formData, fecha_estimada_salida: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Input
                      id="observaciones"
                      value={formData.observaciones}
                      onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="raza">Raza</Label>
                    <Select
                      value={formData.raza_id}
                      onValueChange={(value) => setFormData({ ...formData, raza_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una raza" />
                      </SelectTrigger>
                      <SelectContent>
                        {razas.map((raza) => (
                          <SelectItem key={raza.id} value={raza.id.toString()}>
                            {raza.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingLote ? 'Actualizar Lote' : 'Crear Lote'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Raza</TableHead>
              <TableHead>Fecha Adquisición</TableHead>
              <TableHead>Observaciones</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lotes.map((lote) => (
              <TableRow key={lote.id}>
                <TableCell>{lote.nombre}</TableCell>
                <TableCell>{lote.cantidad_inicial}</TableCell>
                <TableCell>{lote.raza_nombre}</TableCell>
                <TableCell>
                  {new Date(lote.fecha_estimada_salida).toLocaleDateString()}
                </TableCell>
                <TableCell>{lote.observaciones}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    lote.estado === 'activo' ? 'bg-green-100 text-green-800' :
                    lote.estado === 'finalizado' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {lote.estado}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingLote(lote);
                        setFormData({
                          nombre: lote.nombre,
                          cantidad: lote.cantidad_inicial.toString(),
                          raza_id: lote.raza_id.toString(),
                          fecha_estimada_salida: lote.fecha_estimada_salida,
                          observaciones: lote.observaciones
                        });
                        setIsOpen(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de eliminar este lote?')) {
                          setLotes(lotes.filter(l => l.id !== lote.id));
                          toast({
                            title: "Lote eliminado",
                            description: "El lote ha sido eliminado exitosamente",
                          });
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLote(lote)}
                    >
                      <LineChart className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 