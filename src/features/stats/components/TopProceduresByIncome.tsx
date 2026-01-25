import useSWR from "swr";
import { endpoints } from "../services/StatsService";

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

export default function TopProceduresByIncome() {
  const { data, error, isLoading } = useSWR(endpoints.topByIncome, fetcher);

  if (isLoading)
    return <p className="text-gray-500 italic">Cargando procedimientos...</p>;

  if (error || !Array.isArray(data))
    return <p className="text-red-500">Error al cargar procedimientos.</p>;

  // Tomamos el mayor ingreso para calcular proporciones
  const maxRevenue = Math.max(...data.map((p: any) => Number(p.total_revenue)));

  return (
    <div className="w-full px-4 sm:px-0 ">
      <div className="rounded-2xl bg-white border shadow-md border-gray-100 p-5">
        {/* Título */}
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          Top por Ingresos
        </h3>
        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-4">
          Basado en el periodo actual
        </p>

        {/* Lista */}
        <div className="space-y-4">
          {data.map((proc: any) => {
            const revenue = Number(proc.total_revenue);
            const percentage =
              maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;

            return (
              <div key={proc.item_name}>
                {/* Nombre + valor */}
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-700">{proc.item_name}</span>
                  <span className="font-medium text-emerald-600">
                    ${Number(revenue).toLocaleString("es-CO")}
                  </span>
                </div>

                {/* Barra */}
                <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
