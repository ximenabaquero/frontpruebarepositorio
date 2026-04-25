"use client";

import { useState, useRef } from "react";
import useSWR from "swr";
import { endpoints } from "../services/StatsService";
import { useAuth } from "@/features/auth/AuthContext";
import Cookies from "js-cookie";

import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import InfoTooltip from "@/components/InfoTooltip";

const API = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  })
    .then((res) => res.json())
    .then((json) => json.data || {});

function formatCopInput(value: string | number): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

function renderVariation(variation: number | null | undefined) {
  if (variation === null || variation === undefined) {
    return (
      <p className="mt-1 text-xs text-gray-400 italic">
        Sin datos del mes anterior
      </p>
    );
  }
  const isPositive = variation > 0;
  const Icon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  const color = isPositive ? "text-green-600" : "text-red-500";
  return (
    <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon className="w-4 h-4" />
      <span>{variation}% vs mes anterior</span>
    </div>
  );
}

// Card normal (sin candado)
function StatCard({
  label,
  tooltip,
  value,
  variation,
}: {
  label: string;
  tooltip: string;
  value: string | number;
  variation: number | null | undefined;
}) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
      <div className="relative flex flex-col justify-between bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100 p-5 shadow-lg hover:shadow-xl transition-all duration-500 h-full min-h-[110px]">
        <div>
          <h3 className="text-[10px] uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
            {label}
            <InfoTooltip text={tooltip} position="bottom" />
          </h3>
          <p className="text-2xl font-bold text-gray-900 break-words leading-tight tracking-tight w-full overflow-hidden text-ellipsis">
            {value}
          </p>
        </div>
        <div className="mt-2 min-h-[18px]">{renderVariation(variation)}</div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 group-hover:w-2/3 transition-all duration-500 rounded-full" />
      </div>
    </div>
  );
}

// Card financiera bloqueada (Ingresos + Balance Total)
function LockedCard({
  label,
  subLabel,
  tooltip,
  value,
  variation,
  lockLabel,
  revealed,
  onRequestReveal,
  onHide,
  blue,
}: {
  label: string;
  subLabel?: string;
  tooltip: string;
  value: string;
  variation?: number | null;
  lockLabel: string;
  revealed: boolean;
  onRequestReveal: () => void;
  onHide: () => void;
  blue?: boolean;
}) {
  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${blue ? "from-blue-400 to-blue-500" : "from-emerald-400 to-green-500"} rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500`} />
      <div className={`relative flex flex-col justify-between bg-white rounded-2xl border ${blue ? "border-blue-100" : "border-gray-100"} p-5 shadow-lg hover:shadow-xl transition-all duration-500 h-full min-h-[110px] overflow-hidden`}>
        {blue && (
          <>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-50 rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-50 rounded-full" />
            <div className="absolute top-8 right-8 w-8 h-8 bg-blue-100/60 rounded-full" />
          </>
        )}

        <div className="relative">
          <h3 className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
            {label}
            <InfoTooltip text={tooltip} position="bottom" />
          </h3>
          {subLabel && (
            <p className="text-[8px] uppercase tracking-wider text-gray-400">{subLabel}</p>
          )}
        </div>

        <div className="relative mt-auto">
          {revealed ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
                  {value}
                </p>
                <button
                  onClick={onHide}
                  className="mb-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Ocultar"
                >
                  <EyeSlashIcon className="w-4 h-4" />
                </button>
              </div>
              {variation !== undefined && (
                <div className="min-h-[18px]">{renderVariation(variation)}</div>
              )}
            </div>
          ) : (
            <button
              onClick={onRequestReveal}
              className={`flex items-center gap-2 ${blue ? "text-gray-400 hover:text-blue-600" : "text-gray-400 hover:text-emerald-600"} transition-colors`}
            >
              <LockClosedIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{lockLabel}</span>
            </button>
          )}
        </div>

        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${blue ? "from-blue-300 to-blue-500" : "from-emerald-500 to-blue-600"} group-hover:w-2/3 transition-all duration-500 rounded-full`} />
      </div>
    </div>
  );
}

// Modal de verificación compartido
function VerifyModal({
  onVerify,
  onCancel,
}: {
  onVerify: (password: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onVerify(password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al verificar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <LockClosedIcon className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Verificar identidad</p>
            <p className="text-xs text-gray-400">Ingresa tu contraseña para ver los datos financieros.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              autoFocus
              className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !password}
              className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Verificando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SummaryStats() {
  const { data, error, isLoading } = useSWR(endpoints.summary, fetcher);
  const { user } = useAuth();

  const [revealed, setRevealed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  async function handleVerify(password: string) {
    if (!user?.email) return;
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
    if (!res.ok) throw new Error("Contraseña incorrecta.");
    setRevealed(true);
    setShowModal(false);
  }

  if (isLoading)
    return <p className="text-gray-500 italic">Cargando estadísticas...</p>;
  if (error || !data)
    return <p className="text-red-500">Error al cargar estadísticas.</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-4 sm:px-0 mb-8">
        {/* Ingresos — bloqueado */}
        <LockedCard
          label="Ingresos Periodo Actual"
          tooltip="total de ingresos confirmados en el mes seleccionado."
          value={formatCopInput(data.this_month_income)}
          variation={data.income_variation}
          lockLabel="Ver ingresos"
          revealed={revealed}
          onRequestReveal={() => setShowModal(true)}
          onHide={() => setRevealed(false)}
        />

        <StatCard
          label="Nuevos Pacientes"
          tooltip="cantidad de pacientes que tuvieron su primera consulta en este periodo."
          value={data.this_month_patients}
          variation={data.patients_variation}
        />
        <StatCard
          label="Sesiones Realizadas"
          tooltip="total de sesiones clínicas completadas en el periodo actual."
          value={data.this_month_sessions}
          variation={data.sessions_variation}
        />
        <StatCard
          label="Procedimientos"
          tooltip="cantidad total de procedimientos realizados en las sesiones del periodo."
          value={data.this_month_procedures}
          variation={data.procedures_variation}
        />

        {/* Balance Total — bloqueado */}
        <LockedCard
          label="Balance Total"
          subLabel="Ingresos acumulados confirmados"
          tooltip="suma de todos los ingresos confirmados desde el inicio hasta hoy."
          value={formatCopInput(data.total_income)}
          lockLabel="Ver balance"
          revealed={revealed}
          onRequestReveal={() => setShowModal(true)}
          onHide={() => setRevealed(false)}
          blue
        />
      </div>

      {showModal && (
        <VerifyModal
          onVerify={handleVerify}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
