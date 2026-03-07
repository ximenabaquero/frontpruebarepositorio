"use client";

import { useState } from "react";
import useSWR from "swr";
import { endpoints } from "../services/StatsService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  BanknotesIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ScissorsIcon,
} from "@heroicons/react/24/outline";

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  }).then((res) => res.json());

type Metric = "income" | "patients" | "sessions" | "procedures";

const METRICS: {
  key: Metric;
  label: string;
  icon: React.ReactNode;
  colorCurrent: string;
  colorPrev: string;
  gradientCurrent: string;
  gradientPrev: string;
  format: (v: number) => string;
}[] = [
  {
    key: "income",
    label: "Ingresos",
    icon: <BanknotesIcon className="w-4 h-4" />,
    colorCurrent: "#8b5cf6",
    colorPrev: "#c4b5fd",
    gradientCurrent: "gradientIncomeCurrent",
    gradientPrev: "gradientIncomePrev",
    format: (v) =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(v),
  },
  {
    key: "patients",
    label: "Pacientes",
    icon: <UserGroupIcon className="w-4 h-4" />,
    colorCurrent: "#3b82f6",
    colorPrev: "#93c5fd",
    gradientCurrent: "gradientPatientsCurrent",
    gradientPrev: "gradientPatientsPrev",
    format: (v) => `${v} pac.`,
  },
  {
    key: "sessions",
    label: "Registros",
    icon: <ClipboardDocumentCheckIcon className="w-4 h-4" />,
    colorCurrent: "#10b981",
    colorPrev: "#6ee7b7",
    gradientCurrent: "gradientSessionsCurrent",
    gradientPrev: "gradientSessionsPrev",
    format: (v) => `${v} reg.`,
  },
  {
    key: "procedures",
    label: "Procedimientos",
    icon: <ScissorsIcon className="w-4 h-4" />,
    colorCurrent: "#f59e0b",
    colorPrev: "#fcd34d",
    gradientCurrent: "gradientProceduresCurrent",
    gradientPrev: "gradientProceduresPrev",
    format: (v) => `${v} proc.`,
  },
];

function CustomTooltip({ active, payload, metric }: any) {
  if (!active || !payload?.length) return null;
  const m = METRICS.find((x) => x.key === metric)!;
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl px-4 py-3 text-sm min-w-[160px]">
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="text-gray-400 text-xs">{p.name}</span>
          <span className="font-bold text-xs" style={{ color: p.color }}>
            {m.format(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function MonthComparisonChart() {
  const [activeMetric, setActiveMetric] = useState<Metric>("income");
  const { data, error, isLoading } = useSWR(endpoints.monthComparison, fetcher);

  const metric = METRICS.find((m) => m.key === activeMetric)!;

  const chartData =
    data?.days?.map((d: any) => ({
      day: d.day,
      [data.current_month]: d.current?.[activeMetric] ?? 0,
      [data.previous_month]: d.previous?.[activeMetric] ?? 0,
    })) ?? [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Comparativa Mensual
          </h2>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">
            {data ? (
              <span className="capitalize">{data.current_month}</span>
            ) : (
              "Mes actual"
            )}{" "}
            vs{" "}
            {data ? (
              <span className="capitalize">{data.previous_month}</span>
            ) : (
              "mes anterior"
            )}
          </p>
        </div>

        {/* Leyenda */}
        {data && (
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 h-0.5 rounded-full inline-block"
                style={{ backgroundColor: metric.colorCurrent }}
              />
              <span className="capitalize">{data.current_month}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 h-0.5 rounded-full inline-block"
                style={{ backgroundColor: metric.colorPrev }}
              />
              <span className="capitalize">{data.previous_month}</span>
            </span>
          </div>
        )}
      </div>

      {/* Metric selector */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setActiveMetric(m.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeMetric === m.key
                ? "text-white shadow-sm"
                : "text-gray-500 bg-gray-50 hover:bg-gray-100"
            }`}
            style={
              activeMetric === m.key ? { backgroundColor: m.colorCurrent } : {}
            }
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="h-52 flex items-center justify-center">
          <p className="text-sm text-gray-400 italic">Cargando datos...</p>
        </div>
      ) : error || !data ? (
        <div className="h-52 flex items-center justify-center">
          <p className="text-sm text-red-400">Error al cargar datos.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={163}>
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={metric.gradientCurrent}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={metric.colorCurrent}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={metric.colorCurrent}
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient
                id={metric.gradientPrev}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={metric.colorPrev}
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor={metric.colorPrev}
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#f3f4f6"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickFormatter={(v) => (v % 4 === 1 ? `${v}` : "")}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickFormatter={(v) =>
                activeMetric === "income"
                  ? v >= 1_000_000
                    ? `${(v / 1_000_000).toFixed(1)}M`
                    : v >= 1000
                      ? `${(v / 1000).toFixed(0)}K`
                      : String(v)
                  : String(v)
              }
              width={activeMetric === "income" ? 48 : 32}
            />
            <Tooltip content={<CustomTooltip metric={activeMetric} />} />

            <Area
              type="monotone"
              dataKey={data.previous_month}
              stroke={metric.colorPrev}
              strokeWidth={2}
              fill={`url(#${metric.gradientPrev})`}
              dot={false}
              strokeDasharray="5 3"
            />
            <Area
              type="monotone"
              dataKey={data.current_month}
              stroke={metric.colorCurrent}
              strokeWidth={2.5}
              fill={`url(#${metric.gradientCurrent})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
