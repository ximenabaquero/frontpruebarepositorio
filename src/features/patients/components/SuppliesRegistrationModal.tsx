"use client";

import { useState, useMemo } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import type { InventoryProduct } from "@/features/inventory/types";

type Props = {
  evaluationId: number;
  products: InventoryProduct[];
  onClose: () => void;
  onSaved: () => void;
};

type UsageItem = {
  product_id: number;
  quantity: number | "";
};

type UsageApiError = {
  message: string;
  error_code: "insufficient_stock" | "equipo_no_consumible";
  product_name?: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

export default function SuppliesRegistrationModal({ evaluationId, products, onClose, onSaved }: Props) {
  const activeProducts = products.filter((p) => p.active && p.stock > 0 && p.type === "insumo");

  const [items, setItems] = useState<UsageItem[]>(() =>
    activeProducts.map((p) => ({ product_id: p.id, quantity: "" }))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        item.product_id === productId
          ? { ...item, quantity: value === "" ? "" : Number(value) }
          : item
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const filledItems = items.filter(
      (item) => item.quantity !== "" && Number(item.quantity) > 0
    );

    if (filledItems.length === 0) {
      setError("Ingresa la cantidad de al menos un insumo.");
      return;
    }

    const payload = {
      items: filledItems as Array<{ product_id: number; quantity: number }>,
      status: "con_paciente",
      medical_evaluation_id: evaluationId,
      reason: notes.trim() || null,
    };

    setSaving(true);
    const token = Cookies.get("XSRF-TOKEN") ?? "";

    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/inventory/usages`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": token,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as Partial<UsageApiError>;
        if (errData.error_code === "insufficient_stock") {
          setError(
            errData.product_name
              ? `Stock insuficiente para "${errData.product_name}".`
              : errData.message || "Stock insuficiente para uno de los insumos."
          );
        } else {
          setError(errData.message || "Error al registrar consumo");
        }
        return;
      }

      toast.success("Insumos registrados correctamente");
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error de red");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-bold text-gray-800">Registrar insumos</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/80 transition"
            aria-label="Cerrar"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
          {/* Info banner */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <p className="font-medium">📋 Registro de consumo con paciente</p>
            <p className="text-xs mt-1">
              Selecciona los insumos utilizados en este procedimiento. El stock se descontará automáticamente.
            </p>
          </div>

          {/* Buscador */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar insumo
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca por nombre o categoría..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Lista de productos */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insumos disponibles ({filteredProducts.length})
            </label>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No se encontraron insumos" : "No hay insumos disponibles"}
              </div>
            )}

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredProducts.map((product) => {
                const item = items.find((i) => i.product_id === product.id);
                const qty = item?.quantity ?? "";

                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full font-medium">
                          {product.category?.name}
                        </span>
                        <span>Stock: {product.stock}</span>
                      </div>
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        min="0"
                        max={product.stock}
                        value={qty}
                        onChange={(e) => updateQuantity(product.id, e.target.value)}
                        placeholder="Cant."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notas opcionales */}
          <details className="mb-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600 transition">
              📝 Notas adicionales (opcional)
            </summary>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Observaciones sobre el consumo..."
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </details>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg"
          >
            {saving ? "Guardando..." : "Guardar consumo"}
          </button>
        </div>
      </div>
    </div>
  );
}
