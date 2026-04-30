"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { createProduct } from "../services/inventoryService";
import type { InventoryCategory } from "../types";

type Props = {
  categories: InventoryCategory[];
  onClose: () => void;
  onSaved: () => void;
};

type ProductFormData = {
  name: string;
  category_id: string;
  type: "insumo" | "equipo" | "";
  description: string;
};

const EMPTY: ProductFormData = {
  name: "",
  category_id: "",
  type: "",
  description: "",
};

export default function ProductForm({ categories, onClose, onSaved }: Props) {
  const [form, setForm] = useState<ProductFormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("El nombre del producto es obligatorio.");
      return;
    }
    if (!form.category_id) {
      setError("Selecciona una categoría.");
      return;
    }
    if (!form.type) {
      setError("Selecciona el tipo de producto.");
      return;
    }

    setSaving(true);
    try {
      await createProduct({
        name: form.name.trim(),
        category_id: Number(form.category_id),
        type: form.type as "insumo" | "equipo",
        description: form.description.trim(),
      });
      toast.success("Producto creado correctamente");
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear producto");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Agregar producto nuevo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nombre del producto <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="Ej: Fajas Stage 2 talla M, Lidocaína..."
              autoFocus
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                <option value="">Seleccionar...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Tipo <span className="text-rose-400">*</span>
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Seleccionar...</option>
                <option value="insumo">Insumo</option>
                <option value="equipo">Equipo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={255}
              rows={2}
              placeholder="Descripción breve del producto..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <p className="text-xs text-blue-700">
              <strong>Nota:</strong> El producto se creará con stock inicial de 0. 
              Después puedes registrar la primera compra desde &quot;Registrar compra&quot;.
            </p>
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

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
              {saving ? "Creando..." : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
