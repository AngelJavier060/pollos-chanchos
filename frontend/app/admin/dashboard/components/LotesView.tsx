'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/app/components/ui/button";
import { Plus, ListPlus, Info } from 'lucide-react';
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
  try {
    if (typeof window !== 'undefined') {
      const savedLotes = localStorage.getItem('lotes');
      return savedLotes ? JSON.parse(savedLotes) : [];
    }
    return [];
  } catch (error) {
    console.error('Error al cargar datos:', error);
    return [];
  }
};

// Función para guardar datos en localStorage
const saveLotesToStorage = (lotes: any[]) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lotes', JSON.stringify(lotes));
    }
  } catch (error) {
    console.error('Error al guardar datos:', error);
  }
};

const LotesView = () => {
  const [lotes, setLotes] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingLote, setEditingLote] = useState<any>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    const savedLotes = loadLotesFromStorage();
    if (savedLotes && savedLotes.length > 0) {
      setLotes(savedLotes);
    }
  }, []);

  // Guardar datos cuando cambian
  useEffect(() => {
    if (lotes.length > 0) {
      saveLotesToStorage(lotes);
    }
  }, [lotes]);

  const handleSubmit = async (formData: any) => {
    try {
      const timestamp = Date.now();
      if (editingLote) {
        // Actualizar lote existente
        const updatedLotes = lotes.map(lote => 
          lote.id === editingLote.id 
            ? { 
                ...formData, 
                id: lote.id,
                updatedAt: timestamp 
              } 
            : lote
        );
        setLotes(updatedLotes);
        saveLotesToStorage(updatedLotes); // Guardar inmediatamente
      } else {
        // Crear nuevo lote
        const newLote = {
          ...formData,
          id: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        const newLotes = [...lotes, newLote];
        setLotes(newLotes);
        saveLotesToStorage(newLotes); // Guardar inmediatamente
      }
      setIsOpen(false);
      setEditingLote(null);
    } catch (error) {
      console.error('Error al guardar lote:', error);
      alert('Error al guardar los datos. Por favor, intente nuevamente.');
    }
  };

  const handleEdit = (lote: any) => {
    console.log('Editando lote:', lote);
    setEditingLote(lote);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      if (confirm('¿Está seguro de que desea eliminar este lote?')) {
        const updatedLotes = lotes.filter(lote => lote.id !== id);
        setLotes(updatedLotes);
        saveLotesToStorage(updatedLotes); // Guardar inmediatamente
      }
    } catch (error) {
      console.error('Error al eliminar lote:', error);
      alert('Error al eliminar el lote. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Registro de Lotes
          </h2>
          <p className="mt-1 text-gray-600">
            Gestiona los lotes de pollos y chanchos de la granja
          </p>
        </div>

        <Button 
          onClick={() => {
            setEditingLote(null);
            setIsOpen(true);
          }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-sm transition-all duration-200 hover:shadow flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Lote
        </Button>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
          <Info className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            Aquí puedes ver y gestionar todos los lotes de animales registrados en el sistema.
          </p>
        </div>

        <LotesTable 
          lotes={lotes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingLote ? 'Editar Lote' : 'Crear Nuevo Lote'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Complete el formulario para {editingLote ? 'editar el' : 'crear un nuevo'} lote.
              Todos los campos marcados con * son obligatorios.
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
