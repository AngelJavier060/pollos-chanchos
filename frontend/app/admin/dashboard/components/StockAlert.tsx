'use client';

import { FC } from 'react';
import { StockAlert as StockAlertType } from './types/inventory';
import { AlertTriangle } from 'lucide-react';

interface StockAlertProps {
  alerts: StockAlertType[];
}

const StockAlert: FC<StockAlertProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Alertas de Stock Bajo
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc pl-5 space-y-1">
                {alerts.map((alert) => (
                  <li key={alert.productId}>
                    {alert.nombre} - {alert.cantidadActual} unidades 
                    ({alert.porcentajeStock.toFixed(1)}% del nivel mínimo)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAlert; 