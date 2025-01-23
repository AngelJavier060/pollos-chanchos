"use client"; // Necesario para usar useState en un componente cliente

import { FC } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Users, LayersIcon, Activity, DollarSign, TrendingUp } from 'lucide-react';

interface GeneralStatsProps {
  users: any[];
  pollos: any[];
  chanchos: any[];
  mortalidadPollos: number;
  mortalidadChanchos: number;
  costoAlimento: number;
  consumoDiarioAlimento: number;
  precioVentaAnimal: number;
}

interface MetricaCardProps {
  valor: string;
  titulo: string;
  subtitulo: string;
  colorValor?: string;
  colorSubtitulo?: string;
  icono?: React.ReactNode;
}

const MetricaCard: FC<MetricaCardProps> = ({
  valor,
  titulo,
  subtitulo,
  colorValor = "text-gray-800",
  colorSubtitulo = "text-gray-400",
  icono
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <div className={`text-3xl font-bold ${colorValor}`}>{valor}</div>
        <div className="text-gray-500 text-sm">{titulo}</div>
        <div className={`text-xs ${colorSubtitulo} mt-2`}>{subtitulo}</div>
      </div>
      {icono && <div>{icono}</div>}
    </div>
  </div>
);

const GeneralStats: FC<GeneralStatsProps> = ({
  users,
  pollos,
  chanchos,
  mortalidadPollos,
  mortalidadChanchos,
  costoAlimento,
  consumoDiarioAlimento,
  precioVentaAnimal
}) => {
  // Cálculos de métricas
  const totalLotes = 4; // Ejemplo: 2 lotes de pollos + 2 lotes de cerdos
  const costoProyectadoDiario = costoAlimento * consumoDiarioAlimento * (pollos.length + chanchos.length);
  const ventasProyectadas = precioVentaAnimal * (pollos.length + chanchos.length);
  const gananciaProyectada = ventasProyectadas - (costoProyectadoDiario * 30);

  // Datos para gráficos
  const mortalidadData = [
    { name: "Pollos Vivos", value: pollos.length - mortalidadPollos, color: "#34D399" },
    { name: "Pollos Fallecidos", value: mortalidadPollos, color: "#EF4444" },
    { name: "Cerdos Vivos", value: chanchos.length - mortalidadChanchos, color: "#60A5FA" },
    { name: "Cerdos Fallecidos", value: mortalidadChanchos, color: "#F472B6" }
  ];

  const proyeccionCostosData = [
    { mes: 'Actual', alimento: costoProyectadoDiario * 30, medicinas: costoProyectadoDiario * 0.2 * 30, insumos: costoProyectadoDiario * 0.1 * 30 },
    { mes: 'Próximo', alimento: costoProyectadoDiario * 31, medicinas: costoProyectadoDiario * 0.2 * 31, insumos: costoProyectadoDiario * 0.1 * 31 },
    { mes: 'Siguiente', alimento: costoProyectadoDiario * 32, medicinas: costoProyectadoDiario * 0.2 * 32, insumos: costoProyectadoDiario * 0.1 * 32 }
  ];

  const proyeccionGananciasData = [
    { mes: 'Actual', ventas: ventasProyectadas, costos: -costoProyectadoDiario * 30, ganancia: gananciaProyectada },
    { mes: 'Próximo', ventas: ventasProyectadas * 1.1, costos: -(costoProyectadoDiario * 31), ganancia: gananciaProyectada * 1.1 },
    { mes: 'Siguiente', ventas: ventasProyectadas * 1.2, costos: -(costoProyectadoDiario * 32), ganancia: gananciaProyectada * 1.2 }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricaCard
          titulo="Total de Usuarios"
          valor={users.length.toString()}
          subtitulo="Usuarios registrados"
          icono={<Users className="w-8 h-8 text-blue-500" />}
          colorValor="text-blue-500"
        />
        
        <MetricaCard
          titulo="Lotes Activos"
          valor={totalLotes.toString()}
          subtitulo="2 pollos • 2 cerdos"
          icono={<LayersIcon className="w-8 h-8 text-purple-500" />}
          colorValor="text-purple-500"
        />

        <MetricaCard
          titulo="Mortalidad Total"
          valor={`${((mortalidadPollos + mortalidadChanchos) / (pollos.length + chanchos.length) * 100).toFixed(1)}%`}
          subtitulo={`${mortalidadPollos + mortalidadChanchos} animales`}
          icono={<Activity className="w-8 h-8 text-red-500" />}
          colorValor="text-red-500"
        />

        <MetricaCard
          titulo="Ganancia Proyectada"
          valor={`$${gananciaProyectada.toFixed(2)}`}
          subtitulo="Este mes"
          icono={<TrendingUp className="w-8 h-8 text-green-500" />}
          colorValor="text-green-500"
        />
      </div>

      {/* Gráficos en grid de 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mortalidad */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Estadísticas de Mortalidad</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={mortalidadData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {mortalidadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Proyección de Costos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Proyección de Costos</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={proyeccionCostosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="alimento" name="Alimento" fill="#34D399" stackId="stack" />
                <Bar dataKey="medicinas" name="Medicinas" fill="#60A5FA" stackId="stack" />
                <Bar dataKey="insumos" name="Otros Insumos" fill="#F472B6" stackId="stack" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Proyección de Ganancias */}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Proyección de Ganancias</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={proyeccionGananciasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="ventas" name="Ventas" stroke="#34D399" strokeWidth={2} />
                <Line type="monotone" dataKey="costos" name="Costos" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="ganancia" name="Ganancia Neta" stroke="#60A5FA" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralStats;
