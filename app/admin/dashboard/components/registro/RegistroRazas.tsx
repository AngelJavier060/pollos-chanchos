'use client';

import { FC, useState } from 'react';
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
      tipoAnimal: 'pollo',
      pesoPromedio: 3.5,
      tamanioPromedio: 40,
      edadMadurez: 4,
      tiempoCrecimiento: 4,
      descripcion: 'Raza de pollo de rápido crecimiento',
      imagen: ''
    }
  ]);
  const [editingRaza, setEditingRaza] = useState<Raza | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipoAnimal: 'pollo',
    pesoPromedio: '',
    tamanioPromedio: '',
    edadMadurez: '',
    tiempoCrecimiento: '',
    descripcion: '',
    imagen: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const razaData = {
      id: editingRaza?.id || Date.now(),
      nombre: formData.nombre,
      tipoAnimal: formData.tipoAnimal as 'pollo' | 'cerdo',
      pesoPromedio: parseFloat(formData.pesoPromedio),
      tamanioPromedio: parseFloat(formData.tamanioPromedio),
      edadMadurez: parseFloat(formData.edadMadurez),
      tiempoCrecimiento: parseFloat(formData.tiempoCrecimiento),
      descripcion: formData.descripcion,
      imagen: formData.imagen
    };

    if (editingRaza) {
      setRazas(razas.map(raza => raza.id === editingRaza.id ? razaData : raza));
      toast({
        title: "Raza actualizada",
        description: "La raza ha sido actualizada exitosamente",
      });
    } else {
      setRazas([...razas, razaData]);
      toast({
        title: "Raza registrada",
        description: "La raza ha sido registrada exitosamente",
      });
    }

    setIsOpen(false);
    setEditingRaza(null);
    setFormData({
      nombre: '',
      tipoAnimal: 'pollo',
      pesoPromedio: '',
      tamanioPromedio: '',
      edadMadurez: '',
      tiempoCrecimiento: '',
      descripcion: '',
      imagen: ''
    });
  };

  const handleEdit = (raza: Raza) => {
    setEditingRaza(raza);
    setFormData({
      nombre: raza.nombre,
      tipoAnimal: raza.tipoAnimal,
      pesoPromedio: raza.pesoPromedio.toString(),
      tamanioPromedio: raza.tamanioPromedio.toString(),
      edadMadurez: raza.edadMadurez.toString(),
      tiempoCrecimiento: raza.tiempoCrecimiento.toString(),
      descripcion: raza.descripcion || '',
      imagen: raza.imagen || ''
    });
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    setRazas(razas.filter(raza => raza.id !== id));
    toast({
      title: "Raza eliminada",
      description: "La raza ha sido eliminada exitosamente",
    });
  };

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
                tipoAnimal: 'pollo',
                pesoPromedio: '',
                tamanioPromedio: '',
                edadMadurez: '',
                tiempoCrecimiento: '',
                descripcion: '',
                imagen: ''
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
              <div>
                <Label htmlFor="nombre">Nombre de la Raza</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Pollo Broiler"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tipoAnimal">Tipo de Animal</Label>
                <select
                  id="tipoAnimal"
                  value={formData.tipoAnimal}
                  onChange={(e) => setFormData({ ...formData, tipoAnimal: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="pollo">Pollo</option>
                  <option value="cerdo">Cerdo</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pesoPromedio">Peso Promedio (kg)</Label>
                  <Input
                    id="pesoPromedio"
                    type="number"
                    step="0.1"
                    value={formData.pesoPromedio}
                    onChange={(e) => setFormData({ ...formData, pesoPromedio: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tamanioPromedio">Tamaño Promedio (cm)</Label>
                  <Input
                    id="tamanioPromedio"
                    type="number"
                    value={formData.tamanioPromedio}
                    onChange={(e) => setFormData({ ...formData, tamanioPromedio: e.target.value })}
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
                    value={formData.edadMadurez}
                    onChange={(e) => setFormData({ ...formData, edadMadurez: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tiempoCrecimiento">Tiempo de Crecimiento (meses)</Label>
                  <Input
                    id="tiempoCrecimiento"
                    type="number"
                    step="0.5"
                    value={formData.tiempoCrecimiento}
                    onChange={(e) => setFormData({ ...formData, tiempoCrecimiento: e.target.value })}
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
                  value={formData.imagen}
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
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
                <TableCell>{raza.tipoAnimal}</TableCell>
                <TableCell>{raza.pesoPromedio} kg</TableCell>
                <TableCell>{raza.tamanioPromedio} cm</TableCell>
                <TableCell>{raza.edadMadurez} meses</TableCell>
                <TableCell>{raza.tiempoCrecimiento} meses</TableCell>
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