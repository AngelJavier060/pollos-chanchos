'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/app/components/ui/button";
import { Plus } from 'lucide-react';
import { api } from '@/app/lib/api';
import { toast } from "@/app/components/ui/use-toast";
import { Raza } from '../types/raza';
import RazaForm from './RazaForm';
import RazasTable from './RazasTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";

const RazasView = () => {
  const [razas, setRazas] = useState<Raza[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRaza, setEditingRaza] = useState<Raza | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRazas = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/razas');
      setRazas(data);
    } catch (error) {
      console.error('Error al cargar razas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las razas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRazas();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editingRaza) {
        await api.put(`/api/razas/${editingRaza.id}`, formData, true);
        toast({
          title: "Éxito",
          description: "Raza actualizada correctamente",
        });
      } else {
        await api.post('/api/razas', formData, true);
        toast({
          title: "Éxito",
          description: "Raza creada correctamente",
        });
      }
      setIsOpen(false);
      fetchRazas();
    } catch (error) {
      console.error('Error al guardar raza:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la raza",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta raza?')) return;

    try {
      await api.delete(`/api/razas/${id}`);
      toast({
        title: "Éxito",
        description: "Raza eliminada correctamente",
      });
      fetchRazas();
    } catch (error) {
      console.error('Error al eliminar raza:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la raza",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestión de Razas</h2>
        <Button onClick={() => {
          setEditingRaza(null);
          setIsOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Raza
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRaza ? 'Editar Raza' : 'Crear Nueva Raza'}
            </DialogTitle>
            <DialogDescription>
              Complete el formulario para {editingRaza ? 'editar la' : 'crear una nueva'} raza.
            </DialogDescription>
          </DialogHeader>
          <RazaForm
            onSubmit={handleSubmit}
            initialData={editingRaza}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="text-center py-4">Cargando razas...</div>
      ) : (
        <RazasTable
          razas={razas}
          onEdit={(raza) => {
            setEditingRaza(raza);
            setIsOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export { RazasView }; 