'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product, ProductType } from './types/inventory';

interface ProductFormProps {
  onSubmit: (data: Partial<Product>) => void;
  initialData?: Product | null;
}

const ProductForm: FC<ProductFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'alimento' as ProductType,
    cantidad: '',
    unidadMedida: '',
    nivelMinimo: '',
    precio: '',
    proveedor: '',
    fechaCompra: new Date().toISOString().split('T')[0],
    descripcion: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre,
        tipo: initialData.tipo,
        cantidad: initialData.cantidad.toString(),
        unidadMedida: initialData.unidadMedida,
        nivelMinimo: initialData.nivelMinimo.toString(),
        precio: initialData.precio.toString(),
        proveedor: initialData.proveedor,
        fechaCompra: initialData.fechaCompra.split('T')[0],
        descripcion: initialData.descripcion || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      cantidad: parseFloat(formData.cantidad),
      nivelMinimo: parseFloat(formData.nivelMinimo),
      precio: parseFloat(formData.precio),
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? 'Editar Producto' : 'Agregar Producto'}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre del Producto</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="tipo">Tipo de Producto</Label>
          <select
            id="tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as ProductType })}
            className="w-full border rounded-md p-2"
            required
          >
            <option value="alimento">Alimento</option>
            <option value="medicina">Medicina</option>
            <option value="vacuna">Vacuna</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cantidad">Cantidad</Label>
          <Input
            id="cantidad"
            type="number"
            step="0.01"
            value={formData.cantidad}
            onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="unidadMedida">Unidad de Medida</Label>
          <Input
            id="unidadMedida"
            value={formData.unidadMedida}
            onChange={(e) => setFormData({ ...formData, unidadMedida: e.target.value })}
            placeholder="kg, litros, unidades..."
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="precio">Precio por Unidad</Label>
          <Input
            id="precio"
            type="number"
            step="0.01"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="nivelMinimo">Nivel Mínimo de Stock</Label>
          <Input
            id="nivelMinimo"
            type="number"
            step="0.01"
            value={formData.nivelMinimo}
            onChange={(e) => setFormData({ ...formData, nivelMinimo: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="proveedor">Proveedor</Label>
          <Input
            id="proveedor"
            value={formData.proveedor}
            onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="fechaCompra">Fecha de Compra</Label>
          <Input
            id="fechaCompra"
            type="date"
            value={formData.fechaCompra}
            onChange={(e) => setFormData({ ...formData, fechaCompra: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          className="w-full border rounded-md p-2 min-h-[100px]"
          placeholder="Detalles adicionales del producto..."
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Actualizar Producto' : 'Agregar Producto'}
      </Button>
    </form>
  );
};

export default ProductForm; 