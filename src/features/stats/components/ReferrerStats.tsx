import useSWR from "swr";
import { endpoints } from "../services/StatsService";
import {
  UserGroupIcon,
  BanknotesIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  }).then((res) => res.json());

// Formato COP abreviado
function formatCopInput(value: string | number): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ReferrerStats() {
  const { data, error, isLoading } = useSWR(endpoints.referrerStats, fetcher);

  if (isLoading)
    return <p className="text-gray-500 italic">Cargando remitentes...</p>;
  if (error || !data)
    return <p className="text-red-500">Error al cargar remitentes.</p>;

  return (
    <div className="w-full px-4 sm:px-0">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold px-6 py-4">
          <div>Médico</div>
          <div className="text-center">Pacientes</div>
          <div className="text-center">Confirmados</div>
          <div className="text-center">Cancelados</div>
          <div className="text-right">Ingreso Mes</div>
          <div className="text-right">Ingreso Año</div>
        </div>

        {/* Rows */}
        {Array.isArray(data) &&
          data.map((ref: any, index: number) => (
            <div
              key={ref.referrer_name}
              className={`grid grid-cols-6 items-center px-6 py-4 text-sm ${
                index !== data.length - 1 ? "border-b border-gray-100" : ""
              } hover:bg-gray-50 transition`}
            >
              {/* Médico */}
              <div className="font-medium text-gray-800">
                {ref.referrer_name || "—"}
              </div>

              {/* Pacientes */}
              <div className="text-center text-gray-700">
                {ref.total_patients_month}
              </div>

              {/* Confirmados */}
              <div className="text-center text-green-600 font-medium">
                {ref.total_confirmed_month}
              </div>

              {/* Cancelados */}
              <div className="text-center text-red-500 font-medium">
                {ref.total_canceled_month}
              </div>

              {/* Ingreso Mes */}
              <div className="text-right text-gray-800 font-medium">
                {formatCopInput(ref.confirmed_income_month)}
              </div>

              {/* Ingreso Año */}
              <div className="text-right text-gray-900 font-semibold">
                {formatCopInput(ref.confirmed_income_year)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
