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
        <option value="Duro">Duro</option>
        <option value="Blanco">Blanco</option>
        <option value="Negro">Negro</option>
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
              <th className="border border-gray-300 px-4 py-2">Chanchos</th>
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
                <td className="border border-gray-300 px-4 py-2">{lote.chanchos.length}</td>
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

const RegistroIngresoChanchos = () => {
  const [lote, setLote] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [raza, setRaza] = useState('');
  const [costoLote, setCostoLote] = useState('');
  const [lotesRegistrados, setLotesRegistrados] = useState<any[]>([]);
  const [idActualizando, setIdActualizando] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [vistaFicha, setVistaFicha] = useState<number | null>(null);
  const [chanchos, setChanchos] = useState<any[]>([]);
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
      chanchos: chanchos,
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
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
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

      <LotesTable
        lotesRegistrados={lotesRegistrados}
        handleActualizarLote={handleActualizarLote}
        handleEliminarLote={handleEliminarLote}
        handleVerFicha={handleVerFicha}
      />
    </div>
  );
};

export default RegistroIngresoChanchos;
