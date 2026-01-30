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

// Colores para los números
const numberColors = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-pink-100 text-pink-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
];

export default function TopProceduresByDemand() {
  const { data, error, isLoading } = useSWR(endpoints.topByDemand, fetcher);

  if (isLoading)
    return <p className="text-gray-500 italic">Cargando demanda...</p>;

  if (error || !Array.isArray(data))
    return <p className="text-red-500">Error al cargar demanda.</p>;

  return (
    <div className="w-full max-w-xs min-w-[280px] px-4 sm:px-0">
      <div className="rounded-2xl bg-white border shadow-md border-gray-100 p-5">
        {/* Título */}
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          Top por Demanda
        </h3>
        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-4">
          Basado en el periodo actual
        </p>

        {/* Lista */}
        <div className="space-y-3">
          {data.map((item: any, index: number) => {
            const color = numberColors[index % numberColors.length];

            return (
              <div
                key={item.item_name}
                className="flex items-start gap-3 text-sm w-full"
              >
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-semibold ${color}`}
                >
                  {index + 1}
                </span>

                <div className="flex flex-col w-full">
                  <span className="text-gray-700 font-medium">
                    {item.item_name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {item.total_count} citas/mes
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
