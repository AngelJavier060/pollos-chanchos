'use client';

import { Raza } from '../types/raza';
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
import Image from 'next/image';

interface RazasTableProps {
  razas: Raza[];
  onEdit: (raza: Raza) => void;
  onDelete: (id: number) => void;
}

const RazasTable = ({ razas, onEdit, onDelete }: RazasTableProps) => {
  const getFullImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Imagen</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Peso Prom.</TableHead>
          <TableHead>Tamaño Prom.</TableHead>
          <TableHead>Edad Madurez</TableHead>
          <TableHead>T. Crecimiento</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {razas.map((raza) => (
          <TableRow key={raza.id}>
            <TableCell>
              {raza.imagen_url && (
                <div className="relative w-20 h-20">
                  <Image
                    src={getFullImageUrl(raza.imagen_url) || ''}
                    alt={raza.nombre}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
            </TableCell>
            <TableCell>{raza.nombre}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                raza.tipo_animal === 'pollo' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {raza.tipo_animal}
              </span>
            </TableCell>
            <TableCell>{raza.peso_promedio} kg</TableCell>
            <TableCell>{raza.tamanio_promedio} cm</TableCell>
            <TableCell>{raza.edad_madurez} días</TableCell>
            <TableCell>{raza.tiempo_crecimiento} días</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                raza.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {raza.estado ? 'Activo' : 'Inactivo'}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(raza)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(raza.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RazasTable; 