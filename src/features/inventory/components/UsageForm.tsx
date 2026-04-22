"use client";

import { useState } from "react";
import { XMarkIcon, UserIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { createUsage } from "../services/inventoryService";
import type { InventoryProduct, UsageFormValues, UsageItem, UsageApiError } from "../types";

type Props = {
  products: InventoryProduct[];
  onClose: () => void;
  onSaved: () => void;
};

function buildEmptyItems(products: InventoryProduct[]): UsageItem[] {
  return products
    .filter((p) => p.active && p.stock > 0)
    .map((p) => ({ product_id: p.id, quantity: "" }));
}

export default function UsageForm({ products, onClose, onSaved }: Props) {
  const activeProducts = products.filter((p) => p.active && p.stock > 0);

  const [items, setItems] = useState<UsageItem[]>(() => buildEmptyItems(products));
  const [usageDate, setUsageDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<UsageFormValues["status"]>("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<UsageApiError["error_code"] | null>(null);

  function updateQuantity(productId: number, value: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, quantity: value === "" ? "" : Number(value) } : item
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setErrorType(null);

    const filledItems = items.filter(
      (item) => item.quantity !== "" && Number(item.quantity) > 0
    );

    if (filledItems.length === 0) {
      setError("Ingresa la cantidad de al menos un producto.");
      return;
    }

    if (status === "sin_paciente" && !reason.trim()) {
      setError("El motivo es obligatorio cuando no hay paciente.");
      return;
    }

    const payload: UsageFormValues = {
      items: filledItems as Array<{ product_id: number; quantity: number }>,
      usage_date: usageDate,
      status,
      reason: reason.trim(),
      medical_evaluation_id: null,
      notes: notes.trim(),
    };

    setSaving(true);
    try {
      await createUsage(payload);
      toast.success("Consumo registrado correctamente");
      onSaved();
      onClose();
    } catch (err: unknown) {
      const apiErr = err as Partial<UsageApiError>;
      if (apiErr.error_code === "insufficient_stock") {
        setErrorType("insufficient_stock");
        setError(
          apiErr.product_name
            ? `Stock insuficiente para "${apiErr.product_name}".`
            : apiErr.message || "Stock insuficiente para uno de los productos."
        );
      } else if (apiErr.error_code === "equipo_no_consumible") {
        setErrorType("equipo_no_consumible");
        setError("Los equipos no tienen stock consumible. Revisa los ítems seleccionados.");
      } else {
        setError(err instanceof Error ? err.message : "Error al registrar consumo");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">Registrar Consumo</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Lista de productos */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Productos consumidos <span className="text-red-400">*</span>
              </label>
              {activeProducts.length === 0 ? (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                  No hay productos activos con stock disponible.
                </p>
              ) : (
                <div className="max-h-[280px] overflow-y-auto rounded-xl border border-gray-200 divide-y divide-gray-100">
                  {activeProducts.map((product) => {
                    const item = items.find((i) => i.product_id === product.id);
                    const qty = item?.quantity ?? "";
                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                          <p className="text-xs text-gray-400">
                            Stock: {product.stock} und.
                            {product.category && (
                              <span
                                className="ml-2 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
                                style={{ backgroundColor: product.category.color }}
                              >
                                {product.category.name}
                              </span>
                            )}
                          </p>
                        </div>
                        <input
                          type="number"
                          min={0}
                          max={product.stock}
                          value={qty}
                          onChange={(e) => updateQuantity(product.id, e.target.value)}
                          placeholder="0"
                          className="w-20 ml-3 rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Fecha <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={usageDate}
                onChange={(e) => setUsageDate(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Estado del consumo
              </label>
              <div className="flex gap-2">
                {[
                  {
                    value: "con_paciente",
                    label: "Con paciente",
                    icon: UserIcon,
                    active: "bg-blue-600 text-white border-blue-600",
                    inactive: "bg-white text-gray-600 border-gray-200 hover:border-blue-300",
                  },
                  {
                    value: "sin_paciente",
                    label: "Sin paciente",
                    icon: NoSymbolIcon,
                    active: "bg-gray-600 text-white border-gray-600",
                    inactive: "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setStatus((prev) =>
                        prev === opt.value ? "" : (opt.value as UsageFormValues["status"])
                      )
                    }
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                      status === opt.value ? opt.active : opt.inactive
                    }`}
                  >
                    <opt.icon className="w-3.5 h-3.5" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Motivo / Razón{status === "sin_paciente" && <span className="text-red-400"> *</span>}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej: Curación post-operatoria, Reposición de stock..."
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
            </div>

            {/* Notas */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Notas (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones adicionales..."
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <p
                className={`text-xs rounded-lg px-3 py-2 ${
                  errorType === "equipo_no_consumible"
                    ? "text-orange-700 bg-orange-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {error}
              </p>
            )}
          </div>

          {/* Acciones */}
          <div className="flex gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || activeProducts.length === 0}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Guardando..." : "Registrar consumo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
