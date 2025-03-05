'use client';

import { Button } from "@/app/components/ui/button";
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Lote } from '../types/lote';

interface LotesTableProps {
  lotes: Lote[];
  onEdit: (lote: Lote) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

const LotesTable = ({ lotes, onEdit, onDelete, loading }: LotesTableProps) => {
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este lote?')) {
      onDelete(id);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const formatCurrency = (amount: number | undefined) => {
    if (typeof amount === 'number') {
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2
      }).format(amount);
    }
    return 'S/. 0.00';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-600">Nombre del Lote</TableHead>
              <TableHead className="font-semibold text-gray-600">Tipo</TableHead>
              <TableHead className="font-semibold text-gray-600">Raza</TableHead>
              <TableHead className="font-semibold text-gray-600 text-right">Cantidad</TableHead>
              <TableHead className="font-semibold text-gray-600">Fecha Nacimiento</TableHead>
              <TableHead className="font-semibold text-gray-600 text-right">Costo</TableHead>
              <TableHead className="font-semibold text-gray-600 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lotes.map((lote) => (
              <TableRow 
                key={lote.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <TableCell className="font-medium">{lote.nombre}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lote.tipo_animal === 'pollo' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {lote.tipo_animal === 'pollo' ? '🐔 Pollo' : '🐷 Chancho'}
                  </span>
                </TableCell>
                <TableCell>{lote.raza}</TableCell>
                <TableCell className="text-right font-medium">
                  {new Intl.NumberFormat('es-PE').format(lote.cantidad)}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
                    {formatDate(lote.fecha_nacimiento)}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium text-gray-900">
                  {formatCurrency(lote.costo)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(lote)}
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(lote.id!)}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {lotes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-600 font-medium mb-1">No hay lotes registrados</p>
                    <p className="text-gray-500 text-sm">Agrega un nuevo lote usando el botón "Nuevo Lote"</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LotesTable;
