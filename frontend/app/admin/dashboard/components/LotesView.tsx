'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/app/components/ui/button";
import { Plus } from 'lucide-react';
import { api } from '@/app/lib/api';
import { toast } from "@/app/components/ui/use-toast";
import { Lote } from '../types/lote';
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
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingLote, setEditingLote] = useState<Lote | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLotes = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/lotes');
      setLotes(data);
    } catch (error) {
      console.error('Error al cargar lotes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los lotes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLotes();
  }, []);

  const handleSubmit = async (formData: Partial<Lote>) => {
    try {
      if (editingLote) {
        await api.put(`/api/lotes/${editingLote.id}`, formData);
        toast({
          title: "Éxito",
          description: "Lote actualizado correctamente",
        });
      } else {
        await api.post('/api/lotes', formData);
        toast({
          title: "Éxito",
          description: "Lote creado correctamente",
        });
      }
      setIsOpen(false);
      setEditingLote(null);
      fetchLotes();
    } catch (error) {
      console.error('Error al guardar lote:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el lote",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (lote: Lote) => {
    setEditingLote(lote);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/lotes/${id}`);
      toast({
        title: "Éxito",
        description: "Lote eliminado correctamente",
      });
      fetchLotes();
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Registro de Lotes</h2>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Lote
        </Button>
      </div>

      <LotesTable
        lotes={lotes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLote ? 'Editar Lote' : 'Crear Nuevo Lote'}</DialogTitle>
            <DialogDescription>
              Complete el formulario para {editingLote ? 'actualizar el' : 'crear un nuevo'} lote.
            </DialogDescription>
          </DialogHeader>
          <LoteForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsOpen(false);
              setEditingLote(null);
            }}
            initialData={editingLote || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { LotesView };
