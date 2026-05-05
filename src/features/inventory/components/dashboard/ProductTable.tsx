"use client";

import { InventoryProduct } from "../../types";

interface Props {
  products: InventoryProduct[];
  title: string;
  icon: React.ReactNode;
  type: "insumo" | "equipo";
}

const STATUS_STYLES: Record<string, string> = {
  Disponible: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Crítico: "bg-amber-50 text-amber-700 border border-amber-200",
  Agotado: "bg-red-50 text-red-600 border border-red-200",
};

function renderStatus(estado: string | null) {
  if (!estado) return null;
  return (
    <div className="flex justify-center">
      <span
        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLES[estado] ?? "bg-gray-100 text-gray-500"}`}
      >
        {estado}
      </span>
    </div>
  );
}

function DescriptionCell({ text }: { text: string | null }) {
  const display = text || "Sin descripción";
  const isTruncatable = !!text && text.length > 40;

  if (!isTruncatable) {
    return <p className="text-xs text-gray-400 leading-relaxed">{display}</p>;
  }

  return (
    <div className="relative group/desc">
      <p className="text-xs text-gray-400 truncate leading-relaxed max-w-[180px] cursor-default">
        {display}
      </p>
      <div className="absolute left-0 top-full mt-1.5 w-64 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover/desc:opacity-100 transition-opacity duration-150 pointer-events-none z-[9999] whitespace-normal leading-relaxed">
        {text}
        <div className="absolute left-4 bottom-full border-4 border-transparent border-b-gray-900" />
      </div>
    </div>
  );
}

export default function ProductTable({ products, title, icon, type }: Props) {
  const colSpan = type === "insumo" ? 5 : 4;

  return (
    <div className="mb-8">
      {/* Header — igual que UsageTable */}
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span
          className={`inline-block w-2 h-2 rounded-full ${type === "insumo" ? "bg-indigo-400" : "bg-purple-400"}`}
        />
        {title}
        <span className="ml-auto text-gray-400 font-normal normal-case tracking-normal">
          {products.length} ítems
        </span>
      </h3>

      {/* Contenedor — igual que UsageTable */}
      <div className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header fijo */}
        <table className="min-w-full text-sm table-fixed">
          <colgroup>
            <col style={{ width: "22%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "20%" }} />
            {type === "insumo" ? (
              <>
                <col style={{ width: "14%" }} />
                <col style={{ width: "14%" }} />
              </>
            ) : (
              <col style={{ width: "28%" }} />
            )}
          </colgroup>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Producto", "Descripción", "Categoría"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
              {type === "insumo" ? (
                <>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
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
        </table>

        {/* Body con scroll */}
        <div className="overflow-x-auto">
          <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
            <table className="min-w-full text-sm table-fixed">
              <colgroup>
                <col style={{ width: "22%" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "20%" }} />
                {type === "insumo" ? (
                  <>
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "14%" }} />
                  </>
                ) : (
                  <col style={{ width: "28%" }} />
                )}
              </colgroup>
              <tbody className="bg-white divide-y divide-gray-50">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={colSpan}
                      className="px-4 py-10 text-center text-sm text-gray-400 italic"
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
                        <span className="font-semibold text-gray-900 text-sm">
                          {p.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <DescriptionCell text={p.description} />
                      </td>
                      <td className="px-4 py-3">
                        {p.category?.name ? (
                          <span className="inline-block text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {p.category.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300 italic">
                            N/A
                          </span>
                        )}
                      </td>
                      {type === "insumo" ? (
                        <>
                          <td className="px-4 py-3 text-right font-bold text-gray-800 tabular-nums">
                            {p.cantidad}
                          </td>
                          <td className="px-4 py-3">
                            {renderStatus(p.estado)}
                          </td>
                        </>
                      ) : (
                        <td className="px-4 py-3 text-right font-bold text-gray-800 tabular-nums">
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
