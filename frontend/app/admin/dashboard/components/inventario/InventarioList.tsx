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
import { Search, Pencil, Trash2, Plus, PackageSearch } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar productos..."
            className="pl-8 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsOpen(true);
          }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-sm transition-all duration-200 hover:shadow w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-600">Nombre</TableHead>
              <TableHead className="font-semibold text-gray-600">Etapa</TableHead>
              <TableHead className="font-semibold text-gray-600">Tipo</TableHead>
              <TableHead className="font-semibold text-gray-600">Para</TableHead>
              <TableHead className="font-semibold text-gray-600 text-right">Cantidad</TableHead>
              <TableHead className="font-semibold text-gray-600">Unidad</TableHead>
              <TableHead className="font-semibold text-gray-600 text-right">Precio Unit.</TableHead>
              <TableHead className="font-semibold text-gray-600">Proveedor</TableHead>
              <TableHead className="font-semibold text-gray-600 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <PackageSearch className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-600 font-medium mb-1">No hay productos en el inventario</p>
                    <p className="text-gray-500 text-sm">Agrega un nuevo producto usando el botón "Nuevo Producto"</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((producto) => (
                <TableRow key={producto.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <TableCell className="font-medium">{producto.nombre}</TableCell>
                  <TableCell>{producto.detalle}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      {producto.tipo}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      producto.tipo_animal?.toLowerCase() === 'pollos' 
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700' 
                        : 'border-purple-200 bg-purple-50 text-purple-700'
                    }`}>
                      {producto.tipo_animal?.toLowerCase() === 'pollos' ? '🐔 Pollos' : '🐷 Cerdos'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat('es-PE').format(producto.cantidad)}
                  </TableCell>
                  <TableCell>{producto.unidad_medida}</TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat('es-PE', {
                      style: 'currency',
                      currency: 'PEN'
                    }).format(producto.precio_unitario)}
                  </TableCell>
                  <TableCell>{producto.proveedor}</TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingProduct(producto);
                          setIsOpen(true);
                        }}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(producto.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
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