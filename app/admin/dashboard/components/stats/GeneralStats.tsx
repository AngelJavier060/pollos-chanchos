// Separar tipos
interface StatsData {
  users: User[];
  pollos: Animal[];
  chanchos: Animal[];
  mortalidadPollos: number;
  mortalidadChanchos: number;
  costoAlimento: number;
  consumoDiarioAlimento: number;
  precioVentaAnimal: number;
}

// Separar MetricaCard a su propio componente
const MetricaCard = ({ valor, titulo, subtitulo, colorValor = "text-gray-800", colorSubtitulo = "text-gray-400", icono }: MetricaCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* ... */}
    </div>
  );
};

// Separar lógica de cálculos
const useStatsCalculations = (data: StatsData) => {
  const totalLotes = 4;
  const costoProyectadoDiario = data.costoAlimento * data.consumoDiarioAlimento * (data.pollos.length + data.chanchos.length);
  const ventasProyectadas = data.precioVentaAnimal * (data.pollos.length + data.chanchos.length);
  const gananciaProyectada = ventasProyectadas - (costoProyectadoDiario * 30);

  return {
    totalLotes,
    costoProyectadoDiario,
    ventasProyectadas,
    gananciaProyectada
  };
};

// Componente principal más limpio
const GeneralStats: FC<StatsData> = (props) => {
  const stats = useStatsCalculations(props);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricaCard {...statsCards.usuarios} />
        <MetricaCard {...statsCards.lotes} />
        <MetricaCard {...statsCards.mortalidad} />
        <MetricaCard {...statsCards.ganancias} />
      </div>
      
      {/* Gráficos */}
      <StatsCharts data={props} calculations={stats} />
    </div>
  );
}; 