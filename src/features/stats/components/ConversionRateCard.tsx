"use client";

import useSWR from "swr";
import { endpoints } from "../services/StatsService";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  }).then((r) => r.json());

export default function ConversionRateCard() {
  const { data, isLoading, error } = useSWR(endpoints.conversionRate, fetcher);

  const confirmed = Number(data?.confirmed ?? 0);
  const canceled = Number(data?.canceled ?? 0);
  const total = Number(data?.total ?? 0);
  const rate = Number(data?.rate ?? 0);
  const cancelRate = total > 0 ? Math.round((canceled / total) * 100) : 0;

  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-md p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Tasa de conversión</p>
          <p className="text-[10px] text-gray-400">Evaluaciones confirmadas vs canceladas</p>
        </div>
        <span className="text-2xl font-bold text-emerald-600">{rate}%</span>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400 italic">Calculando...</p>
      ) : error || !data ? (
        <p className="text-sm text-red-400">Error al cargar</p>
      ) : (
        <>
          {/* Barra de progreso */}
          <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden flex">
            <div
              className="h-full bg-emerald-400 rounded-l-full transition-all"
              style={{ width: `${rate}%` }}
            />
            <div
              className="h-full bg-red-300 rounded-r-full transition-all"
              style={{ width: `${cancelRate}%` }}
            />
          </div>

          {/* Leyenda */}
          <div className="flex justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-emerald-700">{confirmed.toLocaleString("es-CO")}</span>
              <span className="text-gray-400">confirmados</span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircleIcon className="w-4 h-4 text-red-400" />
              <span className="font-semibold text-red-500">{canceled.toLocaleString("es-CO")}</span>
              <span className="text-gray-400">cancelados</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
