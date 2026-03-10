"use client";

import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import type { InventoryUsage } from "../types";
import { deleteUsage } from "../services/inventoryService";
import { useState } from "react";

interface Props {
  usages: InventoryUsage[];
  isAdmin: boolean;
  currentUserId: number;
  loading: boolean;
  onRefresh: () => void;
}

const COP = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

export default function UsageTable({ usages, isAdmin, currentUserId, loading, onRefresh }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(usage: InventoryUsage) {
    if (!confirm(`¿Eliminar consumo de "${usage.product?.name ?? "producto"}"? El stock será revertido.`)) return;
    setDeletingId(usage.id);
    try {
      await deleteUsage(usage.id);
      onRefresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <ArrowPathIcon className="w-6 h-6 animate-spin mr-2" />
        Cargando consumos...
      </div>
    );
  }

  if (usages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center text-sm text-gray-400">
        No hay consumos registrados en este periodo.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-3 text-left font-medium">Fecha</th>
              <th className="px-5 py-3 text-left font-medium">Producto</th>
              <th className="px-5 py-3 text-left font-medium">Categoría</th>
              <th className="px-5 py-3 text-right font-medium">Cantidad</th>
              <th className="px-5 py-3 text-right font-medium">Valor est.</th>
              {isAdmin && <th className="px-5 py-3 text-left font-medium">Registrado por</th>}
              <th className="px-5 py-3 text-left font-medium">Notas</th>
              <th className="px-5 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usages.map((usage) => {
              const canDelete = isAdmin || usage.user_id === currentUserId;
              const estimatedValue = (usage.product?.unit_price ?? 0) * usage.quantity;
              return (
                <tr key={usage.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                    {formatDate(usage.usage_date)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">
                      {usage.product?.name ?? "—"}
                    </div>
                    {usage.product?.description && (
                      <div className="text-xs text-gray-400">{usage.product.description}</div>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {usage.product?.category ? (
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: usage.product.category.color }}
                      >
                        {usage.product.category.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900">
                    {usage.quantity}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-600">
                    {COP.format(estimatedValue)}
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3 text-gray-600">
                      {usage.user
                        ? `${usage.user.first_name} ${usage.user.last_name}`
                        : "—"}
                    </td>
                  )}
                  <td className="px-5 py-3 text-gray-500 max-w-xs truncate">
                    {usage.notes || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(usage)}
                          disabled={deletingId === usage.id}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                          title="Eliminar consumo (revierte stock)"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
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
