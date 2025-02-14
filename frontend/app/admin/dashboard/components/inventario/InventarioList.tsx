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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/inventario/productos');
      setProductos(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el inventario",
        variant: "destructive",
      });
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = productos?.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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

  if (loading) {
    return <div className="flex justify-center items-center p-8">Cargando inventario...</div>;
  }

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
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          Nuevo Producto
        </Button>
      </div>

      <div className="border rounded-md">
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
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No hay productos en el inventario
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.detalle}</TableCell>
                  <TableCell>{producto.tipo}</TableCell>
                  <TableCell>{producto.para}</TableCell>
                  <TableCell>{producto.cantidad}</TableCell>
                  <TableCell>{producto.unidad}</TableCell>
                  <TableCell>${producto.precio_unitario}</TableCell>
                  <TableCell>{producto.proveedor}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingProduct(producto);
                          setIsOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(producto.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isOpen && (
        <ProductoForm
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={async (data) => {
            try {
              if (editingProduct) {
                await api.put(`/api/inventario/productos/${editingProduct.id}`, data);
                toast({
                  title: "Éxito",
                  description: "Producto actualizado correctamente",
                });
              } else {
                await api.post('/api/inventario/productos', data);
                toast({
                  title: "Éxito",
                  description: "Producto creado correctamente",
                });
              }
              await fetchProductos();
              setIsOpen(false);
              setEditingProduct(null);
            } catch (error) {
              toast({
                title: "Error",
                description: "No se pudo guardar el producto",
                variant: "destructive",
              });
            }
          }}
          initialData={editingProduct}
        />
      )}
    </div>
  );
}