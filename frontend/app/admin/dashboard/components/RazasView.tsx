'use client';

import { useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Plus } from 'lucide-react';
import { toast } from "@/app/components/ui/use-toast";
import LoteForm from './LoteForm';
import LotesTable from './LotesTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";

// Datos de prueba para desarrollo frontend
const datosLotePrueba = [
  {
    id: 1,
    nombre: 'LOTE-2025-001',
    tipo_animal: 'pollo',
    cantidad: 100,
    fecha_nacimiento: '2025-02-13',
    costo: 500.00
  },
  {
    id: 2,
    nombre: 'LOTE-2025-002',
    tipo_animal: 'chancho',
    cantidad: 50,
    fecha_nacimiento: '2025-02-12',
    costo: 1500.00
  }
];

const LotesView = () => {
  const [lotes, setLotes] = useState(datosLotePrueba);
  const [isOpen, setIsOpen] = useState(false);
  const [editingLote, setEditingLote] = useState<any>(null);

  const handleSubmit = async (formData: any) => {
    try {
      if (editingLote) {
        // Simulación de actualización
        setLotes(lotes.map(lote => 
          lote.id === editingLote.id ? { ...formData, id: lote.id } : lote
        ));
        toast({
          title: "Éxito",
          description: "Lote actualizado correctamente",
        });
      } else {
        // Simulación de creación
        const newLote = {
          ...formData,
          id: lotes.length + 1,
          nombre: `LOTE-2025-${String(lotes.length + 1).padStart(3, '0')}`
        };
        setLotes([...lotes, newLote]);
        toast({
          title: "Éxito",
          description: "Lote creado correctamente",
        });
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error al guardar lote:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el lote",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este lote?')) return;

    try {
      // Simulación de eliminación
      setLotes(lotes.filter(lote => lote.id !== id));
      toast({
        title: "Éxito",
        description: "Lote eliminado correctamente",
      });
    } catch (error) {
      console.error('Error al eliminar lote:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el lote",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Registro de Lotes</h2>
        <Button 
          onClick={() => {
            setEditingLote(null);
            setIsOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Lote
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingLote ? 'Editar Lote' : 'Crear Nuevo Lote'}
            </DialogTitle>
            <DialogDescription>
              Complete el formulario para {editingLote ? 'editar el' : 'crear un nuevo'} lote.
            </DialogDescription>
          </DialogHeader>
          <LoteForm
            onSubmit={handleSubmit}
            initialData={editingLote}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-lg shadow">
        <LotesTable
          lotes={lotes}
          onEdit={(lote) => {
            setEditingLote(lote);
            setIsOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export { LotesView };