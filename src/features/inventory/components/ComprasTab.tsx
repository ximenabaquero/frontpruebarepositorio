"use client";

import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "./PageHeader";
import PurchaseTable from "./PurchaseTable";
import type { InventoryPurchase } from "../types";

interface ComprasTabProps {
  purchases: InventoryPurchase[];
  loading: boolean;
  isAdmin: boolean;
  onOpenPurchase: () => void;
}

export default function ComprasTab({
  purchases,
  loading,
  isAdmin,
  onOpenPurchase,
}: ComprasTabProps) {
  const total = purchases.reduce((acc, p) => acc + p.total_price, 0);
  const avgOrder = purchases.length > 0 ? total / purchases.length : 0;

  const distributorsCount = new Set(
    purchases.filter((p) => p.distributor_id).map((p) => p.distributor_id)
  ).size;

  const fmt = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  return (
    <>
      <PageHeader
        eyebrow="Movimientos"
        title="Compras"
        subtitle="Historial de órdenes y proveedores."
        actions={[
          <button
            key="export"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Exportar
          </button>,
          <button
            key="purchase"
            onClick={onOpenPurchase}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Registrar compra
          </button>,
        ]}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div
          className="flex flex-col gap-1.5 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
          style={{ borderLeftWidth: "3px", borderLeftColor: "#9333EA" }}
        >
          <div className="flex items-center gap-1.5 text-xs text-purple-600 uppercase tracking-wide font-semibold">
            Total del período
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">
            {fmt(total)}
          </div>
          <div className="text-xs text-gray-500">{purchases.length} órdenes</div>
        </div>

        <div
          className="flex flex-col gap-1.5 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
          style={{ borderLeftWidth: "3px", borderLeftColor: "#0EB5A3" }}
        >
          <div className="flex items-center gap-1.5 text-xs text-teal-600 uppercase tracking-wide font-semibold">
            Promedio orden
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">
            {fmt(avgOrder)}
          </div>
          <div className="text-xs text-gray-500">por compra</div>
        </div>

        <div
          className="flex flex-col gap-1.5 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
          style={{ borderLeftWidth: "3px", borderLeftColor: "#F59E0B" }}
        >
          <div className="flex items-center gap-1.5 text-xs text-amber-600 uppercase tracking-wide font-semibold">
            Distribuidores activos
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">
            {distributorsCount}
          </div>
          <div className="text-xs text-gray-500">con órdenes este período</div>
        </div>

        <div
          className="flex flex-col gap-1.5 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
          style={{ borderLeftWidth: "3px", borderLeftColor: "#059669" }}
        >
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 uppercase tracking-wide font-semibold">
            Productos distintos
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">
            {new Set(purchases.map((p) => p.product_id)).size}
          </div>
          <div className="text-xs text-gray-500">comprados</div>
        </div>
      </div>

      {/* Purchase Table */}
      <PurchaseTable purchases={purchases} isAdmin={isAdmin} loading={loading} />
    </>
  );
}
