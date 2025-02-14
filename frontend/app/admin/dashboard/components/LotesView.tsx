'use client';

import { useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Plus } from 'lucide-react';
import LoteForm from './LoteForm';
import LotesTable from './LotesTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";

const LotesView = () => {
  const [lotes, setLotes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingLote, setEditingLote] = useState<any>(null);

  const handleSubmit = async (formData: any) => {
    try {
      if (editingLote) {
        setLotes(lotes.map(lote => 
          lote.id === editingLote.id ? { ...formData, id: lote.id } : lote
        ));
      } else {
        const newLote = {
          ...formData,
          id: Date.now()
        };
        setLotes([...lotes, newLote]);
      }
      setIsOpen(false);
      setEditingLote(null);
    } catch (error) {
      console.error('Error al guardar lote:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLotes(lotes.filter(lote => lote.id !== id));
    } catch (error) {
      console.error('Error al eliminar lote:', error);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex justify-between items-center">
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

      <LotesTable 
        lotes={lotes}
        onEdit={(lote) => {
          setEditingLote(lote);
          setIsOpen(true);
        }}
        onDelete={handleDelete}
      />

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
            initialData={editingLote}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsOpen(false);
              setEditingLote(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { LotesView };
