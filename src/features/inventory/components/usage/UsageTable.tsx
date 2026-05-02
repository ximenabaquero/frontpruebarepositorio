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
  if (usages.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            title.includes("Insumo") ? "bg-indigo-400" : "bg-amber-400"
          }`}
        />
        {title}
      </h3>
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Producto", "Estado", "Cantidad", "Fecha", "Motivo"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {usages.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                {/* Producto + descripción */}
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

                {/* Estado */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={u.status} />
                </td>

                {/* Cantidad */}
                <td className="px-4 py-3 text-gray-700 font-medium tabular-nums whitespace-nowrap">
                  {u.quantity} und.
                </td>

                {/* Fecha */}
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                  {formatDate(u.usage_date)}
                </td>

                {/* Motivo */}
                <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate text-xs">
                  {u.reason ?? <span className="italic text-gray-300">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

  if (usages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        <p className="text-gray-400 text-sm">No hay consumos registrados.</p>
      </div>
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
