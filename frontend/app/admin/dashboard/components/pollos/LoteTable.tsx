'use client';

import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Lote } from '../types/pollo';
import { Raza } from '../types/raza';
import { Edit2, Trash2, LineChart, Clipboard, Stethoscope } from 'lucide-react';

interface LoteTableProps {
  lotes: Lote[];
  razas: Raza[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onVerCrecimiento: (lote: Lote) => void;
  onVerSanitario: (lote: Lote) => void;
  onVerAlimentacion: (lote: Lote) => void;
}

const LoteTable: FC<LoteTableProps> = ({ 
  lotes, 
  razas, 
  onEdit, 
  onDelete,
  onVerCrecimiento,
  onVerSanitario,
  onVerAlimentacion
}) => {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'vendido':
        return 'bg-blue-100 text-blue-800';
      case 'finalizado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRazaNombre = (razaId: number) => {
    const raza = razas.find(r => r.id === razaId);
    return raza ? raza.nombre : 'No especificada';
  };

  const calcularEdadLote = (fechaIngreso: string) => {
    const inicio = new Date(fechaIngreso);
    const hoy = new Date();
    const diferencia = hoy.getTime() - inicio.getTime();
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    return `${dias} días`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Raza
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cantidad
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Edad
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Galpón
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lotes.map((lote) => (
            <tr key={lote.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{lote.codigo}</div>
                <div className="text-sm text-gray-500">
                  Ingreso: {new Date(lote.fechaIngreso).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{getRazaNombre(lote.razaId)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  Actual: {lote.cantidadActual}
                  <span className="text-gray-500 text-xs ml-1">/ {lote.cantidadInicial}</span>
                </div>
                <div className="text-xs text-red-600">
                  Mortalidad: {((lote.mortalidad / lote.cantidadInicial) * 100).toFixed(1)}%
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {calcularEdadLote(lote.fechaIngreso)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(lote.estado)}`}>
                  {lote.estado.charAt(0).toUpperCase() + lote.estado.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lote.galpón}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVerCrecimiento(lote)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <LineChart className="h-4 w-4 mr-1" />
                    Crecimiento
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVerSanitario(lote)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Stethoscope className="h-4 w-4 mr-1" />
                    Sanitario
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVerAlimentacion(lote)}
                    className="text-orange-600 hover:text-orange-900"
                  >
                    <Clipboard className="h-4 w-4 mr-1" />
                    Alimentación
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(lote.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(lote.id)}
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

export default LoteTable; 