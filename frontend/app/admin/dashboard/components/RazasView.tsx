'use client';

import { useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Plus } from 'lucide-react';
import { toast } from "@/app/components/ui/use-toast";
import RazaForm from './RazaForm';
import RazasTable from './RazasTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";

// Datos de prueba para desarrollo frontend
const datosRazaPrueba = [
  // Razas de pollos
  {
    id: 1,
    nombre: 'Ross 308',
    tipo_animal: 'pollo',
    descripcion: 'Pollo de engorde de rápido crecimiento',
    tiempo_promedio_produccion: 42
  },
  {
    id: 2,
    nombre: 'Cobb 500',
    tipo_animal: 'pollo',
    descripcion: 'Alta eficiencia en conversión alimenticia',
    tiempo_promedio_produccion: 45
  },
  {
    id: 3,
    nombre: 'Hubbard',
    tipo_animal: 'pollo',
    descripcion: 'Excelente rendimiento en carne',
    tiempo_promedio_produccion: 40
  },
  // Razas de chanchos
  {
    id: 4,
    nombre: 'Landrace',
    tipo_animal: 'chancho',
    descripcion: 'Excelente producción de carne magra',
    tiempo_promedio_produccion: 180
  },
  {
    id: 5,
    nombre: 'Yorkshire',
    tipo_animal: 'chancho',
    descripcion: 'Alta prolificidad y buena madre',
    tiempo_promedio_produccion: 175
  },
  {
    id: 6,
    nombre: 'Duroc',
    tipo_animal: 'chancho',
    descripcion: 'Carne de alta calidad y buen crecimiento',
    tiempo_promedio_produccion: 170
  }
];

const RazasView = () => {
  const [razas, setRazas] = useState(datosRazaPrueba);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRaza, setEditingRaza] = useState<any>(null);

  const handleSubmit = async (formData: any) => {
    try {
      if (editingRaza) {
        // Simulación de actualización
        setRazas(razas.map(raza => 
          raza.id === editingRaza.id ? { ...formData, id: raza.id } : raza
        ));
        toast({
          title: "Éxito",
          description: "Raza actualizada correctamente",
        });
      } else {
        // Simulación de creación
        const newRaza = {
          ...formData,
          id: razas.length + 1,
        };
        setRazas([...razas, newRaza]);
        toast({
          title: "Éxito",
          description: "Raza creada correctamente",
        });
      }
      setIsOpen(false);
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
      // Simulación de eliminación
      setRazas(razas.filter(raza => raza.id !== id));
      toast({
        title: "Éxito",
        description: "Raza eliminada correctamente",
      });
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Registro de Razas</h2>
        <Button 
          onClick={() => {
            setEditingRaza(null);
            setIsOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Raza
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
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

      <div className="bg-white rounded-lg shadow">
        <RazasTable
          razas={razas}
          onEdit={(raza) => {
            setEditingRaza(raza);
            setIsOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export { RazasView };