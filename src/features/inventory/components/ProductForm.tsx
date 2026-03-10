"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { InventoryCategory, InventoryProduct, ProductFormValues } from "../types";
import { createProduct, updateProduct } from "../services/inventoryService";

interface Props {
  categories: InventoryCategory[];
  editing: InventoryProduct | null;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY: ProductFormValues = {
  category_id: "",
  name: "",
  description: "",
  unit_price: "",
  stock: "",
};

export default function ProductForm({ categories, editing, onClose, onSaved }: Props) {
  const [form, setForm] = useState<ProductFormValues>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) {
      setForm({
        category_id: editing.category_id,
        name: editing.name,
        description: editing.description ?? "",
        unit_price: editing.unit_price,
        stock: editing.stock,
      });
    } else {
      setForm(EMPTY);
    }
    setError("");
  }, [editing]);

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.category_id) { setError("Selecciona una categoría."); return; }
    if (!form.name.trim()) { setError("El nombre es requerido."); return; }
    if (form.unit_price === "" || Number(form.unit_price) < 0) { setError("El precio unitario debe ser ≥ 0."); return; }
    if (form.stock === "" || Number(form.stock) < 0) { setError("El stock inicial debe ser ≥ 0."); return; }

    setSaving(true);
    try {
      if (editing) {
        await updateProduct(editing.id, form);
      } else {
        await createProduct(form);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {editing ? "Editar producto" : "Nuevo producto"}
          </h2>
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
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category_id}
              onChange={(e) => set("category_id", e.target.value !== "" ? Number(e.target.value) : "")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="">Seleccionar...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              maxLength={200}
              placeholder="Ej: Lidocaína 2%"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="Opcional — presentación, concentración, etc."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio unitario <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.unit_price}
                onChange={(e) => set("unit_price", e.target.value !== "" ? Number(e.target.value) : "")}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock inicial <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={1}
                value={form.stock}
                onChange={(e) => set("stock", e.target.value !== "" ? Number(e.target.value) : "")}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
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
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
