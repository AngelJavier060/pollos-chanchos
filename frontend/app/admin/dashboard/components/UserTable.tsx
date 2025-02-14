'use client';

import { FC } from 'react';
import { User } from '../types/user';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { calcularDiasRestantes, obtenerEstadoCuenta, formatearDiasRestantes } from '@/app/lib/dateUtils';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const UserTable: FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  console.log('Usuarios recibidos en la tabla:', users); // Debug

  if (!users?.length) {
    return <div className="text-center py-4">No hay usuarios registrados</div>;
  }

  const getEstadoVencimiento = (fechaRegistro: string, vigencia: number) => {
    if (!fechaRegistro || !vigencia) return { texto: 'No disponible', clase: 'text-gray-500' };
    
    const fechaVencimiento = addDays(new Date(fechaRegistro), vigencia);
    const hoy = new Date();
    const diasRestantes = Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) {
      return {
        texto: 'Expirado',
        clase: 'bg-red-100 text-red-800'
      };
    }
    if (diasRestantes <= 5) {
      return {
        texto: `${diasRestantes} días`,
        clase: 'bg-red-100 text-red-800'
      };
    }
    if (diasRestantes <= 15) {
      return {
        texto: `${diasRestantes} días`,
        clase: 'bg-yellow-100 text-yellow-800'
      };
    }
    return {
      texto: format(fechaVencimiento, "d 'de' MMMM, yyyy", { locale: es }),
      clase: 'bg-green-100 text-green-600'
    };
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombres</TableHead>
          <TableHead>Apellidos</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Vigencia</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.nombre}</TableCell>
            <TableCell>{user.apellido}</TableCell>
            <TableCell>{user.usuario}</TableCell>
            <TableCell>{user.correo}</TableCell>
            <TableCell>
              {user.rol === 'admin' ? 'Administrador' : 
               user.rol === 'pollo' ? 'Usuario de Pollo' : 
               user.rol === 'chancho' ? 'Usuario de Chancho' : 'Usuario'}
            </TableCell>
            <TableCell>
              {user.rol === 'admin' ? 'N/A' : `${user.vigencia} días`}
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                user.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.estado ? 'Activo' : 'Inactivo'}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(user)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(user.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;