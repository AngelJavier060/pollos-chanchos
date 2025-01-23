'use client';

import { useState, useEffect } from 'react';

// Componente para mostrar mensajes de feedback
const FeedbackMessage = ({ mensaje }: { mensaje: string }) => {
  if (!mensaje) return null;
  return (
    <div className="bg-blue-100 text-blue-700 p-4 rounded-lg mb-6 text-center">
      {mensaje}
    </div>
  );
};

// Componente para los formularios de registro y actualización de lotes
const LoteForm = ({
  lote,
  fechaNacimiento,
  raza,
  costoLote,
  setLote,
  setFechaNacimiento,
  setRaza,
  setCostoLote,
  handleRegistrarOActualizar,
  idActualizando,
}: any) => {
  return (
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
  );
};

// Componente para manejar la tabla de lotes registrados
const LotesTable = ({
  lotesRegistrados,
  handleActualizarLote,
  handleEliminarLote,
  handleVerFicha,
}: any) => {
  return (
    <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Lotes Registrados</h2>
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
            {lotesRegistrados.map((lote: any) => (
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
  );
};

const RegistroIngresoPollos = () => {
  const [lote, setLote] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [raza, setRaza] = useState('');
  const [costoLote, setCostoLote] = useState('');
  const [lotesRegistrados, setLotesRegistrados] = useState<any[]>([]);
  const [idActualizando, setIdActualizando] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [vistaFicha, setVistaFicha] = useState<number | null>(null);
  const [pollos, setPollos] = useState<any[]>([]);
  const [peso, setPeso] = useState('');
  const [talla, setTalla] = useState('');
  const [foto, setFoto] = useState<File | null>(null);

  const normalizarLote = (texto: string) => texto.replace(/\s+/g, '').toLowerCase();

  const mostrarMensaje = (texto: string) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
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

  const handleRegistrarOActualizar = () => {
    if (!validarCampos()) return;

    const nuevoLote = {
      id: idActualizando || new Date().getTime(),
      lote: normalizarLote(lote),
      fecha_nacimiento: fechaNacimiento,
      raza: raza,
      costo_lote: parseFloat(costoLote),
      pollos: pollos,
    };

    if (idActualizando) {
      setLotesRegistrados(lotesRegistrados.map((l) => (l.id === idActualizando ? nuevoLote : l)));
      mostrarMensaje('Lote actualizado con éxito.');
    } else {
      setLotesRegistrados([...lotesRegistrados, nuevoLote]);
      mostrarMensaje('Lote registrado con éxito.');
    }

    limpiarFormulario();
  };

  const handleActualizarLote = (loteSeleccionado: any) => {
    setIdActualizando(loteSeleccionado.id);
    setLote(loteSeleccionado.lote);
    setFechaNacimiento(loteSeleccionado.fecha_nacimiento);
    setRaza(loteSeleccionado.raza);
    setCostoLote(loteSeleccionado.costo_lote.toString());
    mostrarMensaje('Modifica los datos y guarda los cambios.');
  };

  const handleEliminarLote = (id: number) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este lote?');
    if (confirmar) {
      setLotesRegistrados(lotesRegistrados.filter((l) => l.id !== id));
      mostrarMensaje('Lote eliminado con éxito.');
    }
  };

  const handleVerFicha = (id: number) => {
    setVistaFicha(id);
    const loteSeleccionado = lotesRegistrados.find((l) => l.id === id);
    if (loteSeleccionado) {
      setPollos(loteSeleccionado.pollos);
    }
  };

  const handleVolver = () => setVistaFicha(null);

  const agregarPollo = () => {
    if (!peso || !talla || !foto) {
      mostrarMensaje('Por favor, completa todos los campos del pollo.');
      return;
    }

    const nuevoPollo = {
      id: new Date().getTime(),
      peso: parseFloat(peso),
      talla: parseInt(talla, 10),
      foto: URL.createObjectURL(foto),
    };

    setPollos([...pollos, nuevoPollo]);
    mostrarMensaje('Pollo agregado correctamente.');

    setPeso('');
    setTalla('');
    setFoto(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {vistaFicha === null ? (
        <>
          <div className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow-lg">
            <h1 className="text-xl font-bold">Registro de Ingreso de Pollos</h1>
          </div>

          <div className="p-6 flex flex-col items-center">
            <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Registro de Lotes
              </h2>

              <FeedbackMessage mensaje={mensaje} />

              <LoteForm
                lote={lote}
                fechaNacimiento={fechaNacimiento}
                raza={raza}
                costoLote={costoLote}
                setLote={setLote}
                setFechaNacimiento={setFechaNacimiento}
                setRaza={setRaza}
                setCostoLote={setCostoLote}
                handleRegistrarOActualizar={handleRegistrarOActualizar}
                idActualizando={idActualizando}
              />
            </div>

            <LotesTable
              lotesRegistrados={lotesRegistrados}
              handleActualizarLote={handleActualizarLote}
              handleEliminarLote={handleEliminarLote}
              handleVerFicha={handleVerFicha}
            />
          </div>
        </>
      ) : (
        <div className="p-6">
          <div className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow-lg">
            <h1 className="text-xl font-bold">Ficha del Lote</h1>
            <button
              onClick={handleVolver}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
            >
              Volver
            </button>
          </div>

          {/* Agregar Pollos */}
          <div className="text-2xl font-bold mb-4">Agregar Pollos al Lote</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Peso (kg)"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Talla (cm)"
              value={talla}
              onChange={(e) => setTalla(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files ? e.target.files[0] : null)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={agregarPollo}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Agregar Pollo
            </button>
          </div>

          <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Pollos Registrados</h2>
            {pollos.length === 0 ? (
              <p className="text-center text-gray-600">No hay pollos registrados.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Peso</th>
                    <th className="border border-gray-300 px-4 py-2">Talla</th>
                    <th className="border border-gray-300 px-4 py-2">Foto</th>
                    <th className="border border-gray-300 px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pollos.map((pollo: any) => (
                    <tr key={pollo.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{pollo.peso}</td>
                      <td className="border border-gray-300 px-4 py-2">{pollo.talla}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <img
                          src={pollo.foto}
                          alt={`Pollo ${pollo.id}`}
                          className="w-16 h-16 object-cover"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleEliminarPollo(pollo.id)}
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
      )}
    </div>
  );
};

export default RegistroIngresoPollos;
