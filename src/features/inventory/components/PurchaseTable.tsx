"use client";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
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
  currentUserId: number;
  onEdit: (p: InventoryPurchase) => void;
  onDelete: (p: InventoryPurchase) => void;
  loading: boolean;
};

export default function PurchaseTable({
  purchases,
  isAdmin,
  currentUserId,
  onEdit,
  onDelete,
  loading,
}: Props) {
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
            <th className="px-4 py-3">Descripción</th>
            <th className="px-4 py-3 text-right">Cant.</th>
            <th className="px-4 py-3 text-right">P. Unitario</th>
            <th className="px-4 py-3 text-right">Total</th>
            {isAdmin && <th className="px-4 py-3">Registrado por</th>}
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {purchases.map((p) => {
            const canEdit = isAdmin || p.user_id === currentUserId;
            return (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {new Date(p.purchase_date).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  {p.category ? (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium"
                      style={{ borderColor: p.category.color, color: p.category.color }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: p.category.color }}
                      />
                      {p.category.name}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-800 font-medium max-w-xs truncate">
                  {p.item_name}
                  {p.notes && (
                    <p className="text-xs text-gray-400 font-normal truncate">{p.notes}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{p.quantity}</td>
                <td className="px-4 py-3 text-right text-gray-600">{formatCOP(p.unit_price)}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-800">
                  {formatCOP(p.total_price)}
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {p.user
                      ? `${p.user.first_name} ${p.user.last_name}`
                      : "—"}
                  </td>
                )}
                <td className="px-4 py-3">
                  {canEdit && (
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => onEdit(p)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="text-gray-400 hover:text-rose-500 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
