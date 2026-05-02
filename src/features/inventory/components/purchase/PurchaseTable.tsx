"use client";

import type { InventoryPurchase } from "../../types";

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

type Props = {
  purchases: InventoryPurchase[];
  isAdmin: boolean;
  loading: boolean;
};

export default function PurchaseTable({ purchases, isAdmin, loading }: Props) {
  if (loading)
    return (
      <p className="text-gray-500 italic text-sm py-6">Cargando compras...</p>
    );

  if (purchases.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        <p className="text-gray-400 text-sm">No hay compras registradas.</p>
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold tracking-wider">
          <tr>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Registrado por</th>
            <th className="px-4 py-3">Distribuidor</th>
            <th className="px-4 py-3 text-right">Cant.</th>
            <th className="px-4 py-3 text-right">P. Unitario</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Notas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {purchases.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
              {/* Producto + descripción */}
              <td className="px-4 py-3 max-w-[200px]">
                <p className="font-medium text-gray-900 truncate">
                  {p.product?.name ?? "—"}
                </p>
                {p.product?.description && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {p.product.description}
                  </p>
                )}
              </td>

              {/* Registrado por */}
              <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                {p.user?.name ?? "—"}
              </td>

              {/* Distribuidor */}
              <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                {p.distributor?.name ?? (
                  <span className="italic text-gray-300">Sin distribuidor</span>
                )}
              </td>

              {/* Cantidad */}
              <td className="px-4 py-3 text-right text-gray-600 tabular-nums">
                {p.quantity}
              </td>

              {/* Precio unitario */}
              <td className="px-4 py-3 text-right text-gray-600 tabular-nums whitespace-nowrap">
                {formatCOP(p.unit_price)}
              </td>

              {/* Total */}
              <td className="px-4 py-3 text-right font-semibold text-gray-900 tabular-nums whitespace-nowrap">
                {formatCOP(p.total_price)}
              </td>

              {/* Fecha */}
              <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                {new Date(p.purchase_date).toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              {/* Notas */}
              <td className="px-4 py-3 text-xs text-gray-400 max-w-[160px] truncate">
                {p.notes ?? <span className="italic">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
