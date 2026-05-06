import type { SpendReport, SpendByDistributor } from "../../types";
import { formatCOP, formatShort } from "../../utils/reportUtils";

const COLORS = [
  { bar: "from-teal-500 to-cyan-500", dot: "bg-teal-500" },
  { bar: "from-sky-500 to-blue-500", dot: "bg-sky-500" },
  { bar: "from-indigo-500 to-violet-500", dot: "bg-indigo-500" },
  { bar: "from-emerald-500 to-teal-500", dot: "bg-emerald-500" },
  { bar: "from-orange-500 to-amber-500", dot: "bg-orange-500" },
  { bar: "from-pink-500 to-rose-500", dot: "bg-pink-500" },
];

interface Props {
  data: SpendReport<SpendByDistributor> | null;
  loading: boolean;
}

export default function SpendByDistributorChart({ data, loading }: Props) {
  if (loading) return <ChartSkeleton />;
  if (!data || data.items.length === 0) return <ChartEmpty />;

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
            Gasto por Distribuidor
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
      <div
        className="space-y-3.5 overflow-y-auto pr-1"
        style={{ maxHeight: "320px" }}
      >
        {data.items.map((item, idx) => {
          const pct = (item.amount / maxAmount) * 100;
          const sharePct = ((item.amount / data.total) * 100).toFixed(1);
          const color = COLORS[idx % COLORS.length];
          const name = item.distributor_name || "Sin distribuidor";
          const isNone = !item.distributor_id;

          return (
            <div key={item.distributor_id ?? "none"}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${isNone ? "bg-gray-300" : color.dot}`}
                  />
                  <span
                    className={`text-sm font-medium truncate ${isNone ? "text-gray-400 italic" : "text-gray-700"}`}
                  >
                    {name}
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
                  className={`h-full rounded-full transition-all duration-700 ${
                    isNone ? "bg-gray-300" : `bg-gradient-to-r ${color.bar}`
                  }`}
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

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
      <div className="h-4 w-40 bg-gray-100 rounded mb-6" />
      {[70, 50, 40, 25].map((w, i) => (
        <div key={i} className="mb-4">
          <div className="h-3 w-28 bg-gray-100 rounded mb-2" />
          <div
            className="h-2 bg-gray-100 rounded-full"
            style={{ width: `${w}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function ChartEmpty() {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center flex flex-col items-center gap-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Gasto por Distribuidor
      </p>
      <p className="text-sm text-gray-400">No hay datos para este período</p>
    </div>
  );
}
