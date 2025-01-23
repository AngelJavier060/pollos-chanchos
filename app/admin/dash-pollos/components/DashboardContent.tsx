'use client';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registra las partes necesarias de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardContent: React.FC = () => {
  // Datos del gráfico
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'], // Etiquetas de los ejes X
    datasets: [
      {
        label: 'Producción de Pollos', // Título de la serie de datos
        data: [12, 19, 3, 5, 2, 3],  // Datos que se muestran en el gráfico
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',  // Color de fondo
        tension: 0.4, // Curvatura de la línea
      },
    ],
  };

  // Opciones del gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Posición de la leyenda
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Esconde la cuadrícula en el eje X
        },
      },
      y: {
        ticks: {
          callback: (value: any) => `${value} Pollos`, // Mostrar los valores del eje Y con un prefijo
        },
      },
    },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-700">Dashboard de Pollos</h1>
      <p className="text-gray-600">Bienvenido al panel de control de Pollos.</p>

      {/* Gráfico */}
      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h3 className="font-bold text-xl mb-4">Estadísticas de Producción</h3>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardContent;
