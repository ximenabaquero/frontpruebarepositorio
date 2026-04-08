"use client";

import { useState } from "react";
import { XMarkIcon, UserIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { createUsage } from "../services/inventoryService";
import type { InventoryProduct, UsageFormValues } from "../types";

type Props = {
  products: InventoryProduct[];
  onClose: () => void;
  onSaved: () => void;
};

const EMPTY: UsageFormValues = {
  product_id: "",
  quantity: "",
  usage_date: new Date().toISOString().split("T")[0],
  status: "",
  reason: "",
  medical_evaluation_id: null,
  notes: "",
};

export default function UsageForm({ products, onClose, onSaved }: Props) {
  const [values, setValues] = useState<UsageFormValues>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeProducts = products.filter((p) => p.active && p.stock > 0);
  const selectedProduct = activeProducts.find((p) => p.id === values.product_id);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!values.product_id) return setError("Selecciona un producto.");
    if (!values.quantity || Number(values.quantity) < 1)
      return setError("La cantidad debe ser al menos 1.");

    if (
      selectedProduct &&
      Number(values.quantity) > selectedProduct.stock
    ) {
      return setError(
        `Stock insuficiente. Disponible: ${selectedProduct.stock} und.`,
      );
    }

    setSaving(true);
    try {
      await createUsage(values);
      toast.success("Consumo registrado correctamente");
      onSaved();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al registrar consumo");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">
            Registrar Consumo
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Producto */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Producto <span className="text-red-400">*</span>
            </label>
            <select
              name="product_id"
              value={values.product_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">— Seleccionar producto —</option>
              {activeProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — Stock: {p.stock}
                </option>
              ))}
            </select>
            {activeProducts.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">
                No hay productos activos con stock disponible.
              </p>
            )}
          </div>

          {/* Cantidad + Fecha */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Cantidad <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                min={1}
                max={selectedProduct?.stock ?? undefined}
                value={values.quantity}
                onChange={handleChange}
                placeholder="1"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Fecha <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="usage_date"
                value={values.usage_date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
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
                    setValues((prev) => ({
                      ...prev,
                      status: prev.status === opt.value ? "" : (opt.value as UsageFormValues["status"]),
                    }))
                  }
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                    values.status === opt.value ? opt.active : opt.inactive
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
              Motivo / Razón
            </label>
            <textarea
              name="reason"
              value={values.reason}
              onChange={handleChange}
              placeholder="Ej: Curación post-operatoria, Reposición de stock..."
              rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Acciones */}
          <div className="flex gap-2 pt-1">
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
