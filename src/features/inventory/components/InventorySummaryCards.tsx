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
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import InfoTooltip from "@/components/InfoTooltip";
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

type Props = {
  isAdmin: boolean;
};

export default function InventorySummaryCards({ isAdmin }: Props) {
  const [data, setData] = useState<InventorySummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [unlocked, setUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Restaurar estado de sesión
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setUnlocked(true);
    }
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

  if (!isAdmin) return null;

  if (loading)
    return <p className="text-gray-500 italic text-sm">Cargando resumen...</p>;
  if (error || !data)
    return <p className="text-red-500 text-sm">{error || "Error al cargar resumen."}</p>;

  const cards = [
    {
      label: "Ingreso Total",
      tooltip: "suma de todos los ingresos confirmados registrados en la clínica.",
      value: formatCOP(data.total_income),
      icon: BanknotesIcon,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      border: "border-emerald-200",
    },
    {
      label: "Gastos Totales",
      tooltip: "total gastado en compras de insumos y materiales.",
      value: formatCOP(data.total_expenses),
      icon: ShoppingCartIcon,
      bg: "bg-rose-50",
      iconColor: "text-rose-500",
      border: "border-rose-200",
    },
    {
      label: "Utilidad Neta",
      tooltip: "resultado global: ingresos menos gastos totales.",
      value: formatCOP(data.net_profit),
      icon: ArrowTrendingUpIcon,
      bg: data.net_profit >= 0 ? "bg-blue-50" : "bg-orange-50",
      iconColor: data.net_profit >= 0 ? "text-blue-600" : "text-orange-500",
      border: data.net_profit >= 0 ? "border-blue-200" : "border-orange-200",
    },
  ];

  return (
    <>
      <div className="relative mb-6">
        {/* Candado para re-bloquear (visible solo cuando está desbloqueado) */}
        {unlocked && (
          <button
            onClick={handleLock}
            title="Bloquear resumen financiero"
            className="absolute -top-1 right-0 z-10 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LockOpenIcon className="w-3.5 h-3.5" />
            Bloquear
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`flex items-center gap-4 rounded-2xl border ${card.border} ${card.bg} px-5 py-4 shadow-sm`}
            >
              <div className="rounded-xl p-2.5 bg-white shadow-sm">
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  {card.label}
                  <InfoTooltip text={card.tooltip} />
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {unlocked ? card.value : "$ ••••••••"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Overlay de bloqueo */}
        {!unlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex flex-col items-center gap-2 group"
            >
              <div className="rounded-full bg-gray-100 p-4 group-hover:bg-indigo-100 transition-colors shadow-sm">
                <LockClosedIcon className="w-6 h-6 text-gray-500 group-hover:text-indigo-600 transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">
                Ver resumen financiero
              </span>
              <span className="text-xs text-gray-400">Requiere contraseña de administrador</span>
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
                <h3 className="font-semibold text-gray-800">Confirmar identidad</h3>
              </div>
              <button
                onClick={() => { setShowModal(false); setPassword(""); setPasswordError(null); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Ingresa tu contraseña de administrador para ver el resumen financiero.
            </p>

            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  autoFocus
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword
                    ? <EyeSlashIcon className="w-4 h-4" />
                    : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>

              {passwordError && (
                <p className="text-xs text-rose-500">{passwordError}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setPassword(""); setPasswordError(null); }}
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
