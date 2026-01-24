import useSWR from "swr";
import { endpoints } from "../services/StatsService";
import {
  UserGroupIcon,
  BanknotesIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";

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

// Formato COP abreviado
function formatCopInput(value: string | number): string {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  const n = Number(digits);
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
    <div className="w-full xl:w-[35%] ml-auto px-4 sm:px-0">
      {/* CONTENEDOR ÚNICO */}
      <div className="rounded-2xl bg-white border border-white shadow-md divide-y divide-gray-200">
        {data.map((ref: any) => (
          <div key={ref.referrer_name} className="p-5">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15">
                <ClipboardDocumentIcon className="h-5 w-5 text-cyan-600" />
              </div>

              {ref.referrer_name ? (
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    ref.referrer_name === "Dra. Adele"
                      ? "bg-pink-100 text-pink-800"
                      : ref.referrer_name === "Dra. Fernanda"
                        ? "bg-purple-100 text-purple-800"
                        : ref.referrer_name === "Dr. Alexander"
                          ? "bg-teal-100 text-teal-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {ref.referrer_name}
                </span>
              ) : (
                "—"
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 divide-x divide-gray-200">
              {/* Current Month */}
              <div className="pr-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">
                  Mes Actual
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                  <UserGroupIcon className="h-4 w-4 text-cyan-600" />
                  {ref.month_patients} Pacientes
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <BanknotesIcon className="h-4 w-4 text-cyan-600" />
                  {formatCopInput(ref.month_income)}
                </div>
              </div>

              {/* Historical */}
              <div className="pl-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">
                  Total Histórico
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                  <UserGroupIcon className="h-4 w-4 text-cyan-600" />
                  {ref.total_patients} Pacientes
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <BanknotesIcon className="h-4 w-4 text-cyan-600" />
                  {formatCopInput(ref.total_income)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
