'use client';

import { useState } from 'react';

const RegistroMedicamentosPollos = () => {
  const [categoria, setCategoria] = useState('');
  const [nombreMedicamento, setNombreMedicamento] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      categoria,
      nombreMedicamento,
      cantidad,
      unidadMedida,
      fechaCompra,
    });
    alert('Datos registrados con éxito');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Registro de Medicamentos para Pollos
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categoría de Medicamento */}
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-1">Categoría de Medicamento</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              <option value="Vacunas">Vacunas</option>
              <option value="Antibióticos">Antibióticos</option>
              <option value="Antibióticos para Fumigar">Antibióticos para Fumigar</option>
              <option value="Antivíticos para Pollos Enfermos">
                Antivíticos para Pollos Enfermos
              </option>
            </select>
          </div>

          {/* Nombre del Medicamento */}
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-1">Nombre del Medicamento</label>
            <input
              type="text"
              value={nombreMedicamento}
              onChange={(e) => setNombreMedicamento(e.target.value)}
              placeholder="Nombre del medicamento"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Cantidad del Medicamento */}
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-1">Cantidad</label>
            <div className="flex space-x-4">
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                placeholder="Cantidad"
                className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={unidadMedida}
                onChange={(e) => setUnidadMedida(e.target.value)}
                className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Unidad
                </option>
                <option value="Mililitros">Mililitros</option>
                <option value="Litros">Litros</option>
                <option value="Gramos">Gramos</option>
                <option value="Kilogramos">Kilogramos</option>
              </select>
            </div>
          </div>

          {/* Fecha de Compra */}
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-1">Fecha de Compra</label>
            <input
              type="date"
              value={fechaCompra}
              onChange={(e) => setFechaCompra(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botón de Enviar */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Registrar Medicamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroMedicamentosPollos;
