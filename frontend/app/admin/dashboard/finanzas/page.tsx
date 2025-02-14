import FinanzasOverview from '../components/finanzas/FinanzasOverview';

export default function FinanzasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Finanzas</h2>
        <p className="text-muted-foreground">
          Resumen financiero y gastos por categoría
        </p>
      </div>

      <FinanzasOverview />
    </div>
  );
} 