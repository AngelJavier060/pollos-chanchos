'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/app/components/ui/card";
import { DashboardCharts } from '@/app/components/charts/DashboardCharts';
import { 
  Users, PiggyBank, Bird, DollarSign, 
  TrendingUp, ShoppingCart, AlertCircle, 
  Activity 
} from 'lucide-react';
import { api } from '@/app/lib/api';
import { toast } from "@/app/components/ui/use-toast";
import { CostosLineChart } from '@/app/components/charts/CostosLineChart';

interface DashboardStats {
  usuarios: {
    total: number;
    activos: number;
    porExpirar: number;
    conectados: number;
  };
  pollos: {
    total: number;
    activos: number;
    vendidos: number;
    costoTotal: number;
    ingresoTotal: number;
  };
  chanchos: {
    total: number;
    activos: number;
    vendidos: number;
    costoTotal: number;
    ingresoTotal: number;
  };
  finanzas: {
    inversionTotal: number;
    ingresoTotal: number;
    gananciaNeta: number;
  };
  notificaciones: {
    total: number;
    noLeidas: number;
  };
}

const initialStats: DashboardStats = {
  usuarios: { total: 0, activos: 0, porExpirar: 0, conectados: 0 },
  pollos: { total: 0, activos: 0, vendidos: 0, costoTotal: 0, ingresoTotal: 0 },
  chanchos: { total: 0, activos: 0, vendidos: 0, costoTotal: 0, ingresoTotal: 0 },
  finanzas: { inversionTotal: 0, ingresoTotal: 0, gananciaNeta: 0 },
  notificaciones: { total: 0, noLeidas: 0 }
};

export const GeneralView = () => {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [actividadData, setActividadData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inversionTotal, setInversionTotal] = useState(0);
  const [costosData, setCostosData] = useState([]);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      // Obtener estadísticas de usuarios
      const usuariosData = await api.get('/usuarios/stats');
      
      setStats(prev => ({
        ...prev,
        usuarios: {
          total: usuariosData?.total ?? 0,
          activos: usuariosData?.activos ?? 0,
          conectados: usuariosData?.conectados ?? 0,
          porExpirar: usuariosData?.porExpirar ?? 0
        }
      }));
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast({
        title: "Error",
        description: "Error al cargar estadísticas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
    const interval = setInterval(cargarEstadisticas, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const calcularInversion = async () => {
      try {
        const response = await api.get('/inventario/productos');
        const productos = response.data || []; // Asegurarnos de que tenemos un array
        
        // Solo sumar los costos unitarios
        let total = 0;
        if (Array.isArray(productos) && productos.length > 0) {
          productos.forEach((producto: any) => {
            if (producto.estado) {
              const precioUnitario = Number(producto.precio_unitario);
              total += precioUnitario;
              
              console.log('Precio unitario de:', producto.nombre, ':', precioUnitario);
            }
          });
        }

        console.log('Total de costos unitarios:', total);
        setInversionTotal(total);
        
        setStats(prev => ({
          ...prev,
          finanzas: {
            ...prev.finanzas,
            inversionTotal: total
          }
        }));
      } catch (error) {
        console.error('Error al calcular inversión:', error);
      }
    };

    calcularInversion();
  }, []);

  useEffect(() => {
    cargarCostosMensuales();
  }, []);

  const cargarCostosMensuales = async () => {
    try {
      const productos = await api.get('/inventario/productos');
      
      // Agrupar por mes y tipo de animal
      const costosPorMes = productos?.reduce((acc: any[], producto: any) => {
        if (producto.estado) {
          const fecha = new Date(producto.fecha_compra);
          acc.push({
            mes: fecha.getMonth(),
            tipo: producto.tipo_animal,
            monto: producto.precio_unitario
          });
        }
        return acc;
      }, []) ?? [];

      setCostosData(costosPorMes);
    } catch (error) {
      console.error('Error al cargar costos:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando estadísticas...</div>;
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const costoTotal = costosData?.reduce((acc, costo) => acc + costo.monto, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Estadísticas de Usuarios */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usuarios.total}</div>
            <div className="text-xs text-muted-foreground">
              {stats.usuarios.activos} activos • {stats.usuarios.conectados} conectados
            </div>
            {stats.usuarios.porExpirar > 0 && (
              <div className="text-xs text-orange-500 mt-1">
                {stats.usuarios.porExpirar} por expirar
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estadísticas de Pollos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pollos</CardTitle>
            <Bird className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pollos.total}</div>
            <div className="text-xs text-muted-foreground">
              {stats.pollos.activos} activos · {stats.pollos.vendidos} vendidos
            </div>
            <div className="text-xs text-green-600 mt-1">
              Ingresos: {formatMoney(stats.pollos.ingresoTotal)}
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas de Chanchos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chanchos</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.chanchos.total}</div>
            <div className="text-xs text-muted-foreground">
              {stats.chanchos.activos} activos · {stats.chanchos.vendidos} vendidos
            </div>
            <div className="text-xs text-green-600 mt-1">
              Ingresos: {formatMoney(stats.chanchos.ingresoTotal)}
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas Financieras */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Finanzas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('es-SV', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(inversionTotal)}
            </div>
            <div className="text-xs text-muted-foreground">
              Inversión total en inventario
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Valor sin formato: {inversionTotal}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráficas */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Costos Unitarios por Mes</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <CostosLineChart data={costosData} />
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Notificaciones Recientes</CardTitle>
              <div className="flex items-center gap-2">
                {stats.notificaciones.noLeidas > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                    {stats.notificaciones.noLeidas} nuevas
                  </span>
                )}
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Se ha removido el componente NotificacionesList */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 