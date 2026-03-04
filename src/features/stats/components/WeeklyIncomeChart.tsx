"use client";
import useSWR from "swr";
import { endpoints } from "../services/StatsService";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include", headers: { Accept: "application/json" } }).then((r) => r.json());

function formatDay(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-ES", { weekday: "short" });
}

export default function WeeklyIncomeChart() {
  const { data, error, isLoading } = useSWR(endpoints.weeklyIncome, fetcher);

  if (isLoading) return <p className="text-gray-500 italic text-sm">Cargando semana...</p>;
  if (error || !Array.isArray(data)) return <p className="text-red-500 text-sm">Error al cargar.</p>;

  const maxIncome = Math.max(...data.map((r: any) => Number(r.total_income)), 1);

  return (
    <div className="rounded-2xl bg-white border shadow-md border-gray-100 p-5 w-full">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Ingresos esta semana</h3>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-4">Por dia</p>
      {data.length === 0 ? (
        <p className="text-sm text-gray-400">Sin datos esta semana</p>
      ) : (
        <div className="flex items-end gap-2 h-28">
          {data.map((r: any) => {
            const pct = (Number(r.total_income) / maxIncome) * 100;
            return (
              <div key={r.date} className="flex-1 flex flex-col items-center justify-end gap-1">
                <div
                  className="w-full rounded-t-md bg-blue-400 hover:bg-blue-500 transition"
                  style={{ height: `${Math.max(pct, 2)}%` }}
                  title={`$${Number(r.total_income).toLocaleString("es-CO")}`}
                />
                <span className="text-[9px] text-gray-400 font-medium capitalize">{formatDay(r.date)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}