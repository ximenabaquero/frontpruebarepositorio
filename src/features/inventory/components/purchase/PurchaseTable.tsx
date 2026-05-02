"use client";

import type { InventoryPurchase } from "../../types";
import PaginationBar from "@/components/PaginationBar";

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
  // — paginación —
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onNext: () => void;
  onPrev: () => void;
};

export default function PurchaseTable({
  purchases,
  isAdmin,
  loading,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onNext,
  onPrev,
}: Props) {
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
    // El wrapper agrupa tabla + barra para que compartan el borde redondeado
    <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
      <div className="overflow-x-auto">
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
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                  {p.user?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                  {p.distributor?.name ?? (
                    <span className="italic text-gray-300">
                      Sin distribuidor
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-600 tabular-nums">
                  {p.quantity}
                </td>
                <td className="px-4 py-3 text-right text-gray-600 tabular-nums whitespace-nowrap">
                  {formatCOP(p.unit_price)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900 tabular-nums whitespace-nowrap">
                  {formatCOP(p.total_price)}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                  {new Date(p.purchase_date).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400 max-w-[160px] truncate">
                  {p.notes ?? <span className="italic">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PaginationBar se oculta sola cuando totalPages <= 1 */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onNext={onNext}
        onPrev={onPrev}
        isFirstPage={currentPage === 1}
        isLastPage={currentPage === totalPages}
      />
    </div>
  );
}
