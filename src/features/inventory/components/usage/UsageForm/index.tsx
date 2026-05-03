"use client";

import { useState, useMemo } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { createUsage } from "../../../services/inventoryService";
import ValidatedInput from "@/components/ValidatedInput";
import type {
  InventoryProduct,
  UsageItem,
  UsageApiError,
  UsageFormValues,
} from "../../../types";
import type { UsageFormProps } from "./types";

// ── Helpers ────────────────────────────────────────────────────────────────

function buildEmptyItems(products: InventoryProduct[]): UsageItem[] {
  return products
    .filter((p) => p.cantidad > 0)
    .map((p) => ({ product_id: p.id, quantity: "" }));
}

const TITLES: Record<string, string> = {
  con_paciente: "Registrar Consumo — Con Paciente",
  sin_paciente: "Registrar Consumo Sin Paciente",
};

// ── Componente ─────────────────────────────────────────────────────────────

export default function UsageForm({
  products,
  mode,
  medicalEvaluationId,
  onClose,
  onSaved,
}: UsageFormProps) {
  const activeProducts = useMemo(
    () => products.filter((p) => (p.type === "equipo" ? true : p.cantidad > 0)),
    [products],
  );

  const [items, setItems] = useState<UsageItem[]>(() =>
    buildEmptyItems(products),
  );
  const [reason, setReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<
    UsageApiError["error_code"] | null
  >(null);

  // ── Filtrado ─────────────────────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return activeProducts;
    const term = searchTerm.toLowerCase();
    return activeProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category?.name.toLowerCase().includes(term),
    );
  }, [activeProducts, searchTerm]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function updateQuantity(productId: number, value: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: value === "" ? "" : Number(value) }
          : item,
      ),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setErrorType(null);

    // ── Validaciones de negocio ────────────────────────────────────────────
    const filledItems = items.filter(
      (item) => item.quantity !== "" && Number(item.quantity) > 0,
    );

    if (filledItems.length === 0) {
      setSubmitError("Ingresa la cantidad de al menos un producto.");
      return;
    }

    if (mode === "sin_paciente" && !reason.trim()) {
      setSubmitError("El motivo del consumo es obligatorio.");
      return;
    }

    if (mode === "con_paciente" && !medicalEvaluationId) {
      setSubmitError("No se encontró el registro clínico asociado.");
      return;
    }

    // ── Payload ───────────────────────────────────────────────────────────
    const payload: UsageFormValues = {
      status: mode,
      items: filledItems as Array<{ product_id: number; quantity: number }>,
      reason: reason.trim(),
      medical_evaluation_id:
        mode === "con_paciente" ? (medicalEvaluationId ?? null) : null,
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
        setSubmitError(
          apiErr.product_name
            ? `Stock insuficiente para "${apiErr.product_name}".`
            : (apiErr.message ?? "Stock insuficiente."),
        );
      } else {
        setSubmitError(
          err instanceof Error ? err.message : "Error al registrar consumo",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  // Junto a los otros useMemo, antes del return:
  const totals = useMemo(() => {
    const filled = items.filter(
      (i) => i.quantity !== "" && Number(i.quantity) > 0,
    );
    return {
      productos: filled.length,
      unidades: filled.reduce((acc, i) => acc + Number(i.quantity), 0),
    };
  }, [items]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {TITLES[mode]}
            </h2>
            {mode === "con_paciente" && medicalEvaluationId && (
              <p className="text-xs text-gray-400 mt-0.5">
                Registro clínico #{medicalEvaluationId}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Banner: solo para sin_paciente */}
            {mode === "sin_paciente" && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <p className="font-medium">⚠️ Consumo sin paciente asociado</p>
                <p className="text-xs mt-1">
                  Para consumos no relacionados con un procedimiento clínico
                </p>
              </div>
            )}

            {/* Banner: para con_paciente */}
            {mode === "con_paciente" && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <p className="font-medium">🩺 Consumo clínico</p>
                <p className="text-xs mt-1">
                  Los productos seleccionados se descontarán del stock y
                  quedarán asociados al registro confirmado.
                </p>
              </div>
            )}

            {/* Lista de productos */}
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
                  placeholder="Buscar por nombre o categoría..."
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
                    const qty = String(item?.quantity ?? "");

                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col min-w-0">
                          {/* Fila Superior: Nombre y Badge de Tipo */}
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-bold text-gray-800 truncate">
                              {product.name}
                            </p>
                            <span
                              className={`shrink-0 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                product.type === "equipo"
                                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                                  : "bg-blue-100 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {product.type === "equipo" ? "Equipo" : "Insumo"}
                            </span>
                          </div>

                          {/* Fila Inferior: Stock y Categoría */}
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-gray-500">
                              <span className="text-gray-400">
                                {product.label_stock}:
                              </span>{" "}
                              {product.cantidad} und.
                            </p>

                            {product.category && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-[10px] font-medium text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">
                                  {product.category.name}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        {/* Input de cantidad con validación */}
                        <div className="w-24 ml-3 shrink-0">
                          <ValidatedInput
                            id={`qty-${product.id}`}
                            label=""
                            type="number"
                            min={0}
                            max={
                              product.type === "insumo"
                                ? product.cantidad
                                : undefined
                            }
                            value={qty}
                            placeholder="0"
                            onChange={(val) => updateQuantity(product.id, val)}
                            maxErrorMessage="Stock insuficiente."
                            clampToMin // ← bloquea negativos silenciosamente
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Resumen del Consumo */}
            {totals.productos > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-2.5 text-sm">
                <span className="text-indigo-700 font-medium">
                  Resumen del consumo
                </span>
                <div className="flex items-center gap-4 text-indigo-600">
                  <span>
                    <span className="font-semibold">{totals.productos}</span>{" "}
                    {totals.productos === 1 ? "producto" : "productos"}
                  </span>
                  <span className="text-indigo-300">·</span>
                  <span>
                    <span className="font-semibold">{totals.unidades}</span>{" "}
                    {totals.unidades === 1 ? "unidad" : "unidades"}
                  </span>
                </div>
              </div>
            )}

            {/* Motivo — obligatorio en sin_paciente, opcional en con_paciente */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Motivo del consumo{" "}
                {mode === "sin_paciente" ? (
                  <span className="text-red-400">*</span>
                ) : (
                  <span className="text-gray-400 font-normal">(opcional)</span>
                )}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  mode === "sin_paciente"
                    ? "Ej: Limpieza de equipos, prueba de producto, daño/vencimiento..."
                    : "Ej: Procedimiento de relleno facial, zona tratada, observaciones..."
                }
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                Máx. 300 caracteres · {reason.length}/300
              </p>
            </div>

            {/* Error de submit */}
            {submitError && (
              <p
                className={`text-xs rounded-lg px-3 py-2 ${
                  errorType === "insufficient_stock"
                    ? "text-orange-700 bg-orange-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {submitError}
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
