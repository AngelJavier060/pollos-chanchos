'use client';

import { useState } from 'react';

const RegistroAlimentosPollos = () => {
  const [marca, setMarca] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');
  const [cantidadMaiz, setCantidadMaiz] = useState('');
  const [unidadMedidaMaiz, setUnidadMedidaMaiz] = useState('');
  const [cantidadArrocillo, setCantidadArrocillo] = useState('');
  const [unidadMedidaArrocillo, setUnidadMedidaArrocillo] = useState('');
  const [cantidadCebada, setCantidadCebada] = useState('');
  const [unidadMedidaCebada, setUnidadMedidaCebada] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      marca,
      fechaCompra,
      cantidadMaiz,
      unidadMedidaMaiz,
      cantidadArrocillo,
      unidadMedidaArrocillo,
      cantidadCebada,
      unidadMedidaCebada,
    });
    alert('Datos registrados con éxito');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Registro de Alimentos para Pollos
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Marca del Alimento */}
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-1">Marca de Alimento</label>
            <select
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Selecciona una marca
              </option>
              <option value="Pronaca">Pronaca</option>
              <option value="Nutri">Nutri</option>
              <option value="Mais">Mais</option>
            </select>
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

          {/* Cantidad de Maíz */}
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-1">Cantidad de Maíz</label>
            <div className="flex space-x-4">
              <input
                type="number"
                value={cantidadMaiz}
                onChange={(e) => setCantidadMaiz(e.target.value)}
                placeholder="Cantidad"
                className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={unidadMedidaMaiz}
                onChange={(e) => setUnidadMedidaMaiz(e.target.value)}
                className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Unidad
                </option>
                <option value="Quintales">Quintales</option>
                <option value="Libras">Libras</option>
                <option value="Medias Libras">Medias Libras</option>
                <option value="Kilogramos">Kilogramos</option>
              </select>
            </div>
          </div>

          {/* Cantidad de Arrocillo */}
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-1">Cantidad de Arrocillo</label>
            <div className="flex space-x-4">
              <input
                type="number"
                value={cantidadArrocillo}
                onChange={(e) => setCantidadArrocillo(e.target.value)}
                placeholder="Cantidad"
                className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={unidadMedidaArrocillo}
                onChange={(e) => setUnidadMedidaArrocillo(e.target.value)}
                className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Unidad
                </option>
                <option value="Quintales">Quintales</option>
                <option value="Libras">Libras</option>
                <option value="Medias Libras">Medias Libras</option>
                <option value="Kilogramos">Kilogramos</option>
              </select>
            </div>
          </div>

          {/* Cantidad de Cebada */}
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-1">Cantidad de Cebada</label>
            <div className="flex space-x-4">
              <input
                type="number"
                value={cantidadCebada}
                onChange={(e) => setCantidadCebada(e.target.value)}
                placeholder="Cantidad"
                className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={unidadMedidaCebada}
                onChange={(e) => setUnidadMedidaCebada(e.target.value)}
                className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Unidad
                </option>
                <option value="Quintales">Quintales</option>
                <option value="Libras">Libras</option>
                <option value="Medias Libras">Medias Libras</option>
                <option value="Kilogramos">Kilogramos</option>
              </select>
            </div>
          </div>

          {/* Botón de Enviar */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Registrar Alimento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroAlimentosPollos;

