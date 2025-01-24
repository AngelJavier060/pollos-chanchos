'use client';

import { FC } from 'react';
import { AlertTriangle, AlertCircle, ShoppingCart } from 'lucide-react';
import { Card } from '../ui/card';

interface Alerta {
  id: number;
  tipo: 'mortalidad' | 'enfermedad' | 'stock';
  mensaje: string;
  fecha: string;
  nivel: 'alta' | 'media' | 'baja';
  loteId?: number;
  detalles?: string;
}

interface AlertasActivasProps {
  alertas: Alerta[];
}

const AlertasActivas: FC<AlertasActivasProps> = ({ alertas }) => {
  const getIconoAlerta = (tipo: string) => {
    switch (tipo) {
      case 'mortalidad':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'enfermedad':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'stock':
        return <ShoppingCart className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getNivelClase = (nivel: string) => {
    switch (nivel) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return '';
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Alertas Activas</h2>
      <div className="space-y-4">
        {alertas.map((alerta) => (
          <div
            key={alerta.id}
            className={`p-4 rounded-lg border ${getNivelClase(alerta.nivel)} flex items-start gap-3`}
          >
            {getIconoAlerta(alerta.tipo)}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{alerta.mensaje}</span>
                <span className="text-sm text-gray-500">{alerta.fecha}</span>
              </div>
              {alerta.detalles && (
                <p className="text-sm mt-1 text-gray-600">{alerta.detalles}</p>
              )}
              {alerta.loteId && (
                <span className="text-sm text-gray-500">Lote: #{alerta.loteId}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AlertasActivas; 