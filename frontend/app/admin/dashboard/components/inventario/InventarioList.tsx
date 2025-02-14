'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Producto } from '../../types/inventario';
import { api } from '@/app/lib/api';
import { toast } from "@/app/components/ui/use-toast";
import ProductoForm from './ProductoForm';

export default function InventarioList() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const data = await api.get('/api/inventario/productos');
      setProductos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el inventario",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este producto?')) {
      return;
    }
    
    try {
      const response = await api.delete(`/api/inventario/productos/${id}`);
      if (response.success) {
        if (response.productos) {
          setProductos(response.productos);
        } else {
          await fetchProductos();
        }
        
        toast({
          title: "Éxito",
          description: "Producto eliminado correctamente",
        });
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Detalle</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Para</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Precio Unit.</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Estado Stock</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((producto) => (
            <TableRow key={producto.id}>
              <TableCell>{producto.nombre}</TableCell>
              <TableCell>{producto.detalle}</TableCell>
              <TableCell>
                {producto.tipo === 'alimento' ? 'Alimento' : 'Medicina'}
              </TableCell>
              <TableCell>{producto.tipo_animal}</TableCell>
              <TableCell>{producto.cantidad}</TableCell>
              <TableCell>{producto.unidad_medida}</TableCell>
              <TableCell>${producto.precio_unitario}</TableCell>
              <TableCell>{producto.proveedor}</TableCell>
              <TableCell>
                <StockStatus
                  cantidad={producto.cantidad}
                  minimo={producto.nivel_minimo}
                  critico={producto.nivel_critico}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(producto);
                      setIsOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(producto.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProductoForm
        open={isOpen}
        onOpenChange={setIsOpen}
        initialData={editingProduct}
        onSubmit={async (data) => {
          try {
            const updateData = {
              ...data,
              cantidad: parseFloat(data.cantidad),
              precio_unitario: parseFloat(data.precio_unitario),
              nivel_minimo: parseFloat(data.nivel_minimo),
              nivel_critico: parseFloat(data.nivel_critico)
            };

            await api.put(`/api/inventario/productos/${editingProduct?.id}`, updateData);
            await fetchProductos();
            setIsOpen(false);
            setEditingProduct(null);
            toast({
              title: "Éxito",
              description: "Producto actualizado correctamente",
            });
          } catch (error) {
            console.error('Error al actualizar:', error);
            toast({
              title: "Error",
              description: "No se pudo actualizar el producto",
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
}

function StockStatus({ cantidad, minimo, critico }: { cantidad: number, minimo: number, critico: number }) {
  if (cantidad <= critico) {
    return <span className="text-red-600 font-medium">Crítico</span>;
  }
  if (cantidad <= minimo) {
    return <span className="text-yellow-600 font-medium">Bajo</span>;
  }
  return <span className="text-green-600 font-medium">Normal</span>;
} 