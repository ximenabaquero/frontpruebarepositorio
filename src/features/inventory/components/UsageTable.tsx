"use client";

import type { InventoryUsage } from "../types";
import { TrashIcon } from "@heroicons/react/24/outline";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type Props = {
  usages: InventoryUsage[];
  onDelete: (u: InventoryUsage) => void;
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
  if (status === "sin_paciente") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        Sin paciente
      </span>
    );
  }
  return <span className="text-gray-400 text-xs">—</span>;
}

function UsageSection({
  title,
  usages,
  onDelete,
}: {
  title: string;
  usages: InventoryUsage[];
  onDelete: (u: InventoryUsage) => void;
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
              {[
                "Nombre del Producto",
                "Registrado por",
                "Cantidad",
                "Fecha",
                "Estado",
                "Paciente",
                "Motivo",
                "",
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
            {usages.map((u) => {
              const patient = u.medical_evaluation?.patient;
              const patientName = patient
                ? `${patient.first_name} ${patient.last_name}`
                : "—";

              return (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                    {u.product?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {u.user
                      ? `${u.user.first_name} ${u.user.last_name}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {u.quantity} und.
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {formatDate(u.usage_date)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {patientName}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">
                    {u.reason ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDelete(u)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar consumo"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function UsageTable({ usages, onDelete, loading }: Props) {
  if (loading) {
    return (
      <p className="text-sm text-gray-400 italic py-8 text-center">
        Cargando consumos...
      </p>
    );
  }

  if (usages.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic py-8 text-center">
        No hay consumos registrados para este periodo.
      </p>
    );
  }

  const insumos = usages.filter((u) => u.product?.type === "insumo");
  const equipos = usages.filter((u) => u.product?.type === "equipo");

  return (
    <div>
      <UsageSection title="Insumos Médicos" usages={insumos} onDelete={onDelete} />
      <UsageSection title="Equipos & Mobiliario" usages={equipos} onDelete={onDelete} />
    </div>
  );
}
