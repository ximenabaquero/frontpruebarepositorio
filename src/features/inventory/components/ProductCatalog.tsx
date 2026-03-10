"use client";

import { useState } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import type { InventoryCategory, InventoryProduct } from "../types";
import { deleteProduct } from "../services/inventoryService";
import ProductForm from "./ProductForm";

interface Props {
  products: InventoryProduct[];
  categories: InventoryCategory[];
  onRefresh: () => void;
}

function StockBadge({ stock }: { stock: number }) {
  if (stock < 5) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
        {stock} — Crítico
      </span>
    );
  }
  if (stock < 10) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
        {stock} — Bajo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      {stock} — OK
    </span>
  );
}

const COP = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default function ProductCatalog({ products, categories, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<InventoryProduct | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("active");

  const visible = products.filter((p) => {
    if (filterActive === "active") return p.active;
    if (filterActive === "inactive") return !p.active;
    return true;
  });

  async function handleDelete(product: InventoryProduct) {
    if (!confirm(`¿Eliminar "${product.name}"? Solo es posible si tiene 0 unidades en stock.`)) return;
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      onRefresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <CubeIcon className="w-5 h-5 text-indigo-500" />
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Catálogo de productos
          </h2>
          <span className="text-xs text-gray-400 font-normal">
            ({products.length} {products.length === 1 ? "producto" : "productos"})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value as "all" | "active" | "inactive")}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="active">Solo activos</option>
            <option value="inactive">Solo inactivos</option>
            <option value="all">Todos</option>
          </select>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Nuevo producto
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-gray-400">
          No hay productos en el catálogo.{" "}
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="text-indigo-600 hover:underline font-medium"
          >
            Agrega el primero
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-medium">Producto</th>
                <th className="px-5 py-3 text-left font-medium">Categoría</th>
                <th className="px-5 py-3 text-right font-medium">Precio unit.</th>
                <th className="px-5 py-3 text-center font-medium">Stock</th>
                <th className="px-5 py-3 text-center font-medium">Estado</th>
                <th className="px-5 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-gray-400 mt-0.5">{product.description}</div>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {product.category ? (
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: product.category.color }}
                      >
                        {product.category.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-700 font-medium">
                    {COP.format(product.unit_price)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <StockBadge stock={product.stock} />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        product.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditing(product); setShowForm(true); }}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        title="Editar"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        disabled={deletingId === product.id}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                        title="Eliminar (solo si stock = 0)"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductForm
          categories={categories}
          editing={editing}
          onClose={() => setShowForm(false)}
          onSaved={onRefresh}
        />
      )}
    </div>
  );
}
