'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Producto, TipoProducto, TipoAnimal } from '../../types/inventario';
import { toast } from "@/app/components/ui/use-toast";

interface ProductoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Producto | null;
  onSubmit: (data: any) => Promise<void>;
}

export default function ProductoForm({
  open,
  onOpenChange,
  initialData,
  onSubmit
}: ProductoFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    detalle: '',
    tipo: 'alimento' as TipoProducto,
    tipo_animal: '' as TipoAnimal,
    cantidad: '',
    unidad_medida: '',
    precio_unitario: '',
    proveedor: '',
    numero_factura: '',
    fecha_compra: '',
    nivel_minimo: '',
    nivel_critico: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id.toString(),
        nombre: initialData.nombre,
        detalle: initialData.detalle || '',
        tipo: initialData.tipo,
        tipo_animal: initialData.tipo_animal,
        cantidad: initialData.cantidad.toString(),
        unidad_medida: initialData.unidad_medida,
        precio_unitario: initialData.precio_unitario.toString(),
        proveedor: initialData.proveedor,
        numero_factura: initialData.numero_factura,
        fecha_compra: initialData.fecha_compra,
        nivel_minimo: initialData.nivel_minimo.toString(),
        nivel_critico: initialData.nivel_critico.toString()
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData = {
        nombre: formData.nombre,
        detalle: formData.detalle,
        tipo: formData.tipo,
        tipo_animal: formData.tipo_animal,
        cantidad: Number(formData.cantidad),
        unidad_medida: formData.unidad_medida,
        precio_unitario: Number(formData.precio_unitario),
        proveedor: formData.proveedor,
        numero_factura: formData.numero_factura,
        fecha_compra: formData.fecha_compra,
        nivel_minimo: Number(formData.nivel_minimo),
        nivel_critico: Number(formData.nivel_critico)
      };

      await onSubmit(updateData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error en el formulario:', error);
      toast({
        title: "Error",
        description: "Error al procesar el formulario",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Detalle</Label>
              <Input
                value={formData.detalle}
                onChange={(e) => setFormData(prev => ({ ...prev, detalle: e.target.value }))}
                placeholder="Descripción breve del producto"
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: TipoProducto) => 
                  setFormData(prev => ({ ...prev, tipo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alimento">Alimento</SelectItem>
                  <SelectItem value="medicina">Medicina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Para</Label>
              <Select
                value={formData.tipo_animal}
                onValueChange={(value: TipoAnimal) => 
                  setFormData(prev => ({ ...prev, tipo_animal: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar animal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pollos">Pollos</SelectItem>
                  <SelectItem value="chanchos">Chanchos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cantidad</Label>
              <Input
                type="number"
                value={formData.cantidad}
                onChange={(e) => setFormData(prev => ({ ...prev, cantidad: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Unidad de Medida</Label>
              <Input
                value={formData.unidad_medida}
                onChange={(e) => setFormData(prev => ({ ...prev, unidad_medida: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Precio Unitario</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.precio_unitario}
              onChange={(e) => setFormData(prev => ({ ...prev, precio_unitario: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Proveedor</Label>
            <Input
              value={formData.proveedor}
              onChange={(e) => setFormData(prev => ({ ...prev, proveedor: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Número de Factura</Label>
            <Input
              value={formData.numero_factura}
              onChange={(e) => setFormData(prev => ({ ...prev, numero_factura: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha de Compra</Label>
            <Input
              type="date"
              value={formData.fecha_compra}
              onChange={(e) => setFormData(prev => ({ ...prev, fecha_compra: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nivel Mínimo</Label>
              <Input
                type="number"
                value={formData.nivel_minimo}
                onChange={(e) => setFormData(prev => ({ ...prev, nivel_minimo: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Nivel Crítico</Label>
              <Input
                type="number"
                value={formData.nivel_critico}
                onChange={(e) => setFormData(prev => ({ ...prev, nivel_critico: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 