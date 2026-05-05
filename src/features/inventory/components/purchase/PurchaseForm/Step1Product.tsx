"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ValidatedInput from "@/components/ValidatedInput";
import type {
  InventoryCategory,
  InventoryProduct,
  PurchaseFormValues,
} from "../../../types";

interface Props {
  form: PurchaseFormValues;
  onChange: (patch: Partial<PurchaseFormValues>) => void;
  products: InventoryProduct[];
  categories: InventoryCategory[];
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function Step1Product({
  form,
  onChange,
  products,
  categories,
}: Props) {
  const [mode, setMode] = useState<"new" | "existing">(
    form.product_id ? "existing" : "new",
  );

  const selectedProduct = products.find((p) => p.id === form.product_id);
  const [productSearch, setProductSearch] = useState(
    selectedProduct?.name ?? "",
  );

  useEffect(() => {
    if (form.product_id) {
      const p = products.find((p) => p.id === form.product_id);
      if (p) setProductSearch(p.name);
    }
  }, [form.product_id, products]);

  // Muestra todos si no hay búsqueda, filtra si hay texto
  const filteredProducts = productSearch.trim()
    ? products.filter((p) =>
        normalize(p.name).includes(normalize(productSearch)),
      )
    : products;

  const handleModeChange = (m: "new" | "existing") => {
    setMode(m);
    if (m === "new") {
      onChange({ product_id: null });
      setProductSearch("");
    } else {
      onChange({
        name: "",
        category_id: "",
        type: "",
        description: "",
        stock_minimo: "",
      });
    }
  };

  const handleSelectProduct = (p: InventoryProduct) => {
    onChange({ product_id: p.id });
    setProductSearch(p.name);
  };

  const isNewInsumo = mode === "new" && form.type === "insumo";
  const showDropdown = !form.product_id; // siempre visible mientras no haya selección

  return (
    <div className="space-y-5">
      {/* Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        {(["new", "existing"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => handleModeChange(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === m
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m === "new" ? "Producto nuevo" : "Ya existe"}
          </button>
        ))}
      </div>

      {mode === "existing" ? (
        <div className="space-y-3">
          {/* Producto seleccionado */}
          {form.product_id ? (
            <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-indigo-800">
                  {productSearch}
                </p>
                <p className="text-xs text-indigo-500">
                  {selectedProduct?.category?.name} · {selectedProduct?.type}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onChange({ product_id: null });
                  setProductSearch("");
                }}
                className="text-xs text-indigo-400 hover:text-indigo-600 underline"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <>
              {/* Buscador */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    onChange({ product_id: null });
                  }}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              {/* Lista — siempre visible mientras no haya selección */}
              {showDropdown && (
                <div className="border border-gray-100 rounded-xl shadow-sm overflow-hidden max-h-52 overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400 italic">
                      Sin resultados para “{productSearch}”.
                    </p>
                  ) : (
                    filteredProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectProduct(p)}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-indigo-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {p.category?.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-3 shrink-0">
                          <span className="text-xs text-gray-500">
                            {p.label_stock}:{" "}
                            <span className="font-semibold">{p.cantidad}</span>
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              p.type === "insumo"
                                ? "bg-cyan-50 text-cyan-700"
                                : "bg-purple-50 text-purple-700"
                            }`}
                          >
                            {p.type}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <ValidatedInput
            id="p-name"
            label="Nombre del producto"
            placeholder="Ej: Guantes de nitrilo"
            maxLength={100}
            required
            value={form.name}
            onChange={(v) => onChange({ name: v })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category_id}
              onChange={(e) =>
                onChange({
                  category_id: e.target.value ? Number(e.target.value) : "",
                })
              }
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="">Seleccionar categoría...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {(["insumo", "equipo"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    onChange({
                      type: t,
                      stock_minimo: t === "equipo" ? "" : form.stock_minimo,
                    })
                  }
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                    form.type === t
                      ? t === "insumo"
                        ? "bg-cyan-50 border-cyan-400 text-cyan-700"
                        : "bg-purple-50 border-purple-400 text-purple-700"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {isNewInsumo && (
            <ValidatedInput
              id="p-stock-minimo"
              label="Stock mínimo"
              placeholder="Ej: 10"
              type="number"
              min={0}
              required
              value={form.stock_minimo}
              onChange={(v) =>
                onChange({ stock_minimo: v === "" ? "" : Number(v) })
              }
              clampToMin
            />
          )}

          <ValidatedInput
            id="p-description"
            label="Descripción"
            placeholder="Opcional..."
            maxLength={255}
            value={form.description}
            onChange={(v) => onChange({ description: v })}
          />
        </div>
      )}
    </div>
  );
}
