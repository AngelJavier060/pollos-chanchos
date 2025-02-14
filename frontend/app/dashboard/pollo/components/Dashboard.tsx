'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lotes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">3</div>
            <p className="text-sm text-gray-500">Lotes en seguimiento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mortalidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">2.5%</div>
            <p className="text-sm text-gray-500">Promedio últimos 30 días</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peso Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">2.3 kg</div>
            <p className="text-sm text-gray-500">Promedio actual</p>
          </CardContent>
        </Card>
      </div>

      {/* Aquí puedes agregar más secciones como gráficas o tablas */}
    </div>
  );
};

export default DashboardContent; 