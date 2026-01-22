export default function SummaryStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Pacientes registrados" value="120" />
      <StatCard label="Ingresos totales (COP)" value="$45.000.000" />
      <StatCard label="Procedimientos realizados" value="340" />
      <StatCard label="Remitentes activos" value="12" />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
