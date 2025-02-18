'use client';

import { useEffect, useState } from 'react';
import { toast } from '@/app/components/ui/use-toast';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useTheme } from "next-themes";

interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  usuario: string;
  correo: string;
  rol: string;
  estado: number;
  vigencia: number;
  fecha_registro: string;
}

// Datos de ejemplo para desarrollo
const usuariosEjemplo: Usuario[] = [
  {
    id: 1,
    nombres: "Angel",
    apellidos: "Guerrero",
    cedula: "1234567890",
    usuario: "admin",
    correo: "admin@ejemplo.com",
    rol: "admin",
    estado: 1,
    vigencia: 0,
    fecha_registro: new Date().toISOString().split('T')[0]
  },
  {
    id: 2,
    nombres: "Usuario",
    apellidos: "Uno",
    cedula: "1234567891",
    usuario: "usuario1",
    correo: "usuario1@ejemplo.com",
    rol: "pollos",
    estado: 1,
    vigencia: 30,
    fecha_registro: new Date().toISOString().split('T')[0]
  },
  {
    id: 3,
    nombres: "Usuario",
    apellidos: "Dos",
    cedula: "1234567892",
    usuario: "usuario2",
    correo: "usuario2@ejemplo.com",
    rol: "chanchos",
    estado: 1,
    vigencia: 15, // Usuario con alerta temprana (alerta verde)
    fecha_registro: "2024-03-22"
  },
  {
    id: 4,
    nombres: "Usuario",
    apellidos: "Tres",
    cedula: "1234567893",
    usuario: "usuario3",
    correo: "usuario3@ejemplo.com",
    rol: "pollos",
    estado: 1,
    vigencia: 1, // Usuario a punto de caducar (alerta roja)
    fecha_registro: "2024-03-22"
  }
];

// Primero, actualicemos la interfaz Usuario para manejar correctamente la vigencia
interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  usuario: string;
  correo: string;
  rol: string;
  estado: number;
  vigencia: number;  // Cambiamos de number | null a number
  fecha_registro: string;
}

