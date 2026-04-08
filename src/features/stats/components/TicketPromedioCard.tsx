"use client";

import useSWR from "swr";
import { endpoints } from "../services/StatsService";
import { ReceiptPercentIcon } from "@heroicons/react/24/outline";
import InfoTooltip from "@/components/InfoTooltip";

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  })
    .then((r) => r.json())
    .then((json) => json.data || {});

function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function TicketPromedioCard() {
  const { data, isLoading, error } = useSWR(endpoints.summary, fetcher);

  const totalIncome = Number(data?.total_income ?? 0);
  const totalSessions = Number(data?.total_sessions ?? 0);
  const avg = totalSessions > 0 ? totalIncome / totalSessions : 0;

  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-md p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-100">
          <ReceiptPercentIcon className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1">
            Ticket promedio
            <InfoTooltip text="ingreso promedio generado por cada sesión confirmada. se calcula dividiendo los ingresos totales entre el número de sesiones." />
          </p>
          <p className="text-[10px] text-gray-400">Por sesión confirmada</p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400 italic">Calculando...</p>
      ) : error || !data ? (
        <p className="text-sm text-red-400">Error al cargar</p>
      ) : (
        <>
          <p className="text-2xl font-bold text-gray-900">{formatCOP(avg)}</p>
          <p className="text-xs text-gray-500">
            Basado en{" "}
            <span className="font-semibold text-gray-700">{totalSessions.toLocaleString("es-CO")}</span>{" "}
            sesiones confirmadas · Total{" "}
            <span className="font-semibold text-gray-700">{formatCOP(totalIncome)}</span>
          </p>
        </>
      )}
    </div>
  );
}
