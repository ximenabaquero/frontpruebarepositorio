import useSWR from "swr";
import { endpoints } from "../services/StatsService";

import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid";

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${
        localStorage.getItem("coldesthetic_admin_token") ||
        sessionStorage.getItem("coldesthetic_admin_token")
      }`,
    },
  }).then((res) => res.json());

function formatCopInput(value: string | number): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

function renderVariation(label: string, variation: number | null | undefined) {
  if (label === "Balance Total") return null;

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
    <div
      className={`mt-1 flex items-center gap-1 text-xs font-medium ${color}`}
    >
      <Icon className="w-4 h-4" />
      <span>{variation}% vs mes anterior</span>
    </div>
  );
}

export default function SummaryStats() {
  const { data, error, isLoading } = useSWR(endpoints.summary, fetcher);

  if (isLoading)
    return <p className="text-gray-500 italic">Cargando estadísticas...</p>;
  if (error || !data)
    return <p className="text-red-500">Error al cargar estadísticas.</p>;

  const stats = [
    {
      label: "Ingresos Periodo Actual",
      value: formatCopInput(data.this_month_income),
      variation: data.income_variation,
    },
    {
      label: "Nuevos Pacientes",
      value: data.this_month_patients,
      variation: data.patients_variation,
    },
    {
      label: "Registros Clínicos",
      value: data.this_month_sessions,
      variation: data.sessions_variation,
    },
    {
      label: "Procedimientos",
      value: data.this_month_procedures,
      variation: data.procedures_variation,
    },
    {
      label: "Balance Total",
      value: formatCopInput(data.total_income),
      variation: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-4 sm:px-0 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>

          <div className="relative block bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100 p-5 shadow-lg hover:shadow-xl transition-all duration-500 h-full">
            {/* Caso especial Balance Total */}
            {stat.label === "Balance Total" ? (
              <>
                <div className="flex justify-between items-start">
                  <h3 className="text-[10px] uppercase tracking-wider text-gray-400 mb-4">
                    {stat.label}
                  </h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 break-words leading-tight tracking-tight w-full overflow-hidden text-ellipsis">
                  {stat.value}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">
                  {stat.label}
                </h3>
                <p className="text-2xl font-bold text-gray-900 break-words leading-tight tracking-tight w-full overflow-hidden text-ellipsis">
                  {stat.value}
                </p>
                {renderVariation(stat.label, stat.variation)}
              </>
            )}

            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 group-hover:w-2/3 transition-all duration-500 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
