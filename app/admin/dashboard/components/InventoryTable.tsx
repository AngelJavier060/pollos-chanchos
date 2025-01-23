'use client';

import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Product } from './types/inventory';
import { Edit2, Trash2 } from 'lucide-react';

interface InventoryTableProps {
  products: Product[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const InventoryTable: FC<InventoryTableProps> = ({ products, onEdit, onDelete }) => {
  const getStockStatus = (cantidad: number, nivelMinimo: number) => {
    const porcentaje = (cantidad / nivelMinimo) * 100;
    if (porcentaje <= 10) {
      return { color: 'text-red-600 bg-red-100', text: 'Crítico' };
    } else if (porcentaje <= 30) {
      return { color: 'text-yellow-600 bg-yellow-100', text: 'Bajo' };
    }
    return { color: 'text-green-600 bg-green-100', text: 'Normal' };
  };

  const getProductTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'alimento':
        return 'bg-blue-100 text-blue-800';
      case 'medicina':
        return 'bg-purple-100 text-purple-800';
      case 'vacuna':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Producto
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio/Unidad
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Proveedor
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Última Compra
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => {
            const stockStatus = getStockStatus(product.cantidad, product.nivelMinimo);
            return (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                  <div className="text-sm text-gray-500">{product.descripcion}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getProductTypeColor(product.tipo)}`}>
                    {product.tipo.charAt(0).toUpperCase() + product.tipo.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {product.cantidad} {product.unidadMedida}
                  </div>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                    {stockStatus.text}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    ${product.precio.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{product.proveedor}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(product.fechaCompra).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable; 