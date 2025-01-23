'use client';

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Plus } from "lucide-react";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";
import { toast } from "@/components/ui/use-toast";
import GeneralStats from "./components/GeneralStats";
import Navbar from "./components/Navbar";
import RazaForm from './components/RazaForm';
import RazaTable from './components/RazaTable';
import { Raza } from './components/types/raza';
import ProductForm from './components/ProductForm';
import InventoryTable from './components/InventoryTable';
import StockAlert from './components/StockAlert';
import { Product, StockAlert as StockAlertType } from './components/types/inventory';
import VacunaConfig from './components/configuracion/VacunaConfig';
import ConfiguracionTabs from './components/configuracion/ConfiguracionTabs';
import { Vacuna, PlanVacunacion, PlanNutricional } from './components/types/configuracion';
import ReportesGenerales from './components/reportes/ReportesGenerales';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    { 
      id: 1, 
      nombre: 'Juan', 
      apellido: 'Pérez',
      nombreUsuario: 'jperez',
      email: 'juan@example.com',
      rol: 'administrador',
      vigencia: 30,
      fechaCreacion: new Date().toISOString(),
      estado: 'activo'
    }
  ]);

  const [razas, setRazas] = useState<Raza[]>([
    {
      id: 1,
      nombre: 'Pollo Broiler',
      tipoAnimal: 'pollo',
      pesoPromedio: 3.5,
      tamanioPromedio: 40,
      edadMadurez: 4,
      tiempoCrecimiento: 4,
      descripcion: 'Raza de pollo de rápido crecimiento',
      imagen: ''
    },
    {
      id: 2,
      nombre: 'Cerdo Landrace',
      tipoAnimal: 'cerdo',
      pesoPromedio: 120,
      tamanioPromedio: 180,
      edadMadurez: 6,
      tiempoCrecimiento: 6,
      descripcion: 'Raza de cerdo de alta producción',
      imagen: ''
    }
  ]);

  const [editingRaza, setEditingRaza] = useState<Raza | null>(null);
  const [isRazaDialogOpen, setIsRazaDialogOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      nombre: 'Alimento Balanceado',
      tipo: 'alimento',
      cantidad: 100,
      unidadMedida: 'kg',
      nivelMinimo: 50,
      precio: 25.99,
      proveedor: 'Nutrición Animal S.A.',
      fechaCompra: new Date().toISOString(),
      descripcion: 'Alimento balanceado para pollos'
    },
    {
      id: 2,
      nombre: 'Vacuna Newcastle',
      tipo: 'vacuna',
      cantidad: 20,
      unidadMedida: 'dosis',
      nivelMinimo: 30,
      precio: 45.50,
      proveedor: 'VetPharma',
      fechaCompra: new Date().toISOString(),
      descripcion: 'Vacuna para prevención de Newcastle'
    }
  ]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);

  const [vacunas, setVacunas] = useState<Vacuna[]>([
    {
      id: 1,
      nombre: 'Newcastle',
      tipoAnimal: 'pollo',
      edad: 7,
      dosis: 0.5,
      unidadDosis: 'ml',
      descripcion: 'Vacuna contra la enfermedad de Newcastle',
      obligatoria: true,
      efectosSecundarios: 'Puede causar leve decaimiento',
      precauciones: 'No aplicar a aves enfermas'
    },
    {
      id: 2,
      nombre: 'Mycoplasma',
      tipoAnimal: 'pollo',
      edad: 14,
      dosis: 0.25,
      unidadDosis: 'ml',
      descripcion: 'Vacuna contra Mycoplasma',
      obligatoria: true
    }
  ]);

  const [planesVacunacion, setPlanesVacunacion] = useState<PlanVacunacion[]>([]);
  const [planesNutricionales, setPlanesNutricionales] = useState<PlanNutricional[]>([
    {
      id: 1,
      nombre: 'Plan Básico Pollos',
      tipoAnimal: 'pollo',
      descripcion: 'Plan nutricional estándar para pollos de engorde',
      fases: [
        {
          id: 1,
          nombre: 'Iniciador',
          diaInicio: 1,
          diaFin: 21,
          consumoDiario: 0.05,
          unidadMedida: 'kg',
          tipoAlimento: 'Concentrado Iniciador',
          proteina: 21,
          energia: 3000
        }
      ],
      activo: true
    }
  ]);

  const pollos = useMemo(() => users.filter(user => user.rol === 'pollos'), [users]);
  const chanchos = useMemo(() => users.filter(user => user.rol === 'chanchos'), [users]);

  const mortalidadPollos = useMemo(() => 
    pollos.filter(pollo => pollo.estado === 'muerto').length, [pollos]
  );
  const mortalidadChanchos = useMemo(() => 
    chanchos.filter(chancho => chancho.estado === 'muerto').length, [chanchos]
  );

  const costoAlimento = 5;
  const consumoDiarioAlimento = 0.5;
  const precioVentaAnimal = 50;

  const stockAlerts = useMemo(() => {
    return products
      .map(product => {
        const porcentajeStock = (product.cantidad / product.nivelMinimo) * 100;
        if (porcentajeStock <= 30) {
          return {
            productId: product.id,
            nombre: product.nombre,
            tipo: product.tipo,
            cantidadActual: product.cantidad,
            nivelMinimo: product.nivelMinimo,
            porcentajeStock
          };
        }
        return null;
      })
      .filter((alert): alert is StockAlertType => alert !== null);
  }, [products]);

  // Agregar datos de ejemplo para reportes
  const datosReportes = {
    lotes: [
      {
        id: 1,
        codigo: 'L001',
        semana: 1,
        peso: 0.5,
        mortalidad: 2,
        crecimiento: 0.3,
        estadoSanitario: 'bueno'
      },
      {
        id: 2,
        codigo: 'L002',
        semana: 2,
        peso: 1.2,
        mortalidad: 1,
        crecimiento: 0.7,
        estadoSanitario: 'bueno'
      }
    ],
    costos: {
      alimentacion: 1500,
      medicinas: 500,
      vacunas: 300,
      total: 2300
    },
    estadisticas: {
      mortalidad: 3,
      crecimientoPromedio: 0.5,
      consumoAlimento: 2.1
    }
  };

  const handleAddUser = (formData: Partial<User>) => {
    try {
      const newUser: User = {
        id: Date.now(),
        nombre: formData.nombre!,
        apellido: formData.apellido!,
        nombreUsuario: formData.nombreUsuario!,
        email: formData.email!,
        rol: formData.rol || 'usuario',
        vigencia: formData.vigencia || 30,
        fechaCreacion: new Date().toISOString(),
        estado: 'activo'
      };

      setUsers(prev => [...prev, newUser]);
      setIsOpen(false);
      
      toast({
        title: "Usuario creado",
        description: `El usuario ${newUser.nombreUsuario} ha sido creado correctamente.`,
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      toast({
        title: "Error",
        description: "Hubo un error al crear el usuario. Por favor, intente nuevamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleEditUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setEditingUser(user);
      setIsOpen(true);
    }
  };

  const handleUpdateUser = (formData: any) => {
    setUsers(prev => prev.map(user => {
      if (user.id === editingUser?.id) {
        return {
          ...user,
          ...formData,
          fechaCreacion: user.fechaCreacion,
          estado: calcularEstadoUsuario(user.fechaCreacion, formData.vigencia)
        };
      }
      return user;
    }));
    setIsOpen(false);
    setEditingUser(null);
    
    toast({
      title: "Usuario actualizado",
      description: "Los datos del usuario han sido actualizados correctamente.",
      variant: "success",
      duration: 3000,
    });
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado correctamente.",
      variant: "success",
      duration: 3000,
    });
  };

  const calcularEstadoUsuario = (fechaCreacion: Date, vigencia: number) => {
    const hoy = new Date();
    const fechaInicio = new Date(fechaCreacion);
    const diasTranscurridos = Math.floor((hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    return diasTranscurridos < vigencia ? 'activo' : 'inactivo';
  };

  const handleAddRaza = (formData: Partial<Raza>) => {
    const newRaza: Raza = {
      id: Date.now(),
      ...formData as Raza
    };

    setRazas(prev => [...prev, newRaza]);
    setIsRazaDialogOpen(false);
    
    toast({
      title: "Raza creada",
      description: `La raza ${newRaza.nombre} ha sido creada correctamente.`,
      variant: "success",
      duration: 3000,
    });
  };

  const handleEditRaza = (id: number) => {
    const raza = razas.find(r => r.id === id);
    if (raza) {
      setEditingRaza(raza);
      setIsRazaDialogOpen(true);
    }
  };

  const handleUpdateRaza = (formData: Partial<Raza>) => {
    setRazas(prev => prev.map(raza => 
      raza.id === editingRaza?.id ? { ...raza, ...formData } : raza
    ));
    setIsRazaDialogOpen(false);
    setEditingRaza(null);
    
    toast({
      title: "Raza actualizada",
      description: "Los datos de la raza han sido actualizados correctamente.",
      variant: "success",
      duration: 3000,
    });
  };

  const handleDeleteRaza = (id: number) => {
    setRazas(razas.filter(raza => raza.id !== id));
    toast({
      title: "Raza eliminada",
      description: "La raza ha sido eliminada correctamente.",
      variant: "success",
      duration: 3000,
    });
  };

  const handleAddProduct = (formData: Partial<Product>) => {
    const newProduct: Product = {
      id: Date.now(),
      ...formData as Product
    };

    setProducts(prev => [...prev, newProduct]);
    setIsInventoryDialogOpen(false);
    
    toast({
      title: "Producto agregado",
      description: `${newProduct.nombre} ha sido agregado al inventario.`,
      variant: "success",
      duration: 3000,
    });
  };

  const handleEditProduct = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setEditingProduct(product);
      setIsInventoryDialogOpen(true);
    }
  };

  const handleUpdateProduct = (formData: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === editingProduct?.id ? { ...product, ...formData } : product
    ));
    setIsInventoryDialogOpen(false);
    setEditingProduct(null);
    
    toast({
      title: "Producto actualizado",
      description: "Los datos del producto han sido actualizados correctamente.",
      variant: "success",
      duration: 3000,
    });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado del inventario.",
      variant: "success",
      duration: 3000,
    });
  };

  const handleAddVacuna = (vacuna: Partial<Vacuna>) => {
    const newVacuna = {
      ...vacuna,
      id: Date.now(),
    } as Vacuna;
    setVacunas([...vacunas, newVacuna]);
    toast({
      title: "Vacuna agregada",
      description: "La vacuna ha sido registrada exitosamente",
    });
  };

  const handleUpdateVacuna = (id: number, vacuna: Partial<Vacuna>) => {
    setVacunas(vacunas.map(v => v.id === id ? { ...v, ...vacuna } : v));
    toast({
      title: "Vacuna actualizada",
      description: "Los datos de la vacuna han sido actualizados",
    });
  };

  const handleDeleteVacuna = (id: number) => {
    setVacunas(vacunas.filter(v => v.id !== id));
    toast({
      title: "Vacuna eliminada",
      description: "La vacuna ha sido eliminada del sistema",
    });
  };

  const handleAddPlanNutricional = (plan: Partial<PlanNutricional>) => {
    const newPlan = {
      ...plan,
      id: Date.now()
    } as PlanNutricional;
    
    setPlanesNutricionales(prev => [...prev, newPlan]);
    toast({
      title: "Plan nutricional creado",
      description: "El plan ha sido registrado exitosamente",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <GeneralStats
            users={users}
            pollos={pollos}
            chanchos={chanchos}
            mortalidadPollos={mortalidadPollos}
            mortalidadChanchos={mortalidadChanchos}
            costoAlimento={costoAlimento}
            consumoDiarioAlimento={consumoDiarioAlimento}
            precioVentaAnimal={precioVentaAnimal}
          />
        );
      case 'usuarios':
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => {
                      setEditingUser(null);
                      setIsOpen(true);
                    }}
                  >
                    <UserPlus className="w-4 h-4" />
                    Agregar Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <UserForm 
                    onSubmit={editingUser ? handleUpdateUser : handleAddUser}
                    initialData={editingUser}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <UserTable 
                users={users}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            </div>
          </>
        );
      case 'razas':
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestión de Razas</h2>
              <Dialog open={isRazaDialogOpen} onOpenChange={setIsRazaDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => {
                      setEditingRaza(null);
                      setIsRazaDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Raza
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <RazaForm 
                    onSubmit={editingRaza ? handleUpdateRaza : handleAddRaza}
                    initialData={editingRaza}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <RazaTable 
                razas={razas}
                onEdit={handleEditRaza}
                onDelete={handleDeleteRaza}
              />
            </div>
          </>
        );
      case 'pollos':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Gestión de Pollos</h2>
            {/* Contenido de pollos */}
          </div>
        );
      case 'chanchos':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Gestión de Chanchos</h2>
            {/* Contenido de chanchos */}
          </div>
        );
      case 'inventario':
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestión de Inventario</h2>
              <Dialog open={isInventoryDialogOpen} onOpenChange={setIsInventoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => {
                      setEditingProduct(null);
                      setIsInventoryDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Producto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <ProductForm 
                    onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                    initialData={editingProduct}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <StockAlert alerts={stockAlerts} />

            <div className="bg-white rounded-lg shadow p-6">
              <InventoryTable 
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            </div>
          </>
        );
      case 'configuracion':
        return (
          <ConfiguracionTabs
            vacunas={vacunas}
            planesVacunacion={planesVacunacion}
            planesNutricionales={planesNutricionales}
            razas={razas}
            onAddVacuna={handleAddVacuna}
            onUpdateVacuna={handleUpdateVacuna}
            onDeleteVacuna={handleDeleteVacuna}
            onAddPlanVacunacion={(plan) => {
              setPlanesVacunacion([...planesVacunacion, { ...plan, id: Date.now() } as PlanVacunacion]);
            }}
            onUpdatePlanVacunacion={(id, plan) => {
              setPlanesVacunacion(planes => planes.map(p => p.id === id ? { ...p, ...plan } : p));
            }}
            onDeletePlanVacunacion={(id) => {
              setPlanesVacunacion(planes => planes.filter(p => p.id !== id));
            }}
            onAddPlanNutricional={handleAddPlanNutricional}
            onUpdatePlanNutricional={(id, plan) => {
              setPlanesNutricionales(planes => 
                planes.map(p => p.id === id ? { ...p, ...plan } : p)
              );
              toast({
                title: "Plan nutricional actualizado",
                description: "El plan ha sido actualizado exitosamente",
              });
            }}
            onDeletePlanNutricional={(id) => {
              setPlanesNutricionales(planes => planes.filter(p => p.id !== id));
              toast({
                title: "Plan nutricional eliminado",
                description: "El plan ha sido eliminado exitosamente",
              });
            }}
          />
        );
      case 'reportes':
        return (
          <ReportesGenerales
            lotes={datosReportes.lotes}
            costos={datosReportes.costos}
            estadisticas={datosReportes.estadisticas}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onTabChange={setActiveTab} activeTab={activeTab} />
      
      <main className="p-8 pt-20">
        <h1 className="text-2xl font-bold mb-6">
          {activeTab === 'general' ? 'Dashboard' : 
           activeTab === 'usuarios' ? 'Usuarios' :
           activeTab === 'razas' ? 'Razas' :
           activeTab === 'pollos' ? 'Pollos' :
           activeTab === 'inventario' ? 'Inventario' :
           activeTab === 'configuracion' ? 'Configuración' :
           activeTab === 'reportes' ? 'Reportes Generales' : 'Chanchos'}
        </h1>
        
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
