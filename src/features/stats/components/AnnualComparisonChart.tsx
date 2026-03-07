"use client";

import { useState } from "react";
import useSWR from "swr";
import { endpoints } from "../services/StatsService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  color: string;
  lightColor: string;
  format: (v: number) => string;
}[] = [
  {
    key: "income",
    label: "Ingresos",
    icon: <BanknotesIcon className="w-4 h-4" />,
    color: "#10b981",
    lightColor: "#d1fae5",
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
    color: "#3b82f6",
    lightColor: "#dbeafe",
    format: (v) => `${v} pac.`,
  },
  {
    key: "sessions",
    label: "Registros",
    icon: <ClipboardDocumentCheckIcon className="w-4 h-4" />,
    color: "#8b5cf6",
    lightColor: "#ede9fe",
    format: (v) => `${v} reg.`,
  },
  {
    key: "procedures",
    label: "Procedimientos",
    icon: <ScissorsIcon className="w-4 h-4" />,
    color: "#f59e0b",
    lightColor: "#fef3c7",
    format: (v) => `${v} proc.`,
  },
];

const MONTH_ABBR = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

function CustomTooltip({ active, payload, label, metric }: any) {
  if (!active || !payload?.length) return null;
  const m = METRICS.find((x) => x.key === metric)!;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-4 py-3 text-sm">
      <p className="text-gray-500 mb-1 font-medium">{label}</p>
      <p className="font-bold" style={{ color: m.color }}>
        {m.format(payload[0].value)}
      </p>
    </div>
  );
}

export default function AnnualComparisonChart() {
  const [activeMetric, setActiveMetric] = useState<Metric>("income");
  const { data, error, isLoading } = useSWR(
    endpoints.annualComparison,
    fetcher,
  );

  const metric = METRICS.find((m) => m.key === activeMetric)!;

  const chartData =
    data?.months?.map((m: any, i: number) => ({
      name: MONTH_ABBR[i],
      value: m[activeMetric] ?? 0,
    })) ?? [];

  const maxValue = Math.max(...chartData.map((d: any) => d.value), 1);
  const total = chartData.reduce((s: number, d: any) => s + d.value, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Comparativa Anual {data?.year ?? new Date().getFullYear()}
          </h2>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">
            Evolución mensual — Enero a diciembre
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wider text-gray-400">
            Total acumulado
          </p>
          <p
            className="text-sm font-bold mt-0.5"
            style={{ color: metric.color }}
          >
            {metric.format(total)}
          </p>
        </div>
      </div>
      {/* Metric selector */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setActiveMetric(m.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeMetric === m.key
                ? "text-white shadow-sm"
                : "text-gray-500 bg-gray-50 hover:bg-gray-100"
            }`}
            style={activeMetric === m.key ? { backgroundColor: m.color } : {}}
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
      ) : error ? (
        <div className="h-52 flex items-center justify-center">
          <p className="text-sm text-red-400">Error al cargar datos.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={183}>
          <BarChart
            data={chartData}
            barSize={24}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
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
              domain={[0, maxValue * 1.15]}
            />
            <Tooltip
              content={<CustomTooltip metric={activeMetric} />}
              cursor={{ fill: metric.lightColor, radius: 6 }}
            />
            <Bar dataKey="value" fill={metric.color} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
