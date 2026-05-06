"use client";

import { useEffect, useState } from "react";
import { getInventorySummary } from "../services/inventoryService";
import type { InventorySummaryData } from "../types";
import {
  BanknotesIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  LockClosedIcon,
  LockOpenIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import InfoTooltip from "@/components/InfoTooltip";
import ValidatedInput from "@/components/ValidatedInput";
import Cookies from "js-cookie";

const SESSION_KEY = "inventory_summary_unlocked";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

// ── StatCard ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  tooltip,
  value,
  icon: Icon,
  iconColor,
}: {
  label: string;
  tooltip: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <div className="group relative">
      {/* Glow hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500" />

      <div className="relative flex flex-col justify-between bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100 p-5 shadow-lg hover:shadow-xl transition-all duration-500 h-full min-h-[110px]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-[10px] uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
              {label}
              <InfoTooltip text={tooltip} position="bottom" />
            </h3>
            <p className="text-2xl font-bold text-gray-900 break-words leading-tight tracking-tight w-full overflow-hidden text-ellipsis">
              {value}
            </p>
          </div>

          {/* Ícono */}
          <div className="shrink-0 rounded-xl p-2.5 bg-white shadow-sm border border-gray-100">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>

        {/* Underline animado */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 group-hover:w-2/3 transition-all duration-500 rounded-full" />
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────

type Props = { isAdmin: boolean };

export default function InventorySummaryCards({ isAdmin }: Props) {
  const [data, setData] = useState<InventorySummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [unlocked, setUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") setUnlocked(true);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    getInventorySummary()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    setPasswordError(null);
    try {
      const token = Cookies.get("XSRF-TOKEN") ?? "";
      const res = await fetch(`${apiBaseUrl}/api/v1/confirm-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setPasswordError("Contraseña incorrecta.");
        return;
      }
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
      setShowModal(false);
      setPassword("");
    } catch {
      setPasswordError("Error al verificar. Intenta de nuevo.");
    } finally {
      setVerifying(false);
    }
  }

  function handleLock() {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  }

  function closeModal() {
    setShowModal(false);
    setPassword("");
    setPasswordError(null);
  }

  if (!isAdmin) return null;
  if (loading)
    return <p className="text-gray-500 italic text-sm">Cargando resumen...</p>;
  if (error || !data)
    return (
      <p className="text-red-500 text-sm">
        {error || "Error al cargar resumen."}
      </p>
    );

  const masked = "$ ••••••••";

  const cards = [
    {
      label: "Ingreso Total",
      tooltip:
        "Suma de todos los ingresos confirmados registrados en la clínica.",
      value: unlocked ? formatCOP(data.total_income) : masked,
      icon: BanknotesIcon,
      iconColor: "text-emerald-600",
    },
    {
      label: "Gastos Totales",
      tooltip: "Total gastado en compras de insumos y equipos médicos.",
      value: unlocked ? formatCOP(data.total_expenses) : masked,
      icon: ShoppingCartIcon,
      iconColor: "text-rose-500",
    },
    {
      label: "Utilidad Neta",
      tooltip: "Resultado global: ingresos menos gastos totales.",
      value: unlocked ? formatCOP(data.net_profit) : masked,
      icon: ArrowTrendingUpIcon,
      iconColor: data.net_profit >= 0 ? "text-blue-600" : "text-orange-500",
    },
  ];

  return (
    <>
      <div className="relative mb-6">
        {/* Botón re-bloquear */}
        {unlocked && (
          <button
            onClick={handleLock}
            title="Clic para bloquear"
            className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group"
          >
            <LockOpenIcon className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* Overlay de bloqueo */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 group px-4 py-2.5 rounded-lg bg-white/80 border border-gray-200 hover:border-indigo-300 hover:bg-white shadow-sm transition-all"
            >
              <LockClosedIcon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">
                Ver resumen financiero
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Modal de contraseña */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-indigo-100 p-1.5">
                  <LockClosedIcon className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-800">
                  Confirmar identidad
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Ingresa tu contraseña de administrador para ver el resumen
              financiero.
            </p>

            <form onSubmit={handleConfirm} className="space-y-4">
              <ValidatedInput
                id="inventory-password"
                label="Contraseña de administrador"
                type="password"
                value={password}
                onChange={setPassword}
                maxLength={128}
                required
                showToggle
                autoFocus
                placeholder="Contraseña"
              />

              {passwordError && (
                <p className="text-xs text-rose-500">{passwordError}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={verifying || !password}
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {verifying ? "Verificando..." : "Desbloquear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
