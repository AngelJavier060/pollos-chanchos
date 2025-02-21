'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { DatePickerWithRange } from "@/app/components/ui/date-range-picker";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HistorialEntry {
  id: string;
  productId: string;
  productName: string;
  action: 'entrada' | 'salida' | 'ajuste' | 'cierre_ciclo' | 'inicio_ciclo' | 'consumo_diario';
  quantity: number;
  previousStock: number;
  newStock: number;
  date: string;
  reason: string;
  userId: string;
  userName: string;
  consumoDiario?: {
    cantidadPorPollo?: number;
    numeroPollos?: number;
  };
}

export default function HistorialPage() {
  const [historial, setHistorial] = useState<HistorialEntry[]>([]);
  const [filteredHistorial, setFilteredHistorial] = useState<HistorialEntry[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [filterType, setFilterType] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedHistorial = localStorage.getItem('inventario_historial');
    if (storedHistorial) {
      const parsed = JSON.parse(storedHistorial);
      setHistorial(parsed);
      setFilteredHistorial(parsed);
    }
  }, []);

  useEffect(() => {
    let filtered = [...historial];

    // Filtrar por tipo de acción
    if (filterType !== "todos") {
      filtered = filtered.filter(entry => entry.action === filterType);
    }

    // Filtrar por rango de fechas
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= dateRange.from && entryDate <= dateRange.to;
      });
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHistorial(filtered);
  }, [filterType, dateRange, searchTerm, historial]);

  const getActionLabel = (action: string) => {
    const labels = {
      'entrada': 'Entrada',
      'salida': 'Salida',
      'ajuste': 'Ajuste',
      'cierre_ciclo': 'Cierre de Ciclo',
      'inicio_ciclo': 'Inicio de Ciclo',
      'consumo_diario': 'Consumo Diario'
    };
    return labels[action as keyof typeof labels] || action;
  };

  const getActionColor = (action: string) => {
    const colors = {
      'entrada': 'text-green-600',
      'salida': 'text-red-600',
      'ajuste': 'text-yellow-600',
      'cierre_ciclo': 'text-orange-600',
      'inicio_ciclo': 'text-blue-600',
      'consumo_diario': 'text-purple-600'
    };
    return colors[action as keyof typeof colors] || 'text-gray-600';
  };

  const exportToCSV = () => {
    const headers = ['Fecha', 'Producto', 'Acción', 'Cantidad Anterior', 'Nueva Cantidad', 'Razón', 'Usuario'];
    const csvContent = [
      headers.join(','),
      ...filteredHistorial.map(entry => [
        format(new Date(entry.date), 'dd/MM/yyyy HH:mm'),
        entry.productName,
        getActionLabel(entry.action),
        entry.previousStock,
        entry.newStock,
        `"${entry.reason.replace(/"/g, '""')}"`,
        entry.userName
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historial_inventario_${format(new Date(), 'dd-MM-yyyy')}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Historial de Inventario</h1>
        <Button onClick={exportToCSV}>Exportar CSV</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtra el historial por fecha, tipo de movimiento o búsqueda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <DatePickerWithRange
                date={dateRange}
                setDate={setDateRange}
              />
            </div>
            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo de movimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="entrada">Entradas</SelectItem>
                <SelectItem value="salida">Salidas</SelectItem>
                <SelectItem value="consumo_diario">Consumo Diario</SelectItem>
                <SelectItem value="cierre_ciclo">Cierre de Ciclo</SelectItem>
                <SelectItem value="inicio_ciclo">Inicio de Ciclo</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar por producto o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Stock Anterior</TableHead>
                <TableHead>Nuevo Stock</TableHead>
                <TableHead>Detalles</TableHead>
                <TableHead>Usuario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistorial.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {format(new Date(entry.date), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell>{entry.productName}</TableCell>
                  <TableCell className={getActionColor(entry.action)}>
                    {getActionLabel(entry.action)}
                  </TableCell>
                  <TableCell>{entry.previousStock}</TableCell>
                  <TableCell>{entry.newStock}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {entry.action === 'consumo_diario' && entry.consumoDiario ? (
                      <>
                        {entry.reason}
                        <br />
                        <span className="text-sm text-gray-500">
                          Consumo por pollo: {entry.consumoDiario.cantidadPorPollo}
                          <br />
                          Número de pollos: {entry.consumoDiario.numeroPollos}
                        </span>
                      </>
                    ) : (
                      entry.reason
                    )}
                  </TableCell>
                  <TableCell>{entry.userName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