// Función auxiliar para calcular días restantes con manejo de nulos
const calcularDiasRestantes = (fechaRegistro: string, vigenciaDias: number): number => {
  if (vigenciaDias === 0) return 0;
  
  const fechaInicio = new Date(fechaRegistro);
  const fechaVencimiento = new Date(fechaInicio);
  fechaVencimiento.setDate(fechaVencimiento.getDate() + vigenciaDias);
  const hoy = new Date();
  
  const diferencia = fechaVencimiento.getTime() - hoy.getTime();
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

// Función para obtener el estilo de alerta según los días restantes
const getAlertStyle = (diasRestantes: number | null, rol: string) => {
  if (rol === 'admin' || diasRestantes === null) {
    return 'text-gray-500';
  }
  
  if (diasRestantes <= 0) {
    return 'bg-red-100 text-red-800';
  }
  if (diasRestantes <= 5) {
    return 'bg-yellow-100 text-yellow-800';
  }
  if (diasRestantes <= 15) {
    return 'bg-green-100 text-green-800';
  }
  return 'text-gray-500';
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Estado para el formulario
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    usuario: '',
    correo: '',
    password: '',
    rol: 'pollos',
    vigencia: 30, // Valor por defecto
    estado: 1
  });

  const { theme } = useTheme();

  useEffect(() => {
    // Simulamos la carga de datos
    setTimeout(() => {
      setUsuarios(usuariosEjemplo);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCrearUsuario = () => {
    // Validación de campos obligatorios
    if (!nuevoUsuario.nombres || !nuevoUsuario.apellidos || !nuevoUsuario.cedula || 
        !nuevoUsuario.usuario || !nuevoUsuario.correo) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    // Si el usuario ya existe (actualización)
    const usuarioExistente = usuarios.find(u => u.usuario === nuevoUsuario.usuario);
    if (usuarioExistente) {
      const usuariosActualizados = usuarios.map(u => 
        u.id === usuarioExistente.id ? {...nuevoUsuario, id: u.id, fecha_registro: u.fecha_registro} : u
      );
      setUsuarios(usuariosActualizados);
      toast({
        title: "Usuario actualizado",
        description: "El usuario ha sido actualizado exitosamente",
      });
    } else {
      // Crear nuevo usuario
      const usuario: Usuario = {
        id: usuarios.length + 1,
        nombres: nuevoUsuario.nombres,
        apellidos: nuevoUsuario.apellidos,
        cedula: nuevoUsuario.cedula,
        usuario: nuevoUsuario.usuario,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
        estado: nuevoUsuario.estado,
        vigencia: nuevoUsuario.rol === 'admin' ? 0 : nuevoUsuario.vigencia,
        fecha_registro: new Date().toISOString().split('T')[0]
      };
      setUsuarios([...usuarios, usuario]);
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente",
      });
    }

    // Cerrar el modal y limpiar el formulario
    setIsDialogOpen(false);
    setNuevoUsuario({
      nombres: '',
      apellidos: '',
      cedula: '',
      usuario: '',
      correo: '',
      password: '',
      rol: 'pollos',
      vigencia: 30, // Valor por defecto
      estado: 1
    });
  };

  const handleEliminarUsuario = (id: number) => {
    const nuevosUsuarios = usuarios.filter(usuario => usuario.id !== id);
    setUsuarios(nuevosUsuarios);
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado exitosamente",
    });
  };

  const handleActualizarUsuario = (usuario: Usuario) => {
    setNuevoUsuario({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      cedula: usuario.cedula,
      usuario: usuario.usuario,
      correo: usuario.correo,
      password: '',
      rol: usuario.rol,
      vigencia: usuario.vigencia,
      estado: usuario.estado
    });
    setIsDialogOpen(true);
  };

  const handleRolChange = (value: string) => {
    setNuevoUsuario({
      ...nuevoUsuario,
      rol: value,
      vigencia: value === 'admin' ? 0 : 30 // Usamos 0 en lugar de null para admin
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-96">Cargando usuarios...</div>;
  }

  // Agregar un resumen de alertas en la parte superior de la tabla
  const AlertasResumen = () => {
    const { theme } = useTheme();
    const usuariosProximosACaducar = usuarios.filter(usuario => {
      if (usuario.rol === 'admin') return false;
      const diasRestantes = calcularDiasRestantes(usuario.fecha_registro, usuario.vigencia);
      return diasRestantes !== null && diasRestantes <= 15;
    });

    if (usuariosProximosACaducar.length === 0) return null;

    return (
      <div className="mb-6">
        <div className={`rounded-lg shadow-md ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        } p-4`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Alertas de Vigencia
          </h3>
          <div className="space-y-2">
            {usuariosProximosACaducar.map(usuario => {
              const diasRestantes = calcularDiasRestantes(usuario.fecha_registro, usuario.vigencia);
              return (
                <div 
                  key={usuario.id}
                  className={`p-3 rounded-md border ${
                    theme === 'dark' 
                      ? 'border-gray-700 bg-gray-700/50' 
                      : 'border-gray-200'
                  } ${getAlertStyle(diasRestantes, usuario.rol)}`}
                >
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {usuario.nombres} {usuario.apellidos}
                  </span>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {' - '}
                    {diasRestantes !== null && diasRestantes <= 0 
                      ? 'Usuario caducado'
                      : `${diasRestantes} días para caducar`
                    }
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-6 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className={`rounded-lg shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } p-6`}>
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Usuarios del Sistema
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Crear Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombres" className="text-right">
                    Nombres
                  </Label>
                  <Input
                    id="nombres"
                    className="col-span-3"
                    value={nuevoUsuario.nombres}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombres: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apellidos" className="text-right">
                    Apellidos
                  </Label>
                  <Input
                    id="apellidos"
                    className="col-span-3"
                    value={nuevoUsuario.apellidos}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, apellidos: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cedula" className="text-right">
                    Cédula
                  </Label>
                  <Input
                    id="cedula"
                    className="col-span-3"
                    value={nuevoUsuario.cedula}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, cedula: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="usuario" className="text-right">
                    Usuario
                  </Label>
                  <Input
                    id="usuario"
                    className="col-span-3"
                    value={nuevoUsuario.usuario}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, usuario: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="correo" className="text-right">
                    Correo
                  </Label>
                  <Input
                    id="correo"
                    type="email"
                    className="col-span-3"
                    value={nuevoUsuario.correo}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, correo: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="col-span-3"
                    value={nuevoUsuario.password}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rol" className="text-right">
                    Rol
                  </Label>
                  <Select
                    value={nuevoUsuario.rol}
                    onValueChange={handleRolChange}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="pollos">Pollos</SelectItem>
                      <SelectItem value="chanchos">Chanchos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {nuevoUsuario.rol !== 'admin' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="vigencia" className="text-right">
                      Días de Vigencia
                    </Label>
                    <Input
                      id="vigencia"
                      type="number"
                      min="1"
                      className="col-span-3"
                      value={nuevoUsuario.vigencia || 30}
                      onChange={(e) => {
                        const valor = e.target.value ? Math.max(1, parseInt(e.target.value)) : 30;
                        setNuevoUsuario({
                          ...nuevoUsuario,
                          vigencia: valor
                        });
                      }}
                      placeholder="Ingrese los días de vigencia"
                      required
                    />
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="estado" className="text-right">
                    Estado
                  </Label>
                  <Select
                    value={nuevoUsuario.estado.toString()}
                    onValueChange={(value) => setNuevoUsuario({...nuevoUsuario, estado: Number(value)})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Activo</SelectItem>
                      <SelectItem value="0">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCrearUsuario}>
                  Guardar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <AlertasResumen />
        
        <div className={`rounded-lg border ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        } overflow-hidden`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Nombres
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Apellidos
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Cédula
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Usuario
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Correo
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Rol
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Vigencia (días)
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Estado
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={`${
              theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
            }`}>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className={`
                  ${theme === 'dark' ? 
                    'hover:bg-gray-700 border-gray-700' : 
                    'hover:bg-gray-50 border-gray-200'
                  }
                  ${usuario.rol !== 'admin' && 
                    calcularDiasRestantes(usuario.fecha_registro, usuario.vigencia) <= 5 && 
                    calcularDiasRestantes(usuario.fecha_registro, usuario.vigencia) > 0
                      ? theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50' 
                      : ''
                  }
                  border-b
                `}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {usuario.nombres}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {usuario.apellidos}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {usuario.cedula}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {usuario.usuario}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {usuario.correo}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      usuario.rol === 'admin' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                        : usuario.rol === 'pollos' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {usuario.rol === 'admin' ? (
                      <span className="text-gray-500">Sin caducidad</span>
                    ) : (
                      <>
                        {(() => {
                          const diasRestantes = calcularDiasRestantes(usuario.fecha_registro, usuario.vigencia);
                          const estilo = getAlertStyle(diasRestantes, usuario.rol);
                          
                          return (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estilo}`}>
                              {diasRestantes !== null ? (
                                diasRestantes <= 0 ? 
                                  'Caducado' : 
                                  `${diasRestantes} días restantes`
                              ) : (
                                'Sin vigencia'
                              )}
                            </span>
                          );
                        })()}
                      </>
                    )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      usuario.estado === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {usuario.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm space-x-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`
                        ${theme === 'dark' 
                          ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }
                        border border-current
                      `}
                      onClick={() => handleActualizarUsuario(usuario)}
                    >
                      Actualizar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`
                        ${theme === 'dark'
                          ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }
                        border border-current
                      `}
                      onClick={() => {
                        if (window.confirm('¿Está seguro de eliminar este usuario?')) {
                          handleEliminarUsuario(usuario.id);
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}