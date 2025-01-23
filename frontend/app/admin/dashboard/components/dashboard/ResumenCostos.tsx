'use client';

import { FC } from 'react';
import { Card } from '../ui/card';
import { DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';

interface ResumenCostosProps {
  costos: {
    alimentacion: number;
    medicinas: number;
    otros: number;
    total: number;
  };
  tendencia: {
    porcentaje: number;
    direccion: 'up' | 'down';
  };
}

const ResumenCostos: FC<ResumenCostosProps> = ({ costos, tendencia }) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Resumen de Costos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-purple-700">
                ${costos.total.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className={`w-4 h-4 ${
              tendencia.direccion === 'up' ? 'text-red-500' : 'text-green-500'
            }`} />
            <span className={`ml-1 ${
              tendencia.direccion === 'up' ? 'text-red-500' : 'text-green-500'
            }`}>
              {tendencia.porcentaje}% vs mes anterior
            </span>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Alimentación</p>
              <p className="text-2xl font-bold text-blue-700">
                ${costos.alimentacion.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {((costos.alimentacion / costos.total) * 100).toFixed(1)}% del total
          </p>
        </div>

        {/* Similares cards para medicinas y otros costos */}
      </div>
    </Card>
  );
};

export default ResumenCostos; 