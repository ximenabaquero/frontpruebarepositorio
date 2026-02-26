"use client";
import useSWR from "swr";
import { endpoints } from "../services/StatsService";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include", headers: { Accept: "application/json" } }).then((r) => r.json());

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function MonthlyIncomeChart() {
  const { data, error, isLoading } = useSWR(endpoints.monthlyIncome, fetcher);

  if (isLoading) return <p className="text-gray-500 italic text-sm">Cargando ingresos mensuales...</p>;
  if (error || !Array.isArray(data)) return <p className="text-red-500 text-sm">Error al cargar.</p>;

  // Keep last 12 months
  const rows = data.slice(-12);
  const maxIncome = Math.max(...rows.map((r: any) => Number(r.total_income)), 1);

  return (
    <div className="rounded-2xl bg-white border shadow-md border-gray-100 p-5 w-full">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Ingresos mensuales</h3>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-4">Ultimos 12 meses</p>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400">Sin datos</p>
      ) : (
        <div className="flex items-end gap-1.5 h-28">
          {rows.map((r: any) => {
            const pct = (Number(r.total_income) / maxIncome) * 100;
            const label = MONTH_NAMES[(Number(r.month) - 1) % 12];
            return (
              <div key={`${r.year}-${r.month}`} className="flex-1 flex flex-col items-center justify-end gap-1">
                <div
                  className="w-full rounded-t-md bg-emerald-400 hover:bg-emerald-500 transition"
                  style={{ height: `${Math.max(pct, 2)}%` }}
                  title={`$${Number(r.total_income).toLocaleString("es-CO")}`}
                />
                <span className="text-[9px] text-gray-400 font-medium">{label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
