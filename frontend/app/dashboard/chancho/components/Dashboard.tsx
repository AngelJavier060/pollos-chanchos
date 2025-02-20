'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

const DashboardContent = () => {
  // Datos de ejemplo para el dashboard
  const estadisticas = {
    lotesActivos: 3,
    pesoPromedio: 95,
    rendimiento: 85,
    totalChanchos: 150
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Lotes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.lotesActivos}</div>
            <p className="text-xs text-muted-foreground">Lotes en seguimiento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Peso Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estadisticas.pesoPromedio} kg</div>
            <p className="text-xs text-muted-foreground">Promedio actual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Rendimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estadisticas.rendimiento}%</div>
            <p className="text-xs text-muted-foreground">Eficiencia alimenticia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Chanchos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{estadisticas.totalChanchos}</div>
            <p className="text-xs text-muted-foreground">En todos los lotes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Producción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Estado General</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Salud del Lote</span>
                    <span className="font-medium text-green-600">Óptima</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Alimentación</span>
                    <span className="font-medium text-blue-600">Regular</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Próxima Revisión</span>
                    <span className="font-medium">3 días</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;