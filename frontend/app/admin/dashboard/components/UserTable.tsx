import { Button } from "./ui/button";
import { FC } from "react";
import { User } from "./types/user";

interface UserTableProps {
  users: User[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const UserTable: FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  const calcularDiasRestantes = (user: User) => {
    if (user.rol === 'administrador') {
      return Infinity;
    }

    try {
      const hoy = new Date();
      const fechaCreacion = new Date(user.fechaCreacion);
      const vigenciaTotal = user.vigencia;
      
      const diasTranscurridos = Math.floor(
        (hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      return Math.max(0, vigenciaTotal - diasTranscurridos);
    } catch (error) {
      console.error('Error calculando días restantes:', error);
      return 0;
    }
  };

  const formatearVigencia = (user: User) => {
    if (user.rol === 'administrador') {
      return 'Sin expiración';
    }

    const diasRestantes = calcularDiasRestantes(user);
    if (diasRestantes === 0) return 'Expirado';
    if (diasRestantes === Infinity) return 'Sin expiración';
    return `${diasRestantes} días`;
  };

  const getEstadoStyle = (user: User) => {
    if (user.rol === 'administrador') {
      return 'bg-blue-100 text-blue-800';
    }

    const diasRestantes = calcularDiasRestantes(user);
    if (diasRestantes <= 0) {
      return 'bg-red-100 text-red-800';
    } else if (diasRestantes <= 5) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
      <table className="min-w-full text-sm text-left text-gray-500 divide-y divide-gray-200">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="px-6 py-3">Nombre</th>
            <th className="px-6 py-3">Apellido</th>
            <th className="px-6 py-3">Usuario</th>
            <th className="px-6 py-3">Correo</th>
            <th className="px-6 py-3">Rol</th>
            <th className="px-6 py-3">Vigencia</th>
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const diasRestantes = calcularDiasRestantes(user);
            const estadoStyle = getEstadoStyle(user);
            
            return (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{user.nombre}</td>
                <td className="px-6 py-4">{user.apellido}</td>
                <td className="px-6 py-4">{user.nombreUsuario}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${user.rol === 'administrador' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.rol}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {formatearVigencia(user)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Creado: {new Date(user.fechaCreacion).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${estadoStyle}`}>
                    {user.rol === 'administrador' 
                      ? 'Administrador'
                      : diasRestantes > 0 
                        ? 'Activo' 
                        : 'Inactivo'
                    }
                  </span>
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(user.id)}>Editar</Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(user.id)}>Eliminar</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
