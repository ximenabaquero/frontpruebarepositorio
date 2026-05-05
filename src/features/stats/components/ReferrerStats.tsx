import useSWR from "swr";
import { endpoints } from "../services/StatsService";
import PaginationBar from "@/components/PaginationBar";
import { usePagination } from "@/utils/usePagination";

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  })
    .then((res) => res.json())
    .then((json) => json.data || []);

function formatCopInput(value: string | number): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

function toNumber(value: unknown): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

export default function ReferrerStats() {
  const { data, error, isLoading } = useSWR(endpoints.referrerStats, fetcher);

  const allRefs = Array.isArray(data) ? data : [];

  // Calcular totales
  const totals = allRefs.reduce(
    (acc, ref: any) => ({
      total_patients_month: acc.total_patients_month + toNumber(ref.total_patients_month),
      total_confirmed_month: acc.total_confirmed_month + toNumber(ref.total_confirmed_month),
      total_canceled_month: acc.total_canceled_month + toNumber(ref.total_canceled_month),
      confirmed_income_month: acc.confirmed_income_month + toNumber(ref.confirmed_income_month),
      confirmed_income_year: acc.confirmed_income_year + toNumber(ref.confirmed_income_year),
    }),
    {
      total_patients_month: 0,
      total_confirmed_month: 0,
      total_canceled_month: 0,
      confirmed_income_month: 0,
      confirmed_income_year: 0,
    }
  );

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToNext,
    goToPrev,
    isFirstPage,
    isLastPage,
  } = usePagination(allRefs, 10);

  if (isLoading)
    return <p className="text-gray-500 italic">Cargando remitentes...</p>;
  if (error || !data)
    return <p className="text-red-500">Error al cargar remitentes.</p>;

  return (
    <div className="w-full px-4 sm:px-0">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gradient-to-r from-emerald-600 to-teal-600">
              <tr className="text-left text-xs font-semibold text-white/95 uppercase tracking-wide">
                <th className="px-5 py-3">Especialista</th>
                <th className="px-5 py-3 text-center">Pacientes</th>
                <th className="px-5 py-3 text-center hidden sm:table-cell">
                  Confirmados
                </th>
                <th className="px-5 py-3 text-center hidden sm:table-cell">
                  Cancelados
                </th>
                <th className="px-5 py-3 text-right hidden md:table-cell">
                  Ingreso Mes
                </th>
                <th className="px-5 py-3 text-right">Ingreso Año</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedItems.map((ref: any) => (
                <tr
                  key={ref.referrer_name}
                  className="hover:bg-emerald-50/40 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900 text-sm">
                      {ref.referrer_name || "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm text-gray-600">
                      {ref.total_patients_month}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      {ref.total_confirmed_month}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                      {ref.total_canceled_month}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right hidden md:table-cell">
                    <span className="text-sm text-gray-700 font-medium">
                      {formatCopInput(ref.confirmed_income_month)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm text-gray-900 font-semibold">
                      {formatCopInput(ref.confirmed_income_year)}
                    </span>
                  </td>
                </tr>
              ))}
              {allRefs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-6 text-sm text-gray-400 italic text-center"
                  >
                    No hay datos de remitentes.
                  </td>
                </tr>
              )}
              {allRefs.length > 0 && (
                <tr className="bg-gray-50 font-bold border-t-2 border-gray-200">
                  <td className="px-5 py-4">
                    <p className="text-gray-900">TOTAL</p>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm text-gray-900">
                      {totals.total_patients_month}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      {totals.total_confirmed_month}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                      {totals.total_canceled_month}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right hidden md:table-cell">
                    <span className="text-sm text-gray-900 font-semibold">
                      {formatCopInput(totals.confirmed_income_month)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm text-gray-900 font-semibold">
                      {formatCopInput(totals.confirmed_income_year)}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={allRefs.length}
          itemsPerPage={10}
          onNext={goToNext}
          onPrev={goToPrev}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
        />
      </div>
    </div>
  );
}
