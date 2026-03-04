"use client";
import useSWR from "swr";
import { endpoints } from "../services/StatsService";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include", headers: { Accept: "application/json" } }).then((r) => r.json());

export default function IncomeByProcedureType() {
  const { data, error, isLoading } = useSWR(endpoints.incomeByProcedure, fetcher);

  if (isLoading) return <p className="text-gray-500 italic text-sm">Cargando por tipo...</p>;
  if (error || !Array.isArray(data)) return <p className="text-red-500 text-sm">Error al cargar.</p>;

  const rows = data.slice(0, 10);
  const maxIncome = Math.max(...rows.map((r: any) => Number(r.total_income)), 1);

  return (
    <div className="rounded-2xl bg-white border shadow-md border-gray-100 p-5 w-full">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Ingresos por tipo de procedimiento</h3>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-4">Histórico total</p>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400">Sin datos</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {rows.map((r: any) => {
            const pct = (Number(r.total_income) / maxIncome) * 100;
            return (
              <div key={r.item_name} className="w-full">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-700 font-medium truncate max-w-[65%]">{r.item_name}</span>
                  <span className="font-semibold text-purple-600 whitespace-nowrap">
                    ${Number(r.total_income).toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-400" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}