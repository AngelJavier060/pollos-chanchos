'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  minimo: number;
  critico: number;
  tipo: 'alimento' | 'medicina' | 'otro';
  estado: 'active' | 'low_stock' | 'critical' | 'cycle_ended';
  ciclo_actual?: {
    id: string;
    fecha_inicio: string;
    fecha_fin?: string;
  };
}

export default function ControlStock() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [alertas, setAlertas] = useState<{
    producto_id: string;
    tipo: 'bajo_stock' | 'critico';
    mensaje: string;
    fecha: string;
  }[]>([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  // Verificar niveles de stock y generar alertas automáticamente
  useEffect(() => {
    const nuevasAlertas = [];
    const productosActualizados = productos.map(producto => {
      let nuevoEstado = producto.estado;
      let registrarHistorial = false;

      // Verificar nivel crítico
      if (producto.cantidad <= producto.critico && producto.estado !== 'cycle_ended') {
        nuevoEstado = 'critical';
        nuevasAlertas.push({
          producto_id: producto.id,
          tipo: 'critico',
          mensaje: `¡CRÍTICO! ${producto.nombre} ha alcanzado el nivel crítico (${producto.cantidad} unidades)`,
          fecha: new Date().toISOString()
        });
        registrarHistorial = true;
      }
      // Verificar nivel mínimo
      else if (producto.cantidad <= producto.minimo && producto.estado === 'active') {
        nuevoEstado = 'low_stock';
        nuevasAlertas.push({
          producto_id: producto.id,
          tipo: 'bajo_stock',
          mensaje: `${producto.nombre} está por debajo del nivel mínimo (${producto.cantidad} unidades)`,
          fecha: new Date().toISOString()
        });
        registrarHistorial = true;
      }

      // Si el estado cambió, actualizar el producto
      if (nuevoEstado !== producto.estado) {
        // Registrar en el historial
        if (registrarHistorial) {
          const historialEntry = {
            id: Date.now().toString(),
            productId: producto.id,
            productName: producto.nombre,
            action: nuevoEstado === 'critical' ? 'cierre_ciclo' : 'alerta_stock',
            quantity: producto.cantidad,
            previousStock: producto.cantidad,
            newStock: producto.cantidad,
            date: new Date().toISOString(),
            reason: nuevoEstado === 'critical' ? 'Cierre automático por nivel crítico' : 'Nivel bajo de stock',
            userId: '1',
            userName: 'Sistema'
          };

          const historial = JSON.parse(localStorage.getItem('inventario_historial') || '[]');
          localStorage.setItem('inventario_historial', JSON.stringify([...historial, historialEntry]));
        }

        return {
          ...producto,
          estado: nuevoEstado,
          ciclo_actual: nuevoEstado === 'critical' ? {
            ...producto.ciclo_actual,
            fecha_fin: new Date().toISOString()
          } : producto.ciclo_actual
        };
      }

      return producto;
    });

    setAlertas(nuevasAlertas);
    if (JSON.stringify(productosActualizados) !== JSON.stringify(productos)) {
      setProductos(productosActualizados);
      localStorage.setItem('productos', JSON.stringify(productosActualizados));
    }
  }, [productos]);

  const fetchProductos = () => {
    const storedProducts = localStorage.getItem('productos');
    if (storedProducts) {
      setProductos(JSON.parse(storedProducts));
    }
  };

  const calcularPorcentajeStock = (cantidad: number, minimo: number) => {
    return Math.min((cantidad / minimo) * 100, 100);
  };

  const getColorPorcentaje = (porcentaje: number) => {
    if (porcentaje <= 25) return "bg-red-500";
    if (porcentaje <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getEstadoLabel = (estado: string) => {
    const labels = {
      'active': 'Activo',
      'low_stock': 'Stock Bajo',
      'critical': 'Crítico',
      'cycle_ended': 'Ciclo Finalizado'
    };
    return labels[estado as keyof typeof labels] || estado;
  };

  const getEstadoColor = (estado: string) => {
    const colors = {
      'active': 'text-green-600',
      'low_stock': 'text-yellow-600',
      'critical': 'text-red-600',
      'cycle_ended': 'text-gray-600'
    };
    return colors[estado as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Alertas de Stock */}
      {alertas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Alertas de Stock</h3>
          {alertas.map((alerta) => (
            <Alert
              key={`${alerta.producto_id}-${alerta.fecha}`}
              variant={alerta.tipo === 'critico' ? "destructive" : "warning"}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {alerta.tipo === 'critico' ? 'Nivel Crítico' : 'Stock Bajo'}
              </AlertTitle>
              <AlertDescription>{alerta.mensaje}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Lista de Productos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto) => (
          <Card key={producto.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {producto.nombre}
              </CardTitle>
              <span className={`text-sm font-medium ${getEstadoColor(producto.estado)}`}>
                {getEstadoLabel(producto.estado)}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{producto.cantidad}</div>
              <Progress
                value={calcularPorcentajeStock(producto.cantidad, producto.minimo)}
                className={getColorPorcentaje(calcularPorcentajeStock(producto.cantidad, producto.minimo))}
              />
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>Crítico: {producto.critico}</span>
                <span>Mínimo: {producto.minimo}</span>
              </div>
              {producto.ciclo_actual && (
                <p className="text-xs text-muted-foreground mt-2">
                  {producto.estado === 'cycle_ended' ? 
                    `Ciclo finalizado: ${new Date(producto.ciclo_actual.fecha_fin!).toLocaleDateString()}` :
                    `Ciclo iniciado: ${new Date(producto.ciclo_actual.fecha_inicio).toLocaleDateString()}`
                  }
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}