'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Asegúrate de importar desde 'next/navigation'
import {
  ClockIcon,
  CubeIcon,
  ChartBarIcon,
  EnvelopeIcon as MailIcon,
  ClipboardDocumentListIcon as ClipboardListIcon,
  TableCellsIcon as TableIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para manejar el desplegable
  const router = useRouter(); // Hook para manejar redirección

  const handleLogout = () => {
    router.push('/'); // Redirige a la página principal
  };

  const handleNavigation = (path: string) => {
    router.push(path); // Redirige a la ruta específica
  };

  const data = {
    labels: ['2019-09-09', '2019-09-10', '2019-09-11', '2019-09-12', '2019-09-13', '2019-09-14'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [2000, 2500, 3000, 2800, 3200, 3500],
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
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
          callback: (value: any) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Franja superior */}
      <div className="bg-white shadow flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          <button className="bg-purple-600 text-white p-2 rounded">
            <ClockIcon className="h-5 w-5" />
          </button>
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 w-96"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            onClick={handleLogout} // Llama a la función handleLogout
          >
            Salir
          </button>
          <div className="flex items-center space-x-2">
            <img
              src="https://via.placeholder.com/40"
              alt="User avatar"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="text-gray-700 text-sm font-bold">Angel</p>
              <p className="text-gray-500 text-xs">Admin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-grow">
        {/* Menú lateral */}
        <aside className="w-20 bg-blue-900 shadow-lg min-h-screen flex flex-col items-center py-4">
          <div
            className={`mb-8 flex flex-col items-center ${
              activeTab === 'dashboard' ? 'text-white' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            <ClockIcon className="h-8 w-8 hover:text-white transition" />
            <p className="text-xs mt-1 text-center">Dashboard</p>
          </div>

          {/* Registro con lista desplegable */}
          <div
            className="mb-8 flex flex-col items-center text-gray-400 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="flex items-center space-x-1">
              <CubeIcon className="h-8 w-8 hover:text-white transition" />
              <ChevronDownIcon className="h-5 w-5 hover:text-white transition" />
            </div>
            <p className="text-xs mt-1 text-center">Registro</p>

            {/* Opciones desplegables */}
            {isMenuOpen && (
              <div className="mt-2 bg-white shadow-lg rounded-md p-2 text-gray-700">
                <div
                  className="hover:bg-gray-100 p-2 rounded cursor-pointer"
                  onClick={() => handleNavigation('/registro/pollos/ingreso')}
                >
                  Pollo
                </div>
                <div
                  className="hover:bg-gray-100 p-2 rounded cursor-pointer"
                  onClick={() => handleNavigation('/registro/pollos/alimentos')}
                >
                  Alimento
                </div>
                <div
                  className="hover:bg-gray-100 p-2 rounded cursor-pointer"
                  onClick={() => handleNavigation('/registro/pollos/medicamentos')}
                >
                  Medicina
                </div>
              </div>
            )}
          </div>

          <div
            className={`mb-8 flex flex-col items-center ${
              activeTab === 'charts' ? 'text-white' : 'text-gray-400'
            }`}
            onClick={() => {
              setActiveTab('charts');
              router
              .push('/dashboard/pollos/seguimiento'); // Redirige a la página de seguimiento
            }}
          >
            <ChartBarIcon className="h-8 w-8 hover:text-white transition" />
            <p className="text-xs mt-1 text-center">Seguimiento</p>
          </div>

          <div
            className={`mb-8 flex flex-col items-center ${
              activeTab === 'mailbox' ? 'text-white' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('mailbox')}
          >
            <MailIcon className="h-8 w-8 hover:text-white transition" />
            <p className="text-xs mt-1 text-center">Mailbox</p>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>
              <p className="text-gray-600">Bienvenido al panel de control.</p>

              {/* Tarjetas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-gray-700 font-bold">Total de Producción</h3>
                  <p className="text-3xl font-extrabold">$120</p>
                  <p className="text-green-500">+30</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-gray-700 font-bold">Total de Lotes</h3>
                  <p className="text-3xl font-extrabold">5</p>
                  <p className="text-gray-500">Stable</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-gray-700 font-bold">Inversion de Alimentos</h3>
                  <p className="text-3xl font-extrabold">$1200</p>
                  <p className="text-green-500">High</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-gray-700 font-bold">Total de Gastos</h3>
                  <p className="text-3xl font-extrabold">$1200</p>
                  <p className="text-green-500">Thint</p>
                </div>
              </div>

              {/* Gráfico y recuadro azul */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Gráfico */}
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-700 mb-4">Statistics</h3>
                  <Line data={data} options={options} />
                </div>

                {/* Recuadro azul */}
                <div className="bg-blue-500 text-white shadow-md rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Twitter Widget</h3>
                  <p className="text-sm">
                    "In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium."
                  </p>
                  <p className="text-xs mt-4">24 January, 2018</p>
                  <div className="flex space-x-4 mt-4">
                    <button className="bg-white text-blue-500 px-4 py-2 rounded-lg">200</button>
                    <button className="bg-white text-blue-500 px-4 py-2 rounded-lg">192</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
