"use client";

import { useState, useEffect, useRef } from "react";
import { BellIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { BellAlertIcon } from "@heroicons/react/24/solid";
import { getProductNotifications } from "../services/inventoryService";
import type { StockNotificationSummary } from "../types";

const POLL_INTERVAL_MS = 60_000;
const STORAGE_KEY = "stock_bell_last_seen_count";

// ── localStorage (persiste entre sesiones) ───────────────────────────────────
// seguro porque solo guardamos un integer — sin datos sensibles
function getStoredLastCount(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(STORAGE_KEY) ?? 0);
}

function storeLastCount(count: number) {
  localStorage.setItem(STORAGE_KEY, String(count));
}

export default function StockNotificationBell() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<StockNotificationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCount, setLastCount] = useState<number>(getStoredLastCount);
  const [seen, setSeen] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEY) !== null
      : false,
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Polling con pausa cuando la pestaña está en segundo plano ────────────
  useEffect(() => {
    let mounted = true;
    let interval: ReturnType<typeof setInterval> | null = null;

    const load = async () => {
      try {
        const result = await getProductNotifications();
        if (!mounted) return;

        setData(result);

        const stored = getStoredLastCount();
        if (result.total_alertas > stored) {
          setSeen(false);
        }
      } catch {
        // no crítico — próximo poll reintentará
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const startPolling = () => {
      load();
      interval = setInterval(load, POLL_INTERVAL_MS);
    };

    const stopPolling = () => {
      if (interval) clearInterval(interval);
    };

    const handleVisibility = () => {
      // pausar si el usuario tiene otra pestaña activa
      document.hidden ? stopPolling() : startPolling();
    };

    startPolling();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      mounted = false;
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // ── Cerrar al click fuera ────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Toggle ───────────────────────────────────────────────────────────────
  const handleToggle = () => {
    setOpen((v) => {
      const opening = !v;
      if (opening) {
        const count = data?.total_alertas ?? 0;
        setSeen(true);
        setLastCount(count);
        storeLastCount(count); // persiste en localStorage
      }
      return opening;
    });
  };

  const totalAlertas = data?.total_alertas ?? 0;
  const hasAlerts = totalAlertas > 0;
  const newAlerts = Math.max(0, totalAlertas - lastCount);
  const showBadge = hasAlerts && !seen;

  return (
    <div ref={dropdownRef} className="relative">
      {/* ── Botón ── */}
      <button
        onClick={handleToggle}
        aria-label="Alertas de stock"
        className="relative p-2 rounded-xl bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
      >
        {hasAlerts ? (
          <BellAlertIcon
            className={`w-5 h-5 ${showBadge ? "text-red-500" : "text-gray-500"}`}
          />
        ) : (
          <BellIcon className="w-5 h-5 text-gray-400" />
        )}

        {showBadge && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white tabular-nums">
            {/* fix: mostrar alertas reales, no "1" hardcodeado */}
            {newAlerts > 9 ? "9+" : newAlerts || totalAlertas}
          </span>
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-500">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-white/80" />
              <span className="text-sm font-semibold text-white">
                Alertas de stock
              </span>
            </div>
            {hasAlerts && (
              <span className="text-xs font-bold text-white bg-white/20 border border-white/30 px-2 py-0.5 rounded-full">
                {totalAlertas} {totalAlertas === 1 ? "producto" : "productos"}
              </span>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-center text-sm text-gray-400 italic">
                Cargando...
              </p>
            ) : !hasAlerts ? (
              <div className="px-4 py-6 text-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Todo en orden
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  No hay insumos con stock bajo.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {data?.productos.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Stock:{" "}
                        <span className="font-semibold text-gray-600">
                          {p.stock_actual}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`ml-3 shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                        p.estado === "Agotado"
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {p.estado}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {hasAlerts && (
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
              <p className="text-[10px] text-gray-400 text-center">
                Actualizando automáticamente cada minuto
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
