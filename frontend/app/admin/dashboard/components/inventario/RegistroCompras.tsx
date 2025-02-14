'use client';

import { useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Producto, TipoProducto, TipoAnimal } from '../../types/inventario';
import { api } from '@/app/lib/api';
import { toast } from "@/app/components/ui/use-toast";

export default function RegistroCompras() {
  const [formData, setFormData] = useState({
    nombre: '',
    detalle: '',
    tipo: '' as TipoProducto,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/inventario/productos', {
        ...formData,
        cantidad: Number(formData.cantidad),
        precio_unitario: Number(formData.precio_unitario),
        nivel_minimo: Number(formData.nivel_minimo),
        nivel_critico: Number(formData.nivel_critico),
        fecha_compra: formData.fecha_compra || new Date().toISOString().split('T')[0]
      });

      if (response.success) {
        toast({
          title: "Éxito",
          description: "Producto registrado correctamente",
        });
        // Limpiar formulario
        setFormData({
          nombre: '',
          detalle: '',
          tipo: '' as TipoProducto,
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
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar el producto",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Nombre del Producto</Label>
            <Input
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label>Detalle</Label>
            <Input
              value={formData.detalle}
              onChange={(e) => setFormData(prev => ({ ...prev, detalle: e.target.value }))}
              placeholder="Descripción breve del producto"
            />
          </div>

          <div>
            <Label>Tipo</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: TipoProducto) => 
                setFormData(prev => ({ ...prev, tipo: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alimento">Alimento</SelectItem>
                <SelectItem value="medicina">Medicina</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Para</Label>
            <Select
              value={formData.tipo_animal}
              onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_animal: value as TipoAnimal }))}
              required
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

          <div>
            <Label>Cantidad</Label>
            <Input
              type="number"
              value={formData.cantidad}
              onChange={(e) => setFormData(prev => ({ ...prev, cantidad: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label>Unidad de Medida</Label>
            <Input
              value={formData.unidad_medida}
              onChange={(e) => setFormData(prev => ({ ...prev, unidad_medida: e.target.value }))}
              placeholder="Ej: kg, lb, qq, ml, unidades..."
              required
            />
          </div>

          <div>
            <Label>Precio Unitario ($)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.precio_unitario}
              onChange={(e) => setFormData(prev => ({ ...prev, precio_unitario: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label>Proveedor</Label>
            <Input
              value={formData.proveedor}
              onChange={(e) => setFormData(prev => ({ ...prev, proveedor: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label>Número de Factura</Label>
            <Input
              value={formData.numero_factura}
              onChange={(e) => setFormData(prev => ({ ...prev, numero_factura: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label>Fecha de Compra</Label>
            <Input
              type="date"
              value={formData.fecha_compra}
              onChange={(e) => setFormData(prev => ({ ...prev, fecha_compra: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label>Nivel Mínimo</Label>
            <Input
              type="number"
              value={formData.nivel_minimo}
              onChange={(e) => setFormData(prev => ({ ...prev, nivel_minimo: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label>Nivel Crítico</Label>
            <Input
              type="number"
              value={formData.nivel_critico}
              onChange={(e) => setFormData(prev => ({ ...prev, nivel_critico: e.target.value }))}
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Registrar Compra
        </Button>
      </div>
    </form>
  );
} 