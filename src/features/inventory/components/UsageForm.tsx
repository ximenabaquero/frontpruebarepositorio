"use client";

import { useState, useMemo } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<UsageApiError["error_code"] | null>(null);

  // Filtrar productos según búsqueda
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return activeProducts;
    const term = searchTerm.toLowerCase();
    return activeProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category?.name.toLowerCase().includes(term)
    );
  }, [activeProducts, searchTerm]);

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

    if (!reason.trim()) {
      setError("El motivo del consumo es obligatorio.");
      return;
    }

    const payload: UsageFormValues = {
      items: filledItems as Array<{ product_id: number; quantity: number }>,
      status: "sin_paciente",
      reason: reason.trim(),
      medical_evaluation_id: null,
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
          <h2 className="text-base font-semibold text-gray-900">Registrar Consumo Sin Paciente</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Info banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <p className="font-medium">⚠️ Consumo sin paciente asociado</p>
              <p className="text-xs mt-1">
                Este registro es para consumos que NO están relacionados con un procedimiento clínico (ej: limpieza, pruebas, mermas, etc).
              </p>
            </div>

            {/* Lista de productos con buscador */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Productos consumidos <span className="text-red-400">*</span>
              </label>
              
              {/* Buscador */}
              <div className="relative mb-2">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar producto por nombre o categoría..."
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {activeProducts.length === 0 ? (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                  No hay productos activos con stock disponible.
                </p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  No se encontraron productos con "{searchTerm}".
                </p>
              ) : (
                <div className="max-h-[240px] overflow-y-auto rounded-xl border border-gray-200 divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
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
                              <span className="ml-2 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-700">
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

            {/* Detalles adicionales - Colapsable */}
            {/* Motivo - OBLIGATORIO */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Motivo del consumo <span className="text-red-400">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej: Limpieza de equipos, Prueba de producto, Daño/vencimiento, Mantenimiento..."
                rows={2}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Explica brevemente por qué se consumieron estos productos sin estar asociados a un paciente.
              </p>
            </div>

            {/* Notas opcionales */}
            <details className="group">
              <summary className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1">
                <span className="group-open:rotate-90 transition-transform">▶</span>
                Notas adicionales (opcional)
              </summary>
              <div className="mt-3 pl-4 border-l-2 border-gray-200">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observaciones adicionales..."
                  rows={2}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                />
              </div>
            </details>

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
