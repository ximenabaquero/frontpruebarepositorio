"use client";

import type { InventoryUsage } from "../../types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type Props = {
  usages: InventoryUsage[];
  loading: boolean;
};

function StatusBadge({ status }: { status: InventoryUsage["status"] }) {
  if (status === "con_paciente") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        Con paciente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      Sin paciente
    </span>
  );
}

function UsageSection({
  title,
  usages,
}: {
  title: string;
  usages: InventoryUsage[];
}) {
  // ← quitar el return null

  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            title.includes("Insumo") ? "bg-indigo-400" : "bg-amber-400"
          }`}
        />
        {title}
        <span className="ml-auto text-gray-400 font-normal normal-case tracking-normal">
          {usages.length} registros
        </span>
      </h3>

      <div className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {[
                    "Producto",
                    "Registrado por",
                    "Estado",
                    "Cantidad",
                    "Fecha",
                    "Motivo",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {usages.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-gray-400 italic"
                    >
                      No hay datos para mostrar.
                    </td>
                  </tr>
                ) : (
                  usages.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="font-medium text-gray-900 truncate">
                          {u.product?.name ?? "—"}
                        </p>
                        {u.product?.description && (
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {u.product.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium tabular-nums whitespace-nowrap">
                        {u.user?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={u.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium tabular-nums whitespace-nowrap">
                        {u.quantity} und.
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                        {formatDate(u.usage_date)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate text-xs">
                        {u.reason ?? (
                          <span className="italic text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsageTable({ usages, loading }: Props) {
  if (loading) {
    return (
      <p className="text-sm text-gray-400 italic py-8 text-center">
        Cargando consumos...
      </p>
    );
  }

  const insumos = usages.filter((u) => u.product?.type === "insumo");
  const equipos = usages.filter((u) => u.product?.type === "equipo");

  return (
    <div>
      <UsageSection title="Insumos Médicos" usages={insumos} />
      <UsageSection title="Equipos & Mobiliario" usages={equipos} />
    </div>
  );
}
