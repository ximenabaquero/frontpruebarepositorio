"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { createPurchase, getDistributors, getLastPurchase } from "../services/inventoryService";
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
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingLastPurchase, setLoadingLastPurchase] = useState(false);
  const [priceMode, setPriceMode] = useState<"unit" | "total">("unit");
  const [totalPrice, setTotalPrice] = useState("");

  useEffect(() => {
    getDistributors().then(setDistributors).catch(() => setDistributors([]));
  }, []);

  const calculatedValue =
    priceMode === "unit"
      ? form.quantity !== "" && form.unit_price !== ""
        ? (Number(form.quantity) * Number(form.unit_price)).toLocaleString("es-CO")
        : "—"
      : totalPrice !== "" && form.quantity !== "" && Number(form.quantity) > 0
        ? (Number(totalPrice) / Number(form.quantity)).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : "—";

  const calculatedLabel = priceMode === "unit" ? "Total" : "Precio unitario";

  async function handleProductSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (val === "") {
      setForm((prev) => ({ ...prev, product_id: null, unit_price: "", distributor_id: null }));
      return;
    }

    const productId = Number(val);
    setForm((prev) => ({ ...prev, product_id: productId }));

    // Auto-completar precio y distribuidor de la última compra
    setLoadingLastPurchase(true);
    try {
      const lastPurchase = await getLastPurchase(productId);
      if (lastPurchase) {
        setForm((prev) => ({
          ...prev,
          unit_price: lastPurchase.unit_price,
          distributor_id: lastPurchase.distributor_id,
        }));
      }
    } catch (err) {
      console.error("Error loading last purchase:", err);
    } finally {
      setLoadingLastPurchase(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    
    if (priceMode === "unit") {
      setForm((prev) => ({ ...prev, unit_price: value === "" ? "" : Number(value) }));
      // Calcular total automáticamente
      if (value && form.quantity) {
        const calculatedTotal = Number(value) * Number(form.quantity);
        setTotalPrice(calculatedTotal.toString());
      } else {
        setTotalPrice("");
      }
    } else {
      // Modo total: calcular precio unitario
      setTotalPrice(value);
      if (value && form.quantity && Number(form.quantity) > 0) {
        const calculatedUnit = Number(value) / Number(form.quantity);
        setForm((prev) => ({ ...prev, unit_price: calculatedUnit }));
      }
    }
  }

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, quantity: value === "" ? "" : Number(value) }));

    // Recalcular según el modo
    if (priceMode === "unit" && form.unit_price && value) {
      const calculatedTotal = Number(form.unit_price) * Number(value);
      setTotalPrice(calculatedTotal.toString());
    } else if (priceMode === "total" && totalPrice && value && Number(value) > 0) {
      const calculatedUnit = Number(totalPrice) / Number(value);
      setForm((prev) => ({ ...prev, unit_price: calculatedUnit }));
    }
  }

  function togglePriceMode() {
    const newMode = priceMode === "unit" ? "total" : "unit";
    setPriceMode(newMode);
    
    // Sincronizar valores al cambiar de modo
    if (newMode === "total" && form.quantity && form.unit_price) {
      const calculatedTotal = Number(form.quantity) * Number(form.unit_price);
      setTotalPrice(calculatedTotal.toString());
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.product_id) {
      setError("Selecciona un producto.");
      return;
    }
    if (!form.quantity || Number(form.quantity) <= 0) {
      setError("Ingresa una cantidad válida.");
      return;
    }
    if (!form.unit_price || Number(form.unit_price) <= 0) {
      setError("Ingresa un precio válido.");
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

          {/* Selector de producto */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1.5">
              Producto <span className="text-rose-400">*</span>
              <SparklesIcon 
                className="w-3.5 h-3.5 text-indigo-500" 
                title="Autocompletamos precio y distribuidor de tu última compra"
              />
            </label>
            <select
              value={form.product_id ?? ""}
              onChange={handleProductSelect}
              required
              disabled={loadingLastPurchase}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-wait"
            >
              <option value="">Selecciona un producto...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — Stock: {p.stock}
                </option>
              ))}
            </select>
            {loadingLastPurchase && (
              <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                <SparklesIcon className="w-3 h-3 animate-pulse" />
                Autocompletando precio y distribuidor...
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              ¿No encuentras el producto? Agrégalo desde la sección <span className="font-medium">Catálogo</span>
            </p>
          </div>

          {/* Cantidad y precio */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Cantidad <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                value={form.quantity}
                onChange={handleQuantityChange}
                required
                min={1}
                placeholder="0"
                autoFocus
                className="w-full rounded-lg border-2 border-indigo-200 px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  {priceMode === "unit" ? "Precio unitario" : "Precio total"} (COP)
                  <span className="text-rose-400">*</span>
                  {form.product_id && form.unit_price !== "" && priceMode === "unit" && (
                    <SparklesIcon className="w-3 h-3 text-indigo-500" title="Autocompletado de última compra" />
                  )}
                </label>
                <button
                  type="button"
                  onClick={togglePriceMode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors border border-indigo-300"
                  title={priceMode === "unit" ? "Cambiar a modo precio total" : "Cambiar a modo precio unitario"}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h8M8 4l4 4-4 4M8 4v8" />
                  </svg>
                  {priceMode === "unit" ? "Total" : "Unitario"}
                </button>
              </div>
              <input
                type="number"
                value={priceMode === "unit" ? form.unit_price : totalPrice}
                onChange={handlePriceChange}
                required
                min={0}
                step="0.01"
                placeholder="0"
                className="w-full rounded-lg border-2 border-indigo-200 px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Total calculado - Más prominente */}
          <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-indigo-700 font-semibold">{calculatedLabel}</span>
            <span className="text-xl font-extrabold text-indigo-900">
              {calculatedValue !== "—" ? `$${calculatedValue}` : "—"}
            </span>
          </div>

          {/* Distribuidor - Colapsable/Secundario */}
          {distributors.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1">
                <span className="group-open:rotate-90 transition-transform">▶</span>
                Detalles adicionales (opcional)
              </summary>
              <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Distribuidor
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

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Notas
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
              </div>
            </details>
          )}

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
