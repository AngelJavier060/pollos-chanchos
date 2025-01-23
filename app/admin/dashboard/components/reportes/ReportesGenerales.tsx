'use client';

import { FC, useRef } from 'react';
import { Card } from "../ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Download, FileText, Printer, Share2 } from 'lucide-react';
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from '../ui/toast';

interface ReportesProps {
  lotes: any[]; // Definir interface apropiada
  costos: {
    alimentacion: number;
    medicinas: number;
    vacunas: number;
    total: number;
  };
  estadisticas: {
    mortalidad: number;
    crecimientoPromedio: number;
    consumoAlimento: number;
  };
}

const ReportesGenerales: FC<ReportesProps> = ({
  lotes,
  costos,
  estadisticas
}) => {
  const { showToast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);

  const exportToPDF = async () => {
    if (!reportRef.current) return;

    showToast("Generando PDF...", "info");

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Agregar encabezado
      pdf.setFontSize(20);
      pdf.text('Reporte General - Granja Elvita', 20, 20);
      pdf.setFontSize(12);
      pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30);
      
      // Agregar imagen del reporte
      pdf.addImage(imgData, 'PNG', 0, 40, imgWidth, imgHeight);
      
      pdf.save(`reporte-granja-elvita-${new Date().toISOString().split('T')[0]}.pdf`);

      showToast("PDF generado exitosamente!", "success");
    } catch (error) {
      console.error('Error al generar PDF:', error);
      showToast("Error al generar el PDF", "error");
    }
  };

  const calcularCostoPorAnimal = () => {
    const totalAnimales = lotes.reduce((acc, lote) => acc + lote.cantidadActual, 0);
    return (costos.alimentacion + costos.medicinas) / totalAnimales;
  };

  const calcularCostoPorLote = (loteId: number) => {
    // Implementar cálculo según la fórmula
    return costos.alimentacion + costos.medicinas + costos.vacunas;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reportes Generales</h2>
        <div className="flex gap-4">
          <Select
            defaultValue="mensual"
            options={[
              { value: 'diario', label: 'Diario' },
              { value: 'semanal', label: 'Semanal' },
              { value: 'mensual', label: 'Mensual' }
            ]}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Exportar Reporte
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div ref={reportRef}>
        {/* Resumen de Costos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="font-medium mb-2">Costo por Animal</h3>
            <p className="text-2xl font-bold">${calcularCostoPorAnimal().toFixed(2)}</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium mb-2">Costo Total</h3>
            <p className="text-2xl font-bold">${costos.total.toFixed(2)}</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium mb-2">Mortalidad</h3>
            <p className="text-2xl font-bold">{estadisticas.mortalidad}%</p>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de Crecimiento */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Crecimiento por Lote</h3>
            <div className="h-80">
              <ResponsiveContainer>
                <LineChart data={lotes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="peso" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Gráfico de Costos */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Distribución de Costos</h3>
            <div className="h-80">
              <ResponsiveContainer>
                <BarChart data={[
                  {
                    name: 'Alimentación',
                    valor: costos.alimentacion
                  },
                  {
                    name: 'Medicinas',
                    valor: costos.medicinas
                  },
                  {
                    name: 'Vacunas',
                    valor: costos.vacunas
                  }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="valor" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Tabla de Resumen por Lote */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">Resumen por Lote</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Lote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Costo Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mortalidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Crecimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado Sanitario
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lotes.map((lote) => (
                  <tr key={lote.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{lote.codigo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${calcularCostoPorLote(lote.id).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{lote.mortalidad}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lote.crecimiento} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        lote.estadoSanitario === 'bueno' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lote.estadoSanitario}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportesGenerales; 