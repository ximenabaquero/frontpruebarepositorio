"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { InventoryProduct, UsageFormValues } from "../types";
import { createUsage } from "../services/inventoryService";

interface Props {
  products: InventoryProduct[];
  onClose: () => void;
  onSaved: () => void;
}

const today = () => new Date().toISOString().split("T")[0];

const EMPTY: UsageFormValues = {
  product_id: "",
  quantity: "",
  usage_date: today(),
  notes: "",
};

const COP = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default function UsageForm({ products, onClose, onSaved }: Props) {
  const [form, setForm] = useState<UsageFormValues>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const activeProducts = products.filter((p) => p.active);
  const selectedProduct = activeProducts.find((p) => p.id === form.product_id) ?? null;

  useEffect(() => {
    setForm({ ...EMPTY, usage_date: today() });
    setError("");
  }, []);

  function set<K extends keyof UsageFormValues>(key: K, value: UsageFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.product_id) { setError("Selecciona un producto."); return; }
    if (!form.quantity || Number(form.quantity) < 1) { setError("La cantidad debe ser al menos 1."); return; }
    if (selectedProduct && Number(form.quantity) > selectedProduct.stock) {
      setError(`Stock insuficiente. Disponible: ${selectedProduct.stock} unidades.`);
      return;
    }

    setSaving(true);
    try {
      await createUsage(form);
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrar consumo");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Registrar consumo</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producto <span className="text-red-500">*</span>
            </label>
            <select
              value={form.product_id}
              onChange={(e) => {
                set("product_id", e.target.value !== "" ? Number(e.target.value) : "");
                set("quantity", "");
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="">Seleccionar producto...</option>
              {activeProducts.map((p) => (
                <option key={p.id} value={p.id} disabled={p.stock === 0}>
                  {p.name}{p.category ? ` (${p.category.name})` : ""} — Stock: {p.stock}
                  {p.stock === 0 ? " [Sin stock]" : ""}
                </option>
              ))}
            </select>
            {selectedProduct && (
              <p className="mt-1.5 text-xs text-gray-500">
                Precio unit.: <span className="font-medium">{COP.format(selectedProduct.unit_price)}</span>
                {" · "}
                Stock disponible:{" "}
                <span className={`font-medium ${selectedProduct.stock < 5 ? "text-red-600" : selectedProduct.stock < 10 ? "text-amber-600" : "text-emerald-600"}`}>
                  {selectedProduct.stock} unidades
                </span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={selectedProduct?.stock ?? undefined}
              step={1}
              value={form.quantity}
              onChange={(e) => set("quantity", e.target.value !== "" ? Number(e.target.value) : "")}
              placeholder="Ej: 2"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.usage_date}
              onChange={(e) => set("usage_date", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              maxLength={1000}
              rows={2}
              placeholder="Opcional — motivo, paciente, procedimiento, etc."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !selectedProduct || selectedProduct.stock === 0}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Registrando..." : "Registrar consumo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
