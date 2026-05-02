"use client";

import { InventoryProduct } from "../../types";

interface Props {
  products: InventoryProduct[];
  title: string;
  icon: React.ReactNode;
  type: "insumo" | "equipo";
}

export default function ProductTable({ products, title, icon, type }: Props) {
  // Función interna modificada: ya no muestra la cantidad en el badge
  const renderStatus = (estado: string | null) => {
    if (!estado) return null;

    const colors = {
      Disponible: "bg-emerald-50 text-emerald-600",
      Crítico: "bg-rose-50 text-rose-600",
      Agotado: "bg-gray-100 text-gray-500",
    };

    return (
      <div className="flex justify-center">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            colors[estado as keyof typeof colors] || "bg-gray-100"
          }`}
        >
          {estado}
        </span>
      </div>
    );
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-end mb-4 px-2">
        <h3 className="flex items-center gap-2 font-bold text-slate-800 text-lg">
          <span className="text-indigo-500">{icon}</span>
          {title}
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          Mostrando {products.length} ítems
        </span>
      </div>

      {/* Contenedor con altura máxima y scroll vertical */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="max-h-[450px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 text-[11px] uppercase text-slate-400 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-5">Producto</th>
                <th className="px-4 py-5">Descripción</th>
                <th className="px-4 py-5">Categoría</th>
                {type === "insumo" ? (
                  <>
                    <th className="px-4 py-5 text-right">Stock</th>
                    <th className="px-4 py-5 text-center">Estado</th>
                  </>
                ) : (
                  <th className="px-6 py-5 text-right">Cantidad</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-5">
                    <span className="font-bold text-indigo-600 hover:underline cursor-pointer">
                      {p.name}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                      {p.description || "Sin descripción"}
                    </p>
                  </td>
                  <td className="px-4 py-5">
                    <span className="text-slate-600 text-xs">
                      {p.category?.name || "N/A"}
                    </span>
                  </td>

                  {type === "insumo" ? (
                    <>
                      <td className="px-4 py-5 text-right font-semibold text-slate-700">
                        {p.cantidad}
                      </td>
                      <td className="px-4 py-5">{renderStatus(p.estado)}</td>
                    </>
                  ) : (
                    <td className="px-6 py-5 text-right font-bold text-slate-700">
                      {p.cantidad}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
