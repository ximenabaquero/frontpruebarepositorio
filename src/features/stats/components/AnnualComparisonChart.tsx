"use client";

import { useState } from "react";
import useSWR from "swr";
import { endpoints } from "../services/StatsService";
import { useAuth } from "@/features/auth/AuthContext";
import Cookies from "js-cookie";
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
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import ValidatedInput from "@/components/ValidatedInput";

const API = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  })
    .then((res) => res.json())
    .then((json) => json.data || null);

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
    color: "#8b5cf6",
    lightColor: "#ede9fe",
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
    color: "#10b981",
    lightColor: "#d1fae5",
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

interface Props {
  incomeRevealed: boolean;
  onReveal: () => void;
}

export default function AnnualComparisonChart({ incomeRevealed, onReveal }: Props) {
  const [activeMetric, setActiveMetric] = useState<Metric>("patients");
  const { data, error, isLoading } = useSWR(endpoints.annualComparison, fetcher);
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  function handleTabClick(key: Metric) {
    if (key === "income" && !incomeRevealed) {
      setAuthError(null);
      setPassword("");
      setShowModal(true);
    } else {
      setActiveMetric(key);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.email) return;
    setAuthLoading(true);
    setAuthError(null);
    try {
      await fetch(`${API}/sanctum/csrf-cookie`, { credentials: "include" });
      const token = Cookies.get("XSRF-TOKEN") ?? "";
      const res = await fetch(`${API}/api/v1/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify({ email: user.email, password }),
      });
      if (!res.ok) { setAuthError("Contraseña incorrecta."); return; }
      onReveal();
      setActiveMetric("income");
      setShowModal(false);
    } catch {
      setAuthError("Error de conexión.");
    } finally {
      setAuthLoading(false);
    }
  }

  const metric = METRICS.find((m) => m.key === activeMetric)!;

  const chartData =
    data?.months?.map((m: any) => ({
      name: MONTH_ABBR[(m.month ?? 1) - 1],
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
          {activeMetric === "income" && !incomeRevealed ? (
            <button
              onClick={() => { setAuthError(null); setPassword(""); setShowModal(true); }}
              className="flex items-center gap-1 text-gray-400 hover:text-emerald-600 transition-colors mt-0.5 ml-auto"
            >
              <LockClosedIcon className="w-4 h-4" />
              <span className="text-xs font-medium">Ver total</span>
            </button>
          ) : (
            <p className="text-sm font-bold mt-0.5" style={{ color: metric.color }}>
              {metric.format(total)}
            </p>
          )}
        </div>
      </div>
      {/* Metric selector */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {METRICS.map((m) => {
          const isLocked = m.key === "income" && !incomeRevealed;
          return (
            <button
              key={m.key}
              onClick={() => handleTabClick(m.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeMetric === m.key
                  ? "text-white shadow-sm"
                  : "text-gray-500 bg-gray-50 hover:bg-gray-100"
              }`}
              style={activeMetric === m.key ? { backgroundColor: m.color } : {}}
            >
              {isLocked ? <LockClosedIcon className="w-4 h-4" /> : m.icon}
              {m.label}
            </button>
          );
        })}
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                <LockClosedIcon className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Verificar identidad</p>
                <p className="text-xs text-gray-400">Ingresa tu contraseña para ver los ingresos anuales.</p>
              </div>
            </div>
            <form onSubmit={handleVerify} className="space-y-4">
              <ValidatedInput
                id="verify-password"
                label="Contraseña"
                type="password"
                value={password}
                onChange={setPassword}
                maxLength={128}
                required
                showToggle
                autoFocus
                placeholder="Contraseña"
              />
              {authError && <p className="text-xs text-red-500 font-medium">{authError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={authLoading || !password}
                  className="flex-1 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {authLoading ? "Verificando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
