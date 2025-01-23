'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const RegistroIngresoPollos = () => {
  const router = useRouter();
  const [lote, setLote] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [raza, setRaza] = useState('');
  const [costoLote, setCostoLote] = useState('');
  const [lotesRegistrados, setLotesRegistrados] = useState([]);
  const [idActualizando, setIdActualizando] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [vistaFicha, setVistaFicha] = useState<number | null>(null);

  const normalizarLote = (texto: string) => texto.replace(/\s+/g, '').toLowerCase();

  const mostrarMensaje = (texto: string) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  // Obtener los lotes desde el backend al cargar el componente
  useEffect(() => {
    fetchLotes();
  }, []);

  const fetchLotes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/lotes/');
      setLotesRegistrados(response.data);
    } catch (error) {
      console.error('Error al obtener los lotes:', error);
      mostrarMensaje('Error al obtener los lotes.');
    }
  };

  const validarCampos = () => {
    const loteNormalizado = normalizarLote(lote);

    if (!loteNormalizado || !fechaNacimiento || !raza || !costoLote) {
      mostrarMensaje('Por favor, completa todos los campos.');
      return false;
    }

    const loteDuplicado = lotesRegistrados.some(
      (l) => normalizarLote(l.lote) === loteNormalizado
    );

    if (!idActualizando && loteDuplicado) {
      mostrarMensaje('El código del lote ya existe. Por favor, usa uno único.');
      return false;
    }

    return true;
  };

  const handleRegistrarOActualizar = async () => {
    if (!validarCampos()) return;

    const nuevoLote = {
      lote: normalizarLote(lote),
      fecha_nacimiento: fechaNacimiento,
      raza: raza,
      costo_lote: parseFloat(costoLote),
    };

    try {
      if (idActualizando) {
        // Actualizar Lote
        await axios.put(`http://localhost:8000/lotes/${idActualizando}/`, nuevoLote);
        mostrarMensaje('Lote actualizado con éxito.');
      } else {
        // Crear Lote
        await axios.post('http://localhost:8000/lotes/', nuevoLote);
        mostrarMensaje('Lote registrado con éxito.');
      }
      fetchLotes();
      limpiarFormulario();
    } catch (error) {
      console.error('Error al registrar/actualizar lote:', error);
      mostrarMensaje('Error al registrar/actualizar lote.');
    }
  };

  const handleActualizarLote = (loteSeleccionado: any) => {
    setIdActualizando(loteSeleccionado.id);
    setLote(loteSeleccionado.lote);
    setFechaNacimiento(loteSeleccionado.fecha_nacimiento);
    setRaza(loteSeleccionado.raza);
    setCostoLote(loteSeleccionado.costo_lote.toString());
    mostrarMensaje('Modifica los datos y guarda los cambios.');
  };

  const handleEliminarLote = async (id: number) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este lote?');
    if (confirmar) {
      try {
        await axios.delete(`http://localhost:8000/lotes/${id}/`);
        mostrarMensaje('Lote eliminado con éxito.');
        fetchLotes();
      } catch (error) {
        console.error('Error al eliminar lote:', error);
        mostrarMensaje('Error al eliminar lote.');
      }
    }
  };

  const limpiarFormulario = () => {
    setIdActualizando(null);
    setLote('');
    setFechaNacimiento('');
    setRaza('');
    setCostoLote('');
  };

  const handleVerFicha = (id: number) => {
    setVistaFicha(id);
  };

  const handleVolver = () => setVistaFicha(null);

  // Función para agregar Pollo mediante el backend
  const agregarPollo = async (idLote: number, talla: string, peso: string, foto: File | null) => {
    try {
      // Crear el Pollo en el backend
      const response = await axios.post('http://localhost:8000/chickens/', {
        batch_id: idLote,
        weight: parseFloat(peso),
        health_status: 'Healthy', // Puedes ajustar esto según tus necesidades
        age: parseInt(talla, 10), // Asumiendo que 'talla' corresponde a la edad
      });

      // Si hay una foto, podrías implementar una lógica para subirla y asociarla al pollo
      // Por simplicidad, esto no se implementa aquí

      mostrarMensaje('Pollo agregado correctamente.');
      fetchLotes();
    } catch (error) {
      console.error('Error al agregar pollo:', error);
      mostrarMensaje('Error al agregar pollo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {vistaFicha === null ? (
        <>
          {/* Vista Principal */}
          <div className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow-lg">
            <h1 className="text-xl font-bold">Registro de Ingreso de Pollos</h1>
          </div>

          <div className="p-6 flex flex-col items-center">
            <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Registro de Lotes
              </h2>

              {mensaje && (
                <div className="bg-blue-100 text-blue-700 p-4 rounded-lg mb-6 text-center">
                  {mensaje}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegistrarOActualizar();
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  placeholder="Código del Lote"
                  value={lote}
                  onChange={(e) => setLote(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={raza}
                  onChange={(e) => setRaza(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar Raza</option>
                  <option value="Criollo">Criollo</option>
                  <option value="Camperos">Camperos</option>
                  <option value="Pios">Pios</option>
                </select>
                <input
                  type="number"
                  placeholder="Costo del Lote (USD)"
                  value={costoLote}
                  onChange={(e) => setCostoLote(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="col-span-1 md:col-span-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  {idActualizando ? 'Actualizar Lote' : 'Registrar Lote'}
                </button>
              </form>
            </div>

            {/* Tabla de Lotes */}
            <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6 mt-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Lotes Registrados
              </h2>
              {lotesRegistrados.length === 0 ? (
                <p className="text-center text-gray-600">No hay lotes registrados.</p>
              ) : (
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2">Lote</th>
                      <th className="border border-gray-300 px-4 py-2">Fecha</th>
                      <th className="border border-gray-300 px-4 py-2">Raza</th>
                      <th className="border border-gray-300 px-4 py-2">Costo</th>
                      <th className="border border-gray-300 px-4 py-2">Pollos</th>
                      <th className="border border-gray-300 px-4 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lotesRegistrados.map((lote) => (
                      <tr key={lote.id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2">{lote.lote}</td>
                        <td className="border border-gray-300 px-4 py-2">{lote.fecha_nacimiento}</td>
                        <td className="border border-gray-300 px-4 py-2">{lote.raza}</td>
                        <td className="border border-gray-300 px-4 py-2">${lote.costo_lote.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2">{lote.pollos.length}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <button
                            onClick={() => handleActualizarLote(lote)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300 mr-2"
                          >
                            Actualizar
                          </button>
                          <button
                            onClick={() => handleEliminarLote(lote.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300 mr-2"
                          >
                            Eliminar
                          </button>
                          <button
                            onClick={() => handleVerFicha(lote.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-300"
                          >
                            Ficha
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Vista Ficha */}
          <div className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow-lg">
            <h1 className="text-xl font-bold">Ficha del Lote</h1>
            <button
              onClick={handleVolver}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
            >
              Volver
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Agregar Pollos al Lote</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const talla = form.talla.value;
                const peso = form.peso.value;
                const foto = form.foto.files ? form.foto.files[0] : null;
                await agregarPollo(vistaFicha!, talla, peso, foto);
                // Limpiar campos de formulario
                form.reset();
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            >
              <input
                type="text"
                name="talla"
                placeholder="Talla (cm)"
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="peso"
                placeholder="Peso (kg)"
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="file"
                name="foto"
                accept="image/*"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Agregar Pollo
              </button>
            </form>

            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Código</th>
                  <th className="border border-gray-300 px-4 py-2">Talla</th>
                  <th className="border border-gray-300 px-4 py-2">Peso</th>
                  <th className="border border-gray-300 px-4 py-2">Foto</th>
                </tr>
              </thead>
              <tbody>
                {lotesRegistrados
                  .find((l) => l.id === vistaFicha)
                  ?.pollos.map((pollo: any) => (
                    <tr key={pollo.id}>
                      <td className="border px-4 py-2">{pollo.codigo}</td>
                      <td className="border px-4 py-2">{pollo.talla}</td>
                      <td className="border px-4 py-2">{pollo.peso}</td>
                      <td className="border px-4 py-2">
                        {pollo.foto ? (
                          <img
                            src={pollo.foto}
                            alt={`Pollo ${pollo.codigo}`}
                            className="w-16 h-16 object-cover"
                          />
                        ) : (
                          'Sin Foto'
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default RegistroIngresoPollos;
