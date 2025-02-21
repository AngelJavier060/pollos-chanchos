'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Button } from './button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface InventoryTableProps {
  type: 'pollos' | 'chanchos';
  data: any[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  type,
  data,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Fecha Ingreso</TableHead>
            <TableHead>Peso (kg)</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Lote</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{new Date(item.fechaIngreso).toLocaleDateString()}</TableCell>
              <TableCell>{item.peso}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.estado === 'vivo' ? 'bg-green-100 text-green-800' :
                  item.estado === 'procesado' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {item.estado}
                </span>
              </TableCell>
              <TableCell>{item.lote}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item.id)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                  onClick={() => onDelete(item.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
