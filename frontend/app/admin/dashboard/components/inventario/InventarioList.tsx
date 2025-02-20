'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Producto } from '../../types/inventario';
import ProductoForm from './ProductoForm';

export default function InventarioList() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProductos = useCallback(() => {
    const storedProducts = localStorage.getItem('productos');
    if (storedProducts) {
      setProductos(JSON.parse(storedProducts));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleSubmit = useCallback((data: any) => {
    try {
      let updatedProducts;

      if (editingProduct) {
        updatedProducts = productos.map((producto) => 
          producto.id === editingProduct.id ? { ...producto, ...data } : producto
        );
      } else {
        const newProduct = { ...data, id: Date.now() };
        updatedProducts = [...productos, newProduct];
      }

      localStorage.setItem('productos', JSON.stringify(updatedProducts));
      setProductos(updatedProducts);
      setIsOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  }, [editingProduct, productos]);

  const handleDelete = useCallback((id: number) => {
    const updatedProducts = productos.filter(producto => producto.id !== id);
    localStorage.setItem('productos', JSON.stringify(updatedProducts));
    setProductos(updatedProducts);
  }, [productos]);

  const filteredProducts = useMemo(() => {
    return productos.filter(producto =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Cargando inventario...</span>
      </div>
    );
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
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Nombre de la Etapa</TableHead>
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
                  <TableCell>{producto.tipo_animal}</TableCell>
                  <TableCell>{producto.cantidad}</TableCell>
                  <TableCell>{producto.unidad_medida}</TableCell>
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

      <ProductoForm
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingProduct(null);
        }}
        initialData={editingProduct}
        onSubmit={handleSubmit}
      />
    </div>
  );
}