import { useState } from "react";
import type { PriceHistoryPoint, InventoryProduct } from "../types";

interface PriceHistoryChartProps {
  history: PriceHistoryPoint[];
  product: InventoryProduct | null;
}

export default function PriceHistoryChart({ history, product }: PriceHistoryChartProps) {
  if (!product) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center text-gray-400">
        Selecciona un producto para ver su histórico de precios
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center text-gray-400">
        No hay histórico de precios para este producto
      </div>
    );
  }

  const fmt = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  const fmtShort = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return fmt(val);
  };

  const prices = history.map((h) => h.price);
  const maxP = Math.max(...prices);
  const minP = Math.min(...prices);
  const delta = history.length > 1
    ? Math.round(((history[history.length - 1].price - history[0].price) / history[0].price) * 100)
    : 0;

  // SVG dimensions
  const W = 800;
  const H = 200;
  const P = 40; // padding

  const xStep = (W - P * 2) / Math.max(history.length - 1, 1);
  const yRange = Math.max(maxP - minP, 1);
  const yScale = (H - P * 2) / yRange;

  const points = history.map((h, i) => {
    const x = P + i * xStep;
    const y = H - P - (h.price - minP) * yScale;
    return { x, y, ...h };
  });

  const pathData = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ");
  const areaData = `${pathData} L ${points[points.length - 1].x},${H - P} L ${P},${H - P} Z`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Histórico de Precios
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Variación:</span>
          <span
            className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
              delta >= 0
                ? "bg-red-100 text-red-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {delta >= 0 ? "+" : ""}
            {delta}%
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-sm font-semibold text-gray-700">{product.name}</div>
        <div className="text-xs text-gray-500">{history.length} compras registradas</div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          style={{ minHeight: "200px" }}
        >
          {/* Grid lines */}
          {[0, 1, 2, 3].map((i) => {
            const y = P + ((H - P * 2) / 3) * i;
            return (
              <line
                key={i}
                x1={P}
                y1={y}
                x2={W - P}
                y2={y}
                stroke="#E5E7EB"
                strokeDasharray="2,4"
              />
            );
          })}

          {/* Area fill */}
          <path d={areaData} fill="#9333EA" opacity="0.1" />

          {/* Line */}
          <path d={pathData} fill="none" stroke="#9333EA" strokeWidth="3" />

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#9333EA" strokeWidth="2" />
              <text
                x={p.x}
                y={p.y - 12}
                fontSize="11"
                textAnchor="middle"
                fill="#111827"
                fontFamily="monospace"
                fontWeight="600"
              >
                {fmtShort(p.price)}
              </text>
              <text
                x={p.x}
                y={H - 8}
                fontSize="10"
                textAnchor="middle"
                fill="#6B7280"
              >
                {new Date(p.date).toLocaleDateString("es-CL", {
                  month: "short",
                  day: "numeric",
                })}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Precio actual</div>
          <div className="text-lg font-bold text-gray-900 font-mono">
            {fmt(history[history.length - 1].price)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Precio más bajo</div>
          <div className="text-lg font-bold text-emerald-600 font-mono">
            {fmt(minP)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Precio más alto</div>
          <div className="text-lg font-bold text-red-600 font-mono">
            {fmt(maxP)}
          </div>
        </div>
      </div>
    </div>
  );
}
