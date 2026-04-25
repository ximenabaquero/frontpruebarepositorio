"use client";

import { useState, useMemo } from "react";
import {
  ArrowDownTrayIcon,
  ShoppingCartIcon,
  PlusIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import PageHeader from "./PageHeader";
import type { InventoryProduct, InventoryCategory } from "../types";
import { exportToCSV, exportToExcel } from "../utils/exportUtils";

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
      className="flex flex-col gap-2 p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 shadow-md hover:shadow-lg transition-all duration-200"
      style={{ borderLeftWidth: "4px", borderLeftColor: accent, borderColor: `${accent}30` }}
    >
      <div
        className="flex items-center gap-1.5 text-xs uppercase tracking-wide font-bold"
        style={{ color: accent }}
      >
        {icon} {label}
      </div>
      <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
        {value}
      </div>
      <div className="text-xs font-medium text-gray-600">{sub}</div>
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
  const [showExportMenu, setShowExportMenu] = useState(false);

  const insumos = products.filter((p) => p.type === "insumo");

  const stats = useMemo(() => {
    const critCount = insumos.filter((p) => getStockState(p) === "critico").length;
    const lowCount = insumos.filter((p) => getStockState(p) === "bajo").length;
    const okCount = insumos.filter((p) => getStockState(p) === "ok").length;
    const totalValue = insumos.reduce((acc, p) => {
      const price = p.unit_price && p.unit_price > 0 ? p.unit_price : 0;
      return acc + (p.stock * price);
    }, 0);
    
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

  const handleExportCSV = async () => {
    setShowExportMenu(false);
    const success = exportToCSV(filteredProducts, categories, "inventario_stock");
    if (success) {
      toast.success("CSV exportado correctamente");
    } else {
      toast.error("Error al exportar CSV");
    }
  };

  const handleExportExcel = async () => {
    setShowExportMenu(false);
    const loadingToast = toast.loading("Generando archivo Excel...");
    const success = await exportToExcel(filteredProducts, categories, "inventario_stock");
    toast.dismiss(loadingToast);
    if (success) {
      toast.success("Excel exportado correctamente");
    } else {
      toast.error("Error al exportar Excel. Verifica que la librería xlsx esté instalada.");
    }
  };

  const fmt = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  return (
    <>
      <PageHeader
        eyebrow="Vista general"
        title="Stock"
        subtitle="Qué tienes, qué falta, qué hay que reordenar."
        actions={[
          <div key="export" className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-50 border-2 border-teal-200 rounded-lg hover:bg-teal-100 hover:border-teal-300 transition-all shadow-sm hover:shadow-md"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Exportar
              <ChevronDownIcon className="w-3 h-3" />
            </button>
            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  <button
                    onClick={handleExportCSV}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 text-gray-400" />
                    <span>Exportar como CSV</span>
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 border-t border-gray-100"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 text-gray-400" />
                    <span>Exportar como Excel</span>
                  </button>
                </div>
              </>
            )}
          </div>,
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

      {/* Positive feedback message */}
      {stats.critCount === 0 && stats.lowCount === 0 && insumos.length > 0 && (
        <div className="mb-4 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-semibold text-emerald-800">
              ¡Excelente! Todos los productos tienen stock saludable.
            </p>
          </div>
        </div>
      )}

      {/* Warning message for critical items */}
      {stats.critCount > 0 && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-semibold text-red-800">
              Atención: {stats.critCount} {stats.critCount === 1 ? 'producto requiere' : 'productos requieren'} reabastecimiento urgente.
            </p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
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
        <div className="grid grid-cols-[2fr_140px_100px_80px_140px] gap-3 px-4 py-2.5 text-xs uppercase tracking-wide text-gray-500 font-semibold bg-gray-50 border-b border-gray-200">
          <div>Producto</div>
          <div>Categoría</div>
          <div className="text-right">Precio unit.</div>
          <div className="text-right">Stock</div>
          <div className="text-center">Estado</div>
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
                className="grid grid-cols-[2fr_140px_100px_80px_140px] gap-3 px-4 py-3 items-center border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {/* Product name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    title={meta.label}
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
                  {isEquipo ? (
                    <span className="px-2 py-0.5 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full border border-purple-300">
                      EQUIPO
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs font-semibold text-cyan-700 bg-cyan-50 rounded-full border border-cyan-200">
                      INSUMO
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
                  {product.unit_price && product.unit_price > 0 
                    ? fmt(product.unit_price) 
                    : <span className="text-gray-400">—</span>}
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
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
