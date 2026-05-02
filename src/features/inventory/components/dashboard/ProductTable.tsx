"use client";

import { InventoryProduct } from "../../types";

interface Props {
  products: InventoryProduct[];
  title: string;
  icon: React.ReactNode;
  type: "insumo" | "equipo";
}

function renderStatus(estado: string | null) {
  if (!estado) return null;

  const colors: Record<string, string> = {
    Disponible: "bg-emerald-50 text-emerald-600",
    Crítico: "bg-rose-50 text-rose-600",
    Agotado: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="flex justify-center">
      <span
        className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors[estado] ?? "bg-gray-100"}`}
      >
        {estado}
      </span>
    </div>
  );
}

export default function ProductTable({ products, title, icon, type }: Props) {
  return (
    <div className="mb-6">
      {/* Header */}
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="text-indigo-500">{icon}</span>
        {title}
        <span className="ml-auto text-gray-400 font-normal normal-case tracking-normal">
          {products.length} ítems
        </span>
      </h3>

      {/* Tabla con scroll */}
      <div className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  {type === "insumo" ? (
                    <>
                      <th className="px-4 py-3 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        Stock
                      </th>
                      <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                    </>
                  ) : (
                    <th className="px-4 py-3 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Cantidad
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={type === "insumo" ? 5 : 4}
                      className="px-4 py-8 text-center text-sm text-gray-400 italic"
                    >
                      No hay datos para mostrar.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-indigo-600 cursor-pointer hover:underline">
                          {p.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="text-xs text-gray-400 truncate leading-relaxed">
                          {p.description || "Sin descripción"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500">
                          {p.category?.name ?? "N/A"}
                        </span>
                      </td>

                      {type === "insumo" ? (
                        <>
                          <td className="px-4 py-3 text-right font-semibold text-gray-700 tabular-nums">
                            {p.cantidad}
                          </td>
                          <td className="px-4 py-3">
                            {renderStatus(p.estado)}
                          </td>
                        </>
                      ) : (
                        <td className="px-4 py-3 text-right font-semibold text-gray-700 tabular-nums">
                          {p.cantidad}
                        </td>
                      )}
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
