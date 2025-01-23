'use client';

import React, { FC, useState, useEffect } from 'react';
import { Card } from "../ui/card";
import { Eye, DollarSign, Package, TrendingUp, ShoppingCart, Plus } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";

// Importación dinámica de los componentes de Recharts
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });

interface Lote {
  id: number;
  codigo: string;
  cantidad: number;
  fechaIngreso: string;
  estado: 'activo' | 'finalizado';
}

// Componente de carga mientras se cargan los gráficos
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-[300px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

const RegistroLotes: FC = () => {
  const [sortBy, setSortBy] = useState('Yearly');
  const [viewType, setViewType] = useState('Monthly');
  const [isClient, setIsClient] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [formData, setFormData] = useState({
    codigo: '',
    cantidad: '',
    fechaIngreso: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLote: Lote = {
      id: Date.now(),
      codigo: formData.codigo,
      cantidad: Number(formData.cantidad),
      fechaIngreso: formData.fechaIngreso,
      estado: 'activo'
    };

    setLotes([...lotes, newLote]);
    setIsDialogOpen(false);
    setFormData({
      codigo: '',
      cantidad: '',
      fechaIngreso: new Date().toISOString().split('T')[0]
    });
  };

  // Datos de facturación
  const invoiceData = {
    totalRevenue: "$9,542.00",
    period: "From Jan 20,2024 to July,2024",
    netProfit: "3,526.56",
    netRevenue: "5,324.85",
  };

  // Datos de estadísticas de órdenes
  const orderStats = [
    { name: "Order Completed", value: 56236, percentage: "67.2%" },
    { name: "Order Processing", value: 12596, percentage: "15.2%" },
    { name: "Order Cancel", value: 1568, percentage: "5.6%" }
  ];

  // Datos de seguimiento de productos
  const productTracking = [
    {
      status: "Have 5 pending order",
      date: "Nov 02",
      timeAgo: "6 hour ago",
      type: "Delivered"
    },
    {
      status: "New Order Received",
      date: "Nov 03",
      timeAgo: "1 day ago",
      type: "Pick Up"
    },
    // ... más datos de seguimiento
  ];

  // Datos para el gráfico de barras mensual
  const monthlyData = [
    { month: 'Jan', value: 90, previousValue: 75 },
    { month: 'Feb', value: 40, previousValue: 25 },
    { month: 'Mar', value: 70, previousValue: 50 },
    { month: 'Apr', value: 60, previousValue: 40 },
    { month: 'May', value: 50, previousValue: 35 },
    { month: 'June', value: 35, previousValue: 25 },
    { month: 'July', value: 30, previousValue: 20 },
  ];

  return (
    <div className="p-6">
      {/* Panel Superior con botón de registro */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard de Pollos</h1>
        </div>
        <div className="flex gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Lote
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Lote</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Código del Lote</label>
                  <Input
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    placeholder="Ej: L001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cantidad</label>
                  <Input
                    type="number"
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                    placeholder="Cantidad de pollos"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de Ingreso</label>
                  <Input
                    type="date"
                    value={formData.fechaIngreso}
                    onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Registrar</Button>
              </form>
            </DialogContent>
          </Dialog>
          <select 
            className="px-4 py-2 border rounded-lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Yearly">Yearly</option>
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sección de Facturación */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Total Revenue:</h2>
          <div className="text-3xl font-bold mb-2">{invoiceData.totalRevenue}</div>
          <div className="text-sm text-gray-500 mb-4">{invoiceData.period}</div>
          
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Net Profit</div>
              <div className="text-lg font-semibold">${invoiceData.netProfit}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Net Revenue</div>
              <div className="text-lg font-semibold">${invoiceData.netRevenue}</div>
            </div>
          </div>
        </Card>

        {/* Gráfico de Barras */}
        <Card className="col-span-2 p-6">
          {!isClient ? <LoadingSpinner /> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
                <Bar dataKey="previousValue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Estadísticas de Órdenes */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Order Stats</h2>
            <select 
              className="px-3 py-1 border rounded-lg text-sm"
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
          
          {!isClient ? <LoadingSpinner /> : (
            <PieChart width={300} height={300}>
              <Pie
                data={orderStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              />
              <Tooltip />
            </PieChart>
          )}
          
          <div className="mt-4 space-y-2">
            {orderStats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${index === 0 ? 'blue' : index === 1 ? 'green' : 'red'}-500`}></div>
                  <span>{stat.name}</span>
                </div>
                <span className="font-semibold">{stat.percentage}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Seguimiento de Productos */}
        <Card className="col-span-2 p-6">
          <h2 className="text-lg font-semibold mb-4">Product Tracking</h2>
          <div className="space-y-4">
            {productTracking.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    item.type === 'Delivered' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <Package className={`w-5 h-5 ${
                      item.type === 'Delivered' ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">{item.status}</div>
                    <div className="text-sm text-gray-500">{item.timeAgo}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{item.date}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Botón flotante para volver al dashboard */}
      <Link href="/admin/dashboard">
        <button className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
          <TrendingUp className="w-6 h-6" />
        </button>
      </Link>
    </div>
  );
};

export default RegistroLotes; 