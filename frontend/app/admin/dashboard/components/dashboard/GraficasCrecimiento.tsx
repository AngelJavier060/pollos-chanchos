'use client';

import { FC } from 'react';
import { Card } from '../ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DatoCrecimiento {
  fecha: string;
  peso: number;
  tamaño: number;
  loteId: number;
  nombreLote: string;
}

interface GraficasCrecimientoProps {
  datos: DatoCrecimiento[];
  lotes: number[];
}

const GraficasCrecimiento: FC<GraficasCrecimientoProps> = ({ datos, lotes }) => {
  const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Gráficas de Crecimiento</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis yAxisId="peso" label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="tamaño" orientation="right" label={{ value: 'Tamaño (cm)', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            {lotes.map((loteId, index) => (
              <>
                <Line
                  key={`peso-${loteId}`}
                  yAxisId="peso"
                  type="monotone"
                  dataKey={`peso`}
                  data={datos.filter(d => d.loteId === loteId)}
                  name={`Peso - Lote ${loteId}`}
                  stroke={colores[index % colores.length]}
                />
                <Line
                  key={`tamaño-${loteId}`}
                  yAxisId="tamaño"
                  type="monotone"
                  dataKey={`tamaño`}
                  data={datos.filter(d => d.loteId === loteId)}
                  name={`Tamaño - Lote ${loteId}`}
                  stroke={colores[(index + 2) % colores.length]}
                  strokeDasharray="5 5"
                />
              </>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default GraficasCrecimiento; 