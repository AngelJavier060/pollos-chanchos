'use client';

import { FC, useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { toast } from "@/app/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Plus } from "lucide-react";
import { Lote } from '../types/registro';

interface RegistroLotesProps {}

const RegistroLotes: FC<RegistroLotesProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    tipoAnimal: 'pollo',
    cantidad: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLote: Lote = {
      id: Date.now(),
      nombre: formData.nombre,
      tipoAnimal: formData.tipoAnimal as 'pollo' | 'cerdo',
      cantidad: parseInt(formData.cantidad),
      fechaCreacion: new Date().toISOString(),
    };

    setLotes([...lotes, newLote]);
    setIsOpen(false);
    setFormData({ nombre: '', tipoAnimal: 'pollo', cantidad: '' });
    
    toast({
      title: "Lote registrado",
      description: "El lote ha sido registrado exitosamente",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Registro de Lotes</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Lote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Lote</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre del Lote</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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

              <div>
                <Label htmlFor="cantidad">Cantidad de Animales</Label>
                <Input
                  id="cantidad"
                  type="number"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Registrar Lote
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
              <TableHead>Cantidad</TableHead>
              <TableHead>Fecha de Creación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lotes.map((lote) => (
              <TableRow key={lote.id}>
                <TableCell>{lote.nombre}</TableCell>
                <TableCell>{lote.tipoAnimal}</TableCell>
                <TableCell>{lote.cantidad}</TableCell>
                <TableCell>
                  {new Date(lote.fechaCreacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RegistroLotes; 