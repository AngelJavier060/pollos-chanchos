'use client';

import { useState, useEffect } from 'react';
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

// Función para cargar datos del localStorage
const loadLotesFromStorage = () => {
  if (typeof window !== 'undefined') {
    const savedLotes = localStorage.getItem('lotes');
    return savedLotes ? JSON.parse(savedLotes) : [];
  }
  return [];
};

// Función para guardar datos en localStorage
const saveLotesToStorage = (lotes: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lotes', JSON.stringify(lotes));
  }
};

const LotesView = () => {
  const [lotes, setLotes] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingLote, setEditingLote] = useState<any>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    const savedLotes = loadLotesFromStorage();
    setLotes(savedLotes);
  }, []);

  // Guardar datos cuando cambian
  useEffect(() => {
    saveLotesToStorage(lotes);
  }, [lotes]);

  const handleSubmit = async (formData: any) => {
    try {
      if (editingLote) {
        console.log('Actualizando lote:', formData);
        const updatedLotes = lotes.map(lote => 
          lote.id === editingLote.id ? { ...formData, id: lote.id } : lote
        );
        setLotes(updatedLotes);
      } else {
        console.log('Creando nuevo lote:', formData);
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

  const handleEdit = (lote: any) => {
    console.log('Editando lote:', lote);
    setEditingLote(lote);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const updatedLotes = lotes.filter(lote => lote.id !== id);
      setLotes(updatedLotes);
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
        onEdit={handleEdit}
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
