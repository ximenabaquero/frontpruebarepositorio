"use client";

import { useState, useMemo } from "react";
import {
  ArrowDownTrayIcon,
  ShoppingCartIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import PageHeader from "./PageHeader";
import type { InventoryProduct, InventoryCategory } from "../types";

interface StockTabProps {
  products: InventoryProduct[];
  categories: InventoryCategory[];
  onOpenPurchase: (product?: InventoryProduct) => void;
  onOpenConsume: (product?: InventoryProduct) => void;
  isAdmin: boolean;
}

interface BigStatProps {
  label: string;
  value: string | number;
  accent: string;
  icon: React.ReactNode;
  sub: string;
}

function BigStat({ label, value, accent, icon, sub }: BigStatProps) {
  return (
    <div
      className="flex flex-col gap-1.5 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
      style={{ borderLeftWidth: "3px", borderLeftColor: accent }}
    >
      <div
        className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wide font-semibold"
        style={{ color: accent }}
      >
        {icon} {label}
      </div>
      <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">
        {value}
      </div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  );
}

function getStockState(product: InventoryProduct): "critico" | "bajo" | "ok" | "equipo" {
  if (product.type === "equipo") return "equipo";
  if (product.stock === 0) return "critico";
  if (product.stock < 5) return "critico";
  if (product.stock < 10) return "bajo";
  return "ok";
}

const STATE_META = {
  critico: { label: "Crítico", color: "#DC2626" },
  bajo: { label: "Bajo", color: "#D97706" },
  ok: { label: "OK", color: "#059669" },
  equipo: { label: "Equipo", color: "#6B7280" },
};

export default function StockTab({
  products,
  categories,
  onOpenPurchase,
  onOpenConsume,
  isAdmin,
}: StockTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("todas");
  const [stateFilter, setStateFilter] = useState<string>("todas");

  const insumos = products.filter((p) => p.type === "insumo");

  const stats = useMemo(() => {
    const critCount = insumos.filter((p) => getStockState(p) === "critico").length;
    const lowCount = insumos.filter((p) => getStockState(p) === "bajo").length;
    const okCount = insumos.filter((p) => getStockState(p) === "ok").length;
    const totalValue = insumos.reduce((acc, p) => acc + p.stock * p.unit_price, 0);
    
    return { critCount, lowCount, okCount, totalValue };
  }, [insumos]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => categoryFilter === "todas" || p.category_id === Number(categoryFilter))
      .filter(
        (p) =>
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((p) => stateFilter === "todas" || getStockState(p) === stateFilter)
      .sort((a, b) => {
        const order = { critico: 0, bajo: 1, ok: 2, equipo: 3 };
        return order[getStockState(a)] - order[getStockState(b)];
      });
  }, [products, categoryFilter, searchQuery, stateFilter]);

  const fmt = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  return (
    <>
      <PageHeader
        eyebrow="Vista general"
        title="Stock"
        subtitle="Qué tienes, qué falta, qué hay que reordenar."
        actions={[
          <button
            key="export"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Exportar CSV
          </button>,
          <button
            key="purchase"
            onClick={() => onOpenPurchase()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            Registrar compra
          </button>,
          <button
            key="consume"
            onClick={() => onOpenConsume()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Registrar consumo
          </button>,
        ]}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <BigStat
          label="Valor de stock (insumos)"
          value={fmt(stats.totalValue)}
          accent="#0EB5A3"
          icon={null}
          sub={`${insumos.length} insumos`}
        />
        <BigStat
          label="Críticos"
          value={stats.critCount}
          accent="#DC2626"
          icon={null}
          sub="requieren orden urgente"
        />
        <BigStat
          label="Bajos"
          value={stats.lowCount}
          accent="#D97706"
          icon={null}
          sub="bajo el mínimo"
        />
        <BigStat
          label="OK"
          value={stats.okCount}
          accent="#059669"
          icon={null}
          sub="stock saludable"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2.5 p-3.5 bg-white border border-gray-200 rounded-lg mb-3">
        <input
          type="text"
          placeholder="Buscar por nombre…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="todas">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="todas">Todos los estados</option>
          <option value="critico">Crítico</option>
          <option value="bajo">Bajo</option>
          <option value="ok">OK</option>
          <option value="equipo">Equipo</option>
        </select>
        <span className="text-sm text-gray-500 ml-auto">
          {filteredProducts.length} productos
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_140px_100px_80px_140px_100px] gap-3 px-4 py-2.5 text-xs uppercase tracking-wide text-gray-500 font-semibold bg-gray-50 border-b border-gray-200">
          <div>Producto</div>
          <div>Categoría</div>
          <div className="text-right">Precio unit.</div>
          <div className="text-right">Stock</div>
          <div className="text-center">Estado</div>
          <div className="text-right">Acciones</div>
        </div>

        {/* Table Body */}
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No se encontraron productos
          </div>
        ) : (
          filteredProducts.map((product) => {
            const state = getStockState(product);
            const meta = STATE_META[state];
            const isEquipo = product.type === "equipo";
            const category = categories.find((c) => c.id === product.category_id);

            return (
              <div
                key={product.id}
                className="grid grid-cols-[2fr_140px_100px_80px_140px_100px] gap-3 px-4 py-3 items-center border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {/* Product name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        state === "ok" || state === "equipo"
                          ? "transparent"
                          : meta.color,
                      border:
                        state === "ok" || state === "equipo"
                          ? `1.5px solid ${meta.color}`
                          : "none",
                    }}
                  />
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </span>
                  {isEquipo && (
                    <span className="px-2 py-0.5 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full border border-purple-300">
                      EQUIPO
                    </span>
                  )}
                </div>

                {/* Category */}
                <div>
                  {category && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                      {category.name}
                    </span>
                  )}
                </div>

                {/* Unit price */}
                <div className="text-right font-mono text-sm text-gray-900">
                  {fmt(product.unit_price)}
                </div>

                {/* Stock */}
                <div
                  className="text-right font-mono text-sm font-bold"
                  style={{ color: isEquipo ? "#9CA3AF" : meta.color }}
                >
                  {isEquipo ? "—" : product.stock}
                </div>

                {/* State */}
                <div className="text-center">
                  <span
                    className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full"
                    style={{
                      backgroundColor: `${meta.color}15`,
                      color: meta.color,
                    }}
                  >
                    {meta.label}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-1">
                  {!isEquipo && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenConsume(product);
                      }}
                      title="Consumir"
                      className="w-7 h-7 rounded-md border border-gray-300 bg-white flex items-center justify-center text-gray-500 hover:border-teal-500 hover:text-teal-600 transition-colors"
                    >
                      <span className="text-xs">−</span>
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPurchase(product);
                    }}
                    title={isEquipo ? "Comprar equipo" : "Comprar"}
                    className="w-7 h-7 rounded-md border border-gray-300 bg-white flex items-center justify-center text-gray-500 hover:border-teal-500 hover:text-teal-600 transition-colors"
                  >
                    <span className="text-xs">+</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
