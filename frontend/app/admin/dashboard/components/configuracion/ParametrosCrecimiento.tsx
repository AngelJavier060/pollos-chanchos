'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ParametroCrecimiento, Raza } from '../types/configuracion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { toast } from "@/app/components/ui/use-toast";
import { api } from '@/app/lib/api';

interface ParametrosCrecimientoProps {
  razas: Raza[];
}

const ParametrosCrecimiento: FC<ParametrosCrecimientoProps> = ({ razas }) => {
  const [parametros, setParametros] = useState<ParametroCrecimiento[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRaza, setSelectedRaza] = useState<number>(0);
  const [editingParametro, setEditingParametro] = useState<ParametroCrecimiento | null>(null);
  const [formData, setFormData] = useState({
    razaId: 0,
    edad: 0,
    pesoMinimo: 0,
    pesoMaximo: 0,
    alturaMinima: 0,
    alturaMaxima: 0,
    observaciones: ''
  });

  useEffect(() => {
    if (selectedRaza) {
      cargarParametros(selectedRaza);
    }
  }, [selectedRaza]);

  const cargarParametros = async (razaId: number) => {
    try {
      const response = await api.get(`/api/parametros-crecimiento/${razaId}`);
      setParametros(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los parámetros",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingParametro) {
        const response = await api.put(
          `/api/parametros-crecimiento/${editingParametro.id}`,
          formData
        );
        setParametros(params => 
          params.map(p => p.id === editingParametro.id ? response : p)
        );
      } else {
        const response = await api.post('/api/parametros-crecimiento', formData);
        setParametros([...parametros, response]);
      }
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el parámetro",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/parametros-crecimiento/${id}`);
      setParametros(params => params.filter(p => p.id !== id));
      toast({
        title: "Éxito",
        description: "Parámetro eliminado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el parámetro",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      razaId: selectedRaza,
      edad: 0,
      pesoMinimo: 0,
      pesoMaximo: 0,
      alturaMinima: 0,
      alturaMaxima: 0,
      observaciones: ''
    });
    setEditingParametro(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Parámetros de Crecimiento</h3>
        <div className="flex space-x-4">
          <Select
            value={selectedRaza.toString()}
            onValueChange={(value) => setSelectedRaza(Number(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar Raza" />
            </SelectTrigger>
            <SelectContent>
              {razas.map((raza) => (
                <SelectItem key={raza.id} value={raza.id.toString()}>
                  {raza.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsOpen(true)} disabled={!selectedRaza}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Parámetro
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Edad (días)</Label>
                <Input
                  type="number"
                  value={formData.edad}
                  onChange={(e) => setFormData(prev => ({ ...prev, edad: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Peso Mínimo (kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.pesoMinimo}
                  onChange={(e) => setFormData(prev => ({ ...prev, pesoMinimo: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Peso Máximo (kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.pesoMaximo}
                  onChange={(e) => setFormData(prev => ({ ...prev, pesoMaximo: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Altura Mínima (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.alturaMinima}
                  onChange={(e) => setFormData(prev => ({ ...prev, alturaMinima: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Altura Máxima (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.alturaMaxima}
                  onChange={(e) => setFormData(prev => ({ ...prev, alturaMaxima: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Observaciones</Label>
                <Input
                  value={formData.observaciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                />
              </div>
            </div>
            <Button type="submit">
              {editingParametro ? 'Actualizar' : 'Crear'} Parámetro
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {selectedRaza ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parametros.map((parametro) => (
            <Card key={parametro.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Día {parametro.edad}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingParametro(parametro);
                      setFormData({
                        razaId: parametro.razaId,
                        edad: parametro.edad,
                        pesoMinimo: parametro.pesoMinimo,
                        pesoMaximo: parametro.pesoMaximo,
                        alturaMinima: parametro.alturaMinima,
                        alturaMaxima: parametro.alturaMaxima,
                        observaciones: parametro.observaciones || ''
                      });
                      setIsOpen(true);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(parametro.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm">
                    Peso: {parametro.pesoMinimo} - {parametro.pesoMaximo} kg
                  </p>
                  <p className="text-sm">
                    Altura: {parametro.alturaMinima} - {parametro.alturaMaxima} cm
                  </p>
                  {parametro.observaciones && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {parametro.observaciones}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          Seleccione una raza para ver sus parámetros de crecimiento
        </div>
      )}
    </div>
  );
};

export default ParametrosCrecimiento; 