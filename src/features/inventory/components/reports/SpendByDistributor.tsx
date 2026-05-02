import type { SpendByDistributor } from "../../types";

interface SpendByDistributorChartProps {
  data: SpendByDistributor[];
}

export default function SpendByDistributorChart({
  data,
}: SpendByDistributorChartProps) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        No hay datos para mostrar
      </div>
    );
  }

  const maxAmount = Math.max(...data.map((d) => d.amount));

  const fmt = (val: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(val);

  const fmtShort = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return fmt(val);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
          Gasto por Distribuidor
        </h3>
      </div>

      <div className="space-y-3">
        {data.map((item) => {
          const percentage = (item.amount / maxAmount) * 100;
          return (
            <div key={item.distributor_id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {item.distributor_name || "Sin distribuidor"}
                </span>
                <span className="text-sm font-bold text-gray-900 font-mono">
                  {fmt(item.amount)}
                </span>
              </div>
              <div className="relative h-7 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-2.5">
                  <span className="text-xs font-semibold text-white drop-shadow-sm">
                    {item.count} {item.count === 1 ? "compra" : "compras"}
                  </span>
                  <span className="text-xs font-bold text-white drop-shadow-sm">
                    {fmtShort(item.amount)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total
          </span>
          <span className="text-lg font-bold text-gray-900 font-mono">
            {fmt(data.reduce((acc, d) => acc + d.amount, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}
