'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { toast } from "@/app/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Raza } from '../types/raza';

interface RegistroRazasProps {}

const RegistroRazas: FC<RegistroRazasProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [razas, setRazas] = useState<Raza[]>([
    {
      id: 1,
      nombre: 'Pollo Broiler',
      tipo_animal: 'pollo',
      peso_promedio: 3.5,
      tamanio_promedio: 40,
      edad_madurez: 4,
      tiempo_crecimiento: 4,
      descripcion: 'Raza de pollo de rápido crecimiento',
      imagen_url: ''
    }
  ]);
  const [editingRaza, setEditingRaza] = useState<Raza | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_animal: 'pollo',
    peso_promedio: '',
    tamanio_promedio: '',
    edad_madurez: '',
    tiempo_crecimiento: '',
    descripcion: '',
    imagen_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const razaData = {
        nombre: formData.nombre,
        tipo_animal: formData.tipo_animal,
        peso_promedio: parseFloat(formData.peso_promedio),
        tamanio_promedio: parseFloat(formData.tamanio_promedio),
        edad_madurez: parseInt(formData.edad_madurez),
        tiempo_crecimiento: parseInt(formData.tiempo_crecimiento),
        descripcion: formData.descripcion,
        imagen_url: formData.imagen_url
      };

      const url = editingRaza 
        ? `http://localhost:3001/api/razas/${editingRaza.id}`
        : 'http://localhost:3001/api/razas';

      const response = await fetch(url, {
        method: editingRaza ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(razaData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la raza');
      }

      const data = await response.json();
      
      if (editingRaza) {
        setRazas(razas.map(raza => raza.id === editingRaza.id ? data.raza : raza));
      } else {
        setRazas([...razas, data.raza]);
      }

      setIsOpen(false);
      setEditingRaza(null);
      setFormData({
        nombre: '',
        tipo_animal: 'pollo',
        peso_promedio: '',
        tamanio_promedio: '',
        edad_madurez: '',
        tiempo_crecimiento: '',
        descripcion: '',
        imagen_url: ''
      });

      toast({
        title: editingRaza ? "Raza actualizada" : "Raza registrada",
        description: editingRaza 
          ? "La raza ha sido actualizada exitosamente"
          : "La raza ha sido registrada exitosamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al procesar la raza",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (raza: Raza) => {
    setEditingRaza(raza);
    setFormData({
      nombre: raza.nombre,
      tipo_animal: raza.tipo_animal,
      peso_promedio: raza.peso_promedio.toString(),
      tamanio_promedio: raza.tamanio_promedio.toString(),
      edad_madurez: raza.edad_madurez.toString(),
      tiempo_crecimiento: raza.tiempo_crecimiento.toString(),
      descripcion: raza.descripcion || '',
      imagen_url: raza.imagen_url || ''
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta raza?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/razas/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la raza');
        }

        setRazas(razas.filter(raza => raza.id !== id));
        toast({
          title: "Raza eliminada",
          description: "La raza ha sido eliminada exitosamente",
        });
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar la raza",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    const fetchRazas = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/razas');
        if (!response.ok) {
          throw new Error('Error al cargar las razas');
        }
        const data = await response.json();
        setRazas(data);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión de Razas</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingRaza(null);
              setFormData({
                nombre: '',
                tipo_animal: 'pollo',
                peso_promedio: '',
                tamanio_promedio: '',
                edad_madurez: '',
                tiempo_crecimiento: '',
                descripcion: '',
                imagen_url: ''
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Raza
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRaza ? 'Editar Raza' : 'Registrar Nueva Raza'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Raza</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoAnimal">Tipo de Animal</Label>
                <select
                  id="tipoAnimal"
                  value={formData.tipo_animal}
                  onChange={(e) => setFormData({ ...formData, tipo_animal: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="pollo">Pollo</option>
                  <option value="chancho">Cerdo</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pesoPromedio">Peso Promedio (kg)</Label>
                  <Input
                    id="pesoPromedio"
                    type="number"
                    step="0.1"
                    value={formData.peso_promedio}
                    onChange={(e) => setFormData({ ...formData, peso_promedio: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tamanioPromedio">Tamaño Promedio (cm)</Label>
                  <Input
                    id="tamanioPromedio"
                    type="number"
                    value={formData.tamanio_promedio}
                    onChange={(e) => setFormData({ ...formData, tamanio_promedio: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edadMadurez">Edad de Madurez (meses)</Label>
                  <Input
                    id="edadMadurez"
                    type="number"
                    step="0.5"
                    value={formData.edad_madurez}
                    onChange={(e) => setFormData({ ...formData, edad_madurez: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tiempoCrecimiento">Tiempo de Crecimiento (meses)</Label>
                  <Input
                    id="tiempoCrecimiento"
                    type="number"
                    step="0.5"
                    value={formData.tiempo_crecimiento}
                    onChange={(e) => setFormData({ ...formData, tiempo_crecimiento: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full border rounded-md p-2 min-h-[100px]"
                  placeholder="Características especiales de la raza..."
                />
              </div>

              <div>
                <Label htmlFor="imagen">URL de la Imagen (opcional)</Label>
                <Input
                  id="imagen"
                  value={formData.imagen_url}
                  onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <Button type="submit" className="w-full">
                {editingRaza ? 'Actualizar Raza' : 'Registrar Raza'}
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
              <TableHead>Tipo</TableHead>
              <TableHead>Peso Promedio</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead>Madurez</TableHead>
              <TableHead>Tiempo Crecimiento</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {razas.map((raza) => (
              <TableRow key={raza.id}>
                <TableCell>{raza.nombre}</TableCell>
                <TableCell>{raza.tipo_animal === 'pollo' ? 'Pollo' : 'Cerdo'}</TableCell>
                <TableCell>{raza.peso_promedio} kg</TableCell>
                <TableCell>{raza.tamanio_promedio} cm</TableCell>
                <TableCell>{raza.edad_madurez} meses</TableCell>
                <TableCell>{raza.tiempo_crecimiento} meses</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(raza)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(raza.id)}>
                      <Trash2 className="w-4 h-4" />
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
};

export default RegistroRazas; 