"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { createPurchase, getDistributors } from "../services/inventoryService";
import type {
  InventoryCategory,
  InventoryProduct,
  Distributor,
  PurchaseFormValues,
} from "../types";

type Props = {
  categories: InventoryCategory[];
  products: InventoryProduct[];
  onClose: () => void;
  onSaved: () => void;
};

const EMPTY: PurchaseFormValues = {
  product_id: null,
  name: "",
  category_id: "",
  type: "",
  description: "",
  distributor_id: null,
  quantity: "",
  unit_price: "",
  notes: "",
};

export default function PurchaseForm({ categories, products, onClose, onSaved }: Props) {
  const [form, setForm] = useState<PurchaseFormValues>(EMPTY);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDistributors().then(setDistributors).catch(() => setDistributors([]));
  }, []);

  const total =
    form.quantity !== "" && form.unit_price !== ""
      ? (Number(form.quantity) * Number(form.unit_price)).toLocaleString("es-CO")
      : "—";

  function handleProductSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (val === "") {
      setForm((prev) => ({ ...prev, product_id: null }));
    } else {
      setForm((prev) => ({ ...prev, product_id: Number(val) }));
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleNewProduct(val: boolean) {
    setIsNewProduct(val);
    setForm((prev) => ({
      ...prev,
      product_id: val ? null : prev.product_id,
      name: "",
      category_id: "",
      type: "",
      description: "",
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isNewProduct && !form.product_id) {
      setError("Selecciona un producto existente o crea uno nuevo.");
      return;
    }
    if (isNewProduct && !form.name.trim()) {
      setError("El nombre del producto es requerido.");
      return;
    }
    if (isNewProduct && !form.category_id) {
      setError("La categoría es requerida para el nuevo producto.");
      return;
    }
    if (isNewProduct && !form.type) {
      setError("El tipo de producto es requerido.");
      return;
    }

    setSaving(true);
    try {
      await createPurchase(form);
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Registrar compra</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">

          {/* Toggle: producto existente vs nuevo */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm font-medium">
            <button
              type="button"
              onClick={() => toggleNewProduct(false)}
              className={`flex-1 py-2 transition-colors ${!isNewProduct ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              Producto existente
            </button>
            <button
              type="button"
              onClick={() => toggleNewProduct(true)}
              className={`flex-1 py-2 transition-colors ${isNewProduct ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              Nuevo producto
            </button>
          </div>

          {/* Selector de producto existente */}
          {!isNewProduct && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Producto <span className="text-rose-400">*</span>
              </label>
              <select
                value={form.product_id ?? ""}
                onChange={handleProductSelect}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Selecciona un producto...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.category ? `(${p.category.name})` : ""} — Stock: {p.stock}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Campos para nuevo producto */}
          {isNewProduct && (
            <>
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
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={255}
                  placeholder="Descripción breve del producto..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </>
          )}

          {/* Distribuidor */}
          {distributors.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Distribuidor (opcional)
              </label>
              <select
                name="distributor_id"
                value={form.distributor_id ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    distributor_id: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Sin distribuidor</option>
                {distributors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          )}

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
            <span className="text-xs text-gray-500 font-medium">Total estimado</span>
            <span className="text-sm font-bold text-gray-800">
              {total !== "—" ? `$${total}` : "—"}
            </span>
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
              maxLength={500}
              placeholder="Observaciones adicionales..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
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
              {saving ? "Guardando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
