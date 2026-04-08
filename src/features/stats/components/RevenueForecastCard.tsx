"use client";

import useSWR from "swr";
import { endpoints } from "../services/StatsService";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { SparklesIcon } from "@heroicons/react/24/outline";

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  })
    .then((res) => res.json())
    .then((json) => json.data || json);

const formatCOP = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return String(v);
};

const formatFull = (v: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(v);

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-4 py-3 text-sm min-w-[170px]">
      <p className="text-gray-500 mb-2 font-medium capitalize">{label}</p>
      {payload.map((p: any) =>
        p.value != null ? (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-gray-500 text-xs">{p.name}:</span>
            <span className="font-bold text-xs ml-auto" style={{ color: p.color }}>
              {formatFull(p.value)}
            </span>
          </div>
        ) : null,
      )}
    </div>
  );
}

export default function RevenueForecastCard() {
  const { data, error, isLoading } = useSWR(endpoints.revenueForecast, fetcher);

  const chartData = [
    ...(data?.historical ?? []).map((h: any) => ({
      name: h.month_name.slice(0, 3),
      real: h.revenue,
      sma3: h.sma_3,
    })),
    ...(data?.predictions ?? []).map((p: any) => ({
      name: `${p.month_name.slice(0, 3)} *`,
      proyectado: p.predicted,
      capped: p.capped,
    })),
  ];

  const r2: number | null = data?.r_squared ?? null;
  const ceiling: number | null = data?.capacity_ceiling ?? null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-violet-500" />
            <h2 className="text-sm font-semibold text-gray-900">
              Proyección de ingresos
            </h2>
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">
            Regresión exponencial · próximos 3 meses
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          {r2 != null && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                r2 >= 0.8
                  ? "bg-emerald-50 text-emerald-700"
                  : r2 >= 0.5
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-red-50 text-red-600"
              }`}
            >
              R² = {r2}
            </span>
          )}
          {ceiling != null && (
            <span className="text-[10px] text-gray-400">
              Techo: {formatCOP(ceiling)} COP/mes
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="inline-block w-3 h-3 rounded-sm bg-emerald-400" />
          Ingresos reales
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="inline-block w-6 h-[2px] bg-emerald-600" />
          Promedio móvil (SMA-3)
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="inline-block w-3 h-3 rounded-sm bg-violet-400" />
          Proyección
        </div>
        {ceiling != null && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="inline-block w-6 h-[2px] bg-red-400 border-dashed" />
            Techo de capacidad
          </div>
        )}
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="h-52 flex items-center justify-center">
          <p className="text-sm text-gray-400 italic">Calculando proyección...</p>
        </div>
      ) : error ? (
        <div className="h-52 flex items-center justify-center">
          <p className="text-sm text-red-400">Error al cargar proyección.</p>
        </div>
      ) : data?.notice ? (
        <div className="h-52 flex flex-col items-center justify-center gap-2">
          <SparklesIcon className="w-8 h-8 text-violet-300" />
          <p className="text-sm text-gray-400 italic text-center max-w-xs">
            {data.notice}
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={210}>
          <ComposedChart
            data={chartData}
            margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#f3f4f6"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickFormatter={formatCOP}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            {ceiling != null && (
              <ReferenceLine
                y={ceiling}
                stroke="#f87171"
                strokeDasharray="5 3"
                label={{
                  value: "Techo",
                  position: "insideTopRight",
                  fontSize: 10,
                  fill: "#f87171",
                }}
              />
            )}
            <Bar
              dataKey="real"
              name="Ingresos reales"
              fill="#34d399"
              radius={[5, 5, 0, 0]}
              barSize={22}
            />
            <Bar
              dataKey="proyectado"
              name="Proyección"
              fill="#a78bfa"
              radius={[5, 5, 0, 0]}
              barSize={22}
              opacity={0.85}
            />
            <Line
              dataKey="sma3"
              name="SMA-3"
              stroke="#059669"
              strokeWidth={2}
              dot={false}
              type="monotone"
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
