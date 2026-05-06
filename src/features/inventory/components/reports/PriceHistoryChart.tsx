import type { PriceHistoryPoint, InventoryProduct } from "../../types";
import { formatCOP, formatShort, formatMonth } from "../../utils/reportUtils";

interface Props {
  history: PriceHistoryPoint[];
  product: InventoryProduct | null;
  loading: boolean;
}

export default function PriceHistoryChart({
  history,
  product,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
        <div className="h-4 w-40 bg-gray-100 rounded mb-4" />
        <div className="h-40 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Histórico de Precios
        </p>
        <p className="text-sm text-gray-400">
          Seleccioná un producto para ver la evolución de su precio
        </p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Histórico de Precios
        </p>
        <p className="text-sm text-gray-400">
          No hay compras registradas para{" "}
          <span className="font-semibold text-gray-600">{product.name}</span> en
          los últimos 12 meses
        </p>
      </div>
    );
  }

  const prices = history.map((h) => h.avg_price);
  const maxP = Math.max(...history.map((h) => h.max_price));
  const minP = Math.min(...history.map((h) => h.min_price));
  const lastPrice = history[history.length - 1].avg_price;
  const firstPrice = history[0].avg_price;
  const delta =
    history.length > 1
      ? Math.round(((lastPrice - firstPrice) / firstPrice) * 100)
      : 0;

  // SVG
  const W = 800,
    H = 180,
    PX = 50,
    PY = 30;
  const innerW = W - PX * 2;
  const innerH = H - PY * 2;
  const n = history.length;
  const xStep = n > 1 ? innerW / (n - 1) : 0;
  const range = Math.max(maxP - minP, 1);

  const toX = (i: number) => PX + i * xStep;
  const toY = (v: number) => H - PY - ((v - minP) / range) * innerH;

  // Avg price line
  const linePts = history.map((h, i) => ({ x: toX(i), y: toY(h.avg_price) }));
  const linePath = linePts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${linePts[n - 1].x},${H - PY} L ${linePts[0].x},${H - PY} Z`;

  // Min/max band
  const bandTop = history
    .map((h, i) => `${i === 0 ? "M" : "L"} ${toX(i)},${toY(h.max_price)}`)
    .join(" ");
  const bandBottom = history
    .map((h, i) => `L ${toX(i)},${toY(h.min_price)}`)
    .reverse()
    .join(" ");
  const bandPath = `${bandTop} ${bandBottom} Z`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Últimos 12 meses · Promedio mensual
          </p>
          <h3 className="text-base font-bold text-gray-900">{product.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {history.reduce((a, h) => a + h.purchase_count, 0)} compras
            registradas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
              Precio actual
            </p>
            <p className="text-lg font-bold text-gray-900 tabular-nums">
              {formatCOP(lastPrice)}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
              delta > 0
                ? "bg-red-50 text-red-600 border border-red-200"
                : delta < 0
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            {delta > 0 ? "▲" : delta < 0 ? "▼" : "—"} {Math.abs(delta)}%
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          style={{ minHeight: 160 }}
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid horizontales */}
          {[0, 1, 2, 3].map((i) => {
            const y = PY + (innerH / 3) * i;
            const v = maxP - (range / 3) * i;
            return (
              <g key={i}>
                <line
                  x1={PX}
                  y1={y}
                  x2={W - PX}
                  y2={y}
                  stroke="#F3F4F6"
                  strokeWidth="1"
                />
                <text
                  x={PX - 6}
                  y={y + 4}
                  fontSize="9"
                  textAnchor="end"
                  fill="#9CA3AF"
                >
                  {formatShort(v)}
                </text>
              </g>
            );
          })}

          {/* Banda min/max */}
          <path d={bandPath} fill="#6366f1" opacity="0.06" />

          {/* Área bajo la línea */}
          <path d={areaPath} fill="url(#areaGrad)" />

          {/* Línea principal */}
          <path
            d={linePath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Puntos + labels */}
          {linePts.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="white"
                stroke="#6366f1"
                strokeWidth="2"
              />
              {/* Label precio arriba */}
              <text
                x={p.x}
                y={p.y - 10}
                fontSize="10"
                textAnchor="middle"
                fill="#374151"
                fontWeight="600"
              >
                {formatShort(history[i].avg_price)}
              </text>
              {/* Label mes abajo */}
              <text
                x={p.x}
                y={H - 6}
                fontSize="9"
                textAnchor="middle"
                fill="#9CA3AF"
              >
                {formatMonth(history[i].month)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Stats footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            Precio mínimo
          </p>
          <p className="text-base font-bold text-emerald-600 tabular-nums">
            {formatCOP(minP)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            Promedio
          </p>
          <p className="text-base font-bold text-indigo-600 tabular-nums">
            {formatCOP(
              Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
            )}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            Precio máximo
          </p>
          <p className="text-base font-bold text-red-500 tabular-nums">
            {formatCOP(maxP)}
          </p>
        </div>
      </div>
    </div>
  );
}
