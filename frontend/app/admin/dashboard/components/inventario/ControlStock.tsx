'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Producto, StockAlert } from '../../types/inventario';
import { api } from '@/app/lib/api';
import { toast } from "@/app/components/ui/use-toast";

export default function ControlStock() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [alertas, setAlertas] = useState<StockAlert[]>([]);

  useEffect(() => {
    fetchProductos();
    fetchAlertas();
  }, []);

  const fetchProductos = async () => {
    try {
      const data = await api.get('/api/inventario/productos');
      setProductos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el inventario",
        variant: "destructive",
      });
    }
  };

  const fetchAlertas = async () => {
    try {
      const data = await api.get('/api/inventario/alertas');
      setAlertas(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las alertas",
        variant: "destructive",
      });
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

  return (
    <div className="space-y-6">
      {/* Alertas de Stock Crítico */}
      {alertas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Alertas de Stock</h3>
          {alertas.map((alerta) => (
            <Alert key={alerta.producto_id} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Nivel Crítico de Stock</AlertTitle>
              <AlertDescription>
                El producto "{alerta.nombre}" tiene un nivel de stock crítico.
                Cantidad actual: {alerta.cantidad_actual} (
                {Math.round(alerta.porcentaje_stock)}% del nivel mínimo)
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Estado del Inventario */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto) => {
          const porcentaje = calcularPorcentajeStock(producto.cantidad, producto.nivel_minimo);
          return (
            <Card key={producto.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {producto.nombre}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Stock Actual: {producto.cantidad} {producto.unidad_medida}</span>
                    <span>{Math.round(porcentaje)}%</span>
                  </div>
                  <Progress 
                    value={porcentaje} 
                    className={getColorPorcentaje(porcentaje)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Crítico: {producto.nivel_critico}</span>
                    <span>Mínimo: {producto.nivel_minimo}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 