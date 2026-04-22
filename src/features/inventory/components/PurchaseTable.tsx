"use client";

import type { InventoryPurchase } from "../types";

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
    return <p className="text-gray-500 italic text-sm py-6">Cargando compras...</p>;

  if (purchases.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        <p className="text-gray-400 text-sm">No hay compras registradas para este periodo.</p>
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold tracking-wider">
          <tr>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Distribuidor</th>
            <th className="px-4 py-3 text-right">Cant.</th>
            <th className="px-4 py-3 text-right">P. Unitario</th>
            <th className="px-4 py-3 text-right">Total</th>
            {isAdmin && <th className="px-4 py-3">Registrado por</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {purchases.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                {new Date(p.purchase_date).toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3">
                {p.product?.category ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    {p.product.category.name}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-800 font-medium max-w-xs truncate">
                {p.product?.name ?? "—"}
                {p.notes && (
                  <p className="text-xs text-gray-400 font-normal truncate">{p.notes}</p>
                )}
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                {p.distributor?.name ?? "—"}
              </td>
              <td className="px-4 py-3 text-right text-gray-600">{p.quantity}</td>
              <td className="px-4 py-3 text-right text-gray-600">{formatCOP(p.unit_price)}</td>
              <td className="px-4 py-3 text-right font-semibold text-gray-800">
                {formatCOP(p.total_price)}
              </td>
              {isAdmin && (
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {p.user?.name ?? "—"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
