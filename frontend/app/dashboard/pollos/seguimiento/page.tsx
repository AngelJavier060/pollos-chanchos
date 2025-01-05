'use client';

import { useState, useEffect } from 'react';
import {
  ClockIcon,
  CubeIcon,
  ChartBarIcon,
  EnvelopeIcon as MailIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const Seguimiento = () => {
  const [lotes, setLotes] = useState([]);
  const [loteSeleccionado, setLoteSeleccionado] = useState('');
  const [peso, setPeso] = useState('');
  const [talla, setTalla] = useState('');
  const [estadoSalud, setEstadoSalud] = useState('');
  const [estadoVenta, setEstadoVenta] = useState('');
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    // Cargar lotes desde el backend
    fetch('/api/lotes')
      .then((res) => res.json())
      .then((data) => setLotes(data))
      .catch((error) => console.error('Error al cargar lotes:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('lote_id', loteSeleccionado);
    formData.append('peso', peso);
    formData.append('talla', talla);
    formData.append('estado_salud', estadoSalud);
    formData.append('estado_venta', estadoVenta);
    if (foto) formData.append('foto', foto);

    fetch('/api/seguimiento', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Seguimiento registrado:', data);
        alert('Seguimiento registrado con éxito');
      })
      .catch((error) => console.error('Error al registrar seguimiento:', error));
  };

  return (
    <div className="flex">
      {/* Barra lateral */}
      <aside className="w-60 bg-blue-900 text-white min-h-screen flex flex-col">
        <div className="flex items-center justify-center py-6">
          <ClockIcon className="h-8 w-8 text-white" />
          <h2 className="text-2xl font-bold ml-2">Dashboard</h2>
        </div>
        <nav className="flex-1 px-4">
          <ul>
            <li className="mb-6">
              <a href="/dashboard" className="flex items-center space-x-2">
                <ClockIcon className="h-6 w-6" />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="mb-6">
              <div className="flex items-center space-x-2 cursor-pointer">
                <CubeIcon className="h-6 w-6" />
                <span>Registro</span>
                <ChevronDownIcon className="h-4 w-4" />
              </div>
              <ul className="ml-8 mt-2">
                <li className="mb-2">
                  <a href="/registro/pollos/ingreso">Pollo</a>
                </li>
                <li className="mb-2">
                  <a href="/registro/pollos/alimentos">Alimento</a>
                </li>
                <li>
                  <a href="/registro/pollos/medicamentos">Medicina</a>
                </li>
              </ul>
            </li>
            <li className="mb-6">
              <a href="/dashboard/pollos/seguimiento" className="flex items-center space-x-2">
                <ChartBarIcon className="h-6 w-6" />
                <span>Seguimiento</span>
              </a>
            </li>
            <li>
              <a href="/mailbox" className="flex items-center space-x-2">
                <MailIcon className="h-6 w-6" />
                <span>Mailbox</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Seguimiento de Pollos</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Seleccionar Lote</label>
            <select
              value={loteSeleccionado}
              onChange={(e) => setLoteSeleccionado(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            >
              <option value="">Seleccione un lote</option>
              {lotes.map((lote) => (
                <option key={lote.id} value={lote.id}>
                  {lote.nombre || `Lote ${lote.id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
            <input
              type="number"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Talla (cm)</label>
            <input
              type="number"
              value={talla}
              onChange={(e) => setTalla(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado de Salud</label>
            <select
              value={estadoSalud}
              onChange={(e) => setEstadoSalud(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            >
              <option value="">Seleccione un estado</option>
              <option value="Saludable">Saludable</option>
              <option value="Enfermo">Enfermo</option>
              <option value="Recuperado">Recuperado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado de Venta</label>
            <select
              value={estadoVenta}
              onChange={(e) => setEstadoVenta(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            >
              <option value="">Seleccione un estado</option>
              <option value="Disponible">Disponible</option>
              <option value="Vendido">Vendido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subir Foto</label>
            <input
              type="file"
              onChange={(e) => setFoto(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Registrar Seguimiento
          </button>
        </form>
      </div>
    </div>
  );
};

export default Seguimiento;
