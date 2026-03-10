"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { createPurchase, updatePurchase } from "../services/inventoryService";
import type {
  InventoryCategory,
  InventoryPurchase,
  PurchaseFormValues,
} from "../types";

type Props = {
  categories: InventoryCategory[];
  editing?: InventoryPurchase | null;
  onClose: () => void;
  onSaved: () => void;
};

const EMPTY: PurchaseFormValues = {
  category_id: "",
  product_id: null,
  item_name: "",
  quantity: "",
  unit_price: "",
  purchase_date: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function PurchaseForm({ categories, editing, onClose, onSaved }: Props) {
  const [form, setForm] = useState<PurchaseFormValues>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      setForm({
        category_id: editing.category_id,
        product_id: null,
        item_name: editing.item_name,
        quantity: editing.quantity,
        unit_price: editing.unit_price,
        purchase_date: editing.purchase_date.slice(0, 10),
        notes: editing.notes ?? "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [editing]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const total =
    form.quantity !== "" && form.unit_price !== ""
      ? (Number(form.quantity) * Number(form.unit_price)).toLocaleString("es-CO")
      : "—";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.category_id) { setError("Selecciona una categoría."); return; }
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await updatePurchase(editing.id, form);
      } else {
        await createPurchase(form);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">
            {editing ? "Editar compra" : "Registrar compra"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Categoría */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Categoría <span className="text-rose-400">*</span>
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Selecciona una categoría...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre del ítem */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Descripción / Producto <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              required
              maxLength={200}
              placeholder="Ej: Fajas Stage 2 talla M, Anestesia lidocaína..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Cantidad y precio */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Cantidad <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
                min={1}
                placeholder="0"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Precio unitario (COP) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="unit_price"
                value={form.unit_price}
                onChange={handleChange}
                required
                min={0}
                step="0.01"
                placeholder="0"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Total calculado */}
          <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium">Total calculado</span>
            <span className="text-sm font-bold text-gray-800">
              {total !== "—" ? `$${total}` : "—"}
            </span>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Fecha de compra <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              name="purchase_date"
              value={form.purchase_date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Notas (opcional)
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              maxLength={1000}
              placeholder="Proveedor, observaciones..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Guardando..." : editing ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
