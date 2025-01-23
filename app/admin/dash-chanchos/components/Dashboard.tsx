'use client';

import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registra las partes necesarias de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  // Datos de los gráficos
  const dataLineChart = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Producción de Chanchos',
        data: [12, 19, 3, 5, 2, 3],  // Ejemplo de datos de producción de chanchos
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const dataBarChart = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Cantidad de Ventas de Chanchos',
        data: [65, 59, 80, 81],  // Ejemplo de datos de ventas de chanchos
        backgroundColor: '#34D399',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: (value: any) => `${value} Chanchos`,  // Cambio a "Chanchos"
        },
      },
    },
  };

  return (
    <div className="p-6">
      {/* Sección de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex items-center">
          <div className="mr-4">
            <span className="text-xl font-semibold">11,361</span>
            <p className="text-sm">Chanchos Criados</p> {/* Cambié "Brand Fans" a "Chanchos Criados" */}
          </div>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 border-4 border-black rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 2a8 8 0 10.001 16.001A8 8 0 0010 2zm0 14a6 6 0 11.001-12.001A6 6 0 0110 16z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex items-center">
          <div className="mr-4">
            <span className="text-xl font-semibold">431,125</span>
            <p className="text-sm">Ventas de Chanchos Observadas</p> {/* Cambié "Sales Observed" a "Ventas de Chanchos Observadas" */}
          </div>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 border-4 border-black rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 2a8 8 0 10.001 16.001A8 8 0 0010 2zm0 14a6 6 0 11.001-12.001A6 6 0 0110 16z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex items-center">
          <div className="mr-4">
            <span className="text-xl font-semibold">32,441</span>
            <p className="text-sm">Nuevos Chanchos</p> {/* Cambié "New Clients" a "Nuevos Chanchos" */}
          </div>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 border-4 border-black rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 2a8 8 0 10.001 16.001A8 8 0 0010 2zm0 14a6 6 0 11.001-12.001A6 6 0 0110 16z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex items-center">
          <div className="mr-4">
            <span className="text-xl font-semibold">1,315,514</span>
            <p className="text-sm">Tráfico de Chanchos Recibido</p> {/* Cambié "Traffic Received" a "Tráfico de Chanchos Recibido" */}
          </div>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 border-4 border-black rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 2a8 8 0 10.001 16.001A8 8 0 0010 2zm0 14a6 6 0 11.001-12.001A6 6 0 0110 16z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Line data={dataLineChart} options={options} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Bar data={dataBarChart} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
