'use client';

import { Button } from "@/app/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
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
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre del Lote</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Raza</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead>Fecha Nacimiento</TableHead>
            <TableHead className="text-right">Costo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lotes.map((lote) => (
            <TableRow key={lote.id}>
              <TableCell>{lote.nombre}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  lote.tipo_animal === 'pollo' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {lote.tipo_animal === 'pollo' ? 'Pollo' : 'Chancho'}
                </span>
              </TableCell>
              <TableCell>{lote.raza}</TableCell>
              <TableCell className="text-right">{lote.cantidad}</TableCell>
              <TableCell>{formatDate(lote.fecha_nacimiento)}</TableCell>
              <TableCell className="text-right">{formatCurrency(lote.costo)}</TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(lote)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(lote.id!)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {lotes.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No hay lotes registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LotesTable;
