import type { SpendReport, SpendByCategory } from "../../types";
import { formatCOP, formatShort } from "../../utils/reportUtils";

const COLORS = [
  { bar: "from-blue-500 to-indigo-500", dot: "bg-blue-500" },
  { bar: "from-violet-500 to-purple-500", dot: "bg-violet-500" },
  { bar: "from-cyan-500 to-teal-500", dot: "bg-cyan-500" },
  { bar: "from-rose-500 to-pink-500", dot: "bg-rose-500" },
  { bar: "from-amber-500 to-orange-500", dot: "bg-amber-500" },
  { bar: "from-emerald-500 to-green-500", dot: "bg-emerald-500" },
];

interface Props {
  data: SpendReport<SpendByCategory> | null;
  loading: boolean;
}

export default function SpendByCategoryChart({ data, loading }: Props) {
  if (loading) return <ChartSkeleton title="Gasto por Categoría" />;

  if (!data || data.items.length === 0)
    return <ChartEmpty title="Gasto por Categoría" />;

  const maxAmount = Math.max(...data.items.map((d) => d.amount));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Período · {data.period}
          </p>
          <h3 className="text-base font-bold text-gray-900">
            Gasto por Categoría
          </h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
            Total
          </p>
          <p className="text-lg font-bold text-gray-900 tabular-nums">
            {formatCOP(data.total)}
          </p>
        </div>
      </div>

      {/* Barras */}
      {/* Barras — scroll si hay muchos items */}
      <div
        className="space-y-3.5 overflow-y-auto pr-1"
        style={{ maxHeight: "320px" }} // ~8 items cómodos
      >
        {data.items.map((item, idx) => {
          const pct = (item.amount / maxAmount) * 100;
          const sharePct = ((item.amount / data.total) * 100).toFixed(1);
          const color = COLORS[idx % COLORS.length];

          return (
            <div key={item.category_id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${color.dot}`}
                  />
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {item.category_name}
                  </span>
                  <span className="text-[11px] text-gray-400 shrink-0">
                    {item.count} {item.count === 1 ? "compra" : "compras"}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[11px] text-gray-400">{sharePct}%</span>
                  <span className="text-sm font-bold text-gray-900 tabular-nums">
                    {formatShort(item.amount)}
                  </span>
                </div>
              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${color.bar} rounded-full transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartSkeleton({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
      <div className="h-4 w-32 bg-gray-100 rounded mb-6" />
      {[80, 60, 45, 30].map((w, i) => (
        <div key={i} className="mb-4">
          <div className="h-3 w-24 bg-gray-100 rounded mb-2" />
          <div
            className="h-2 bg-gray-100 rounded-full"
            style={{ width: `${w}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function ChartEmpty({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center flex flex-col items-center gap-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {title}
      </p>
      <p className="text-sm text-gray-400">No hay datos para este período</p>
    </div>
  );
}
