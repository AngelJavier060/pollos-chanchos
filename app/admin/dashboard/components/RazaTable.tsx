'use client';

import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Raza } from './types/raza';
import Image from 'next/image';
import { Edit2, Trash2 } from 'lucide-react';

interface RazaTableProps {
  razas: Raza[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const RazaTable: FC<RazaTableProps> = ({ razas, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagen
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Características
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tiempos
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {razas.map((raza) => (
            <tr key={raza.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {raza.imagen ? (
                  <div className="relative h-16 w-16">
                    <Image
                      src={raza.imagen}
                      alt={raza.nombre}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                    Sin imagen
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{raza.nombre}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  raza.tipoAnimal === 'pollo' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-pink-100 text-pink-800'
                }`}>
                  {raza.tipoAnimal === 'pollo' ? 'Pollo' : 'Cerdo'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  <p>Peso: {raza.pesoPromedio} kg</p>
                  <p>Tamaño: {raza.tamanioPromedio} cm</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  <p>Madurez: {raza.edadMadurez} meses</p>
                  <p>Crecimiento: {raza.tiempoCrecimiento} meses</p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(raza.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(raza.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RazaTable; 