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
  const [alimentosRegistrados, setAlimentosRegistrados] = useState<any[]>([]); // Para almacenar los alimentos registrados
  const [mensaje, setMensaje] = useState('');
  const [idActualizando, setIdActualizando] = useState<number | null>(null);

  const mostrarMensaje = (texto: string) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marca || !fechaCompra || !cantidadMaiz || !cantidadArrocillo || !cantidadCebada) {
      mostrarMensaje('Por favor, completa todos los campos.');
      return;
    }

    const nuevoAlimento = {
      id: idActualizando || new Date().getTime(),
      marca,
      fechaCompra,
      cantidades: {
        maiz: { cantidad: cantidadMaiz, unidad: unidadMedidaMaiz },
        arrocillo: { cantidad: cantidadArrocillo, unidad: unidadMedidaArrocillo },
        cebada: { cantidad: cantidadCebada, unidad: unidadMedidaCebada },
      },
    };

    if (idActualizando) {
      // Actualizar alimento
      setAlimentosRegistrados(alimentosRegistrados.map((alimento) => (alimento.id === idActualizando ? nuevoAlimento : alimento)));
      mostrarMensaje('Alimento actualizado con éxito');
    } else {
      // Registrar nuevo alimento
      setAlimentosRegistrados([...alimentosRegistrados, nuevoAlimento]);
      mostrarMensaje('Alimento registrado con éxito');
    }

    // Limpiar formulario
    setMarca('');
    setFechaCompra('');
    setCantidadMaiz('');
    setUnidadMedidaMaiz('');
    setCantidadArrocillo('');
    setUnidadMedidaArrocillo('');
    setCantidadCebada('');
    setUnidadMedidaCebada('');
    setIdActualizando(null); // Resetea el ID de actualización
  };

  const handleEliminarAlimento = (id: number) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este alimento?');
    if (confirmar) {
      setAlimentosRegistrados(alimentosRegistrados.filter((alimento) => alimento.id !== id));
      mostrarMensaje('Alimento eliminado con éxito.');
    }
  };

  const handleActualizarAlimento = (alimento: any) => {
    setIdActualizando(alimento.id);
    setMarca(alimento.marca);
    setFechaCompra(alimento.fechaCompra);
    setCantidadMaiz(alimento.cantidades.maiz.cantidad);
    setUnidadMedidaMaiz(alimento.cantidades.maiz.unidad);
    setCantidadArrocillo(alimento.cantidades.arrocillo.cantidad);
    setUnidadMedidaArrocillo(alimento.cantidades.arrocillo.unidad);
    setCantidadCebada(alimento.cantidades.cebada.cantidad);
    setUnidadMedidaCebada(alimento.cantidades.cebada.unidad);
    mostrarMensaje('Modifica los datos y guarda los cambios.');
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
              {idActualizando ? 'Actualizar Alimento' : 'Registrar Alimento'}
            </button>
          </div>
        </form>
      </div>

      {/* Mostrar los alimentos registrados */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Alimentos Registrados</h2>
        {alimentosRegistrados.length === 0 ? (
          <p className="text-center text-gray-600">No hay alimentos registrados.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Marca</th>
                <th className="border border-gray-300 px-4 py-2">Fecha de Compra</th>
                <th className="border border-gray-300 px-4 py-2">Maíz</th>
                <th className="border border-gray-300 px-4 py-2">Arrocillo</th>
                <th className="border border-gray-300 px-4 py-2">Cebada</th>
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alimentosRegistrados.map((alimento) => (
                <tr key={alimento.id}>
                  <td className="border border-gray-300 px-4 py-2">{alimento.marca}</td>
                  <td className="border border-gray-300 px-4 py-2">{alimento.fechaCompra}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {alimento.cantidades.maiz.cantidad} {alimento.cantidades.maiz.unidad}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {alimento.cantidades.arrocillo.cantidad} {alimento.cantidades.arrocillo.unidad}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {alimento.cantidades.cebada.cantidad} {alimento.cantidades.cebada.unidad}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleActualizarAlimento(alimento)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300 mr-2"
                    >
                      Actualizar
                    </button>
                    <button
                      onClick={() => handleEliminarAlimento(alimento.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RegistroAlimentosPollos;
