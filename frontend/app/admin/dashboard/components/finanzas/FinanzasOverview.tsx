'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { api } from '@/app/lib/api';
import { toast } from "@/app/components/ui/use-toast";
import { DollarSign } from "lucide-react";

interface ResumenFinanciero {
  totalInversion: number;
  inversionPollos: number;
  inversionChanchos: number;
}

export default function FinanzasOverview() {
  const [resumen, setResumen] = useState<ResumenFinanciero>({
    totalInversion: 0,
    inversionPollos: 0,
    inversionChanchos: 0
  });

  useEffect(() => {
    fetchResumenFinanciero();
  }, []);

  const fetchResumenFinanciero = async () => {
    try {
      const productos = await api.get('/api/inventario/productos');
      
      const totales = productos.reduce((acc: ResumenFinanciero, producto: any) => {
        const subtotal = producto.cantidad * producto.precio_unitario;
        
        acc.totalInversion += subtotal;
        
        if (producto.tipo_animal === 'pollos') {
          acc.inversionPollos += subtotal;
        } else if (producto.tipo_animal === 'chanchos') {
          acc.inversionChanchos += subtotal;
        }
        
        return acc;
      }, {
        totalInversion: 0,
        inversionPollos: 0,
        inversionChanchos: 0
      });

      setResumen(totales);
    } catch (error) {
      console.error('Error al cargar datos financieros:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información financiera",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Inversión Total
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(resumen.totalInversion)}</div>
          <p className="text-xs text-muted-foreground">
            Inversión total en inventario
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Inversión en Pollos
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(resumen.inversionPollos)}</div>
          <p className="text-xs text-muted-foreground">
            Total invertido en productos para pollos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Inversión en Chanchos
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(resumen.inversionChanchos)}</div>
          <p className="text-xs text-muted-foreground">
            Total invertido en productos para chanchos
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 