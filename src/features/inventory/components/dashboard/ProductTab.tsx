"use client";

import { useState, useMemo } from "react";
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import CategorySelector from "../CategorySelector";
import CategoryManager from "../CategoryManager";
import InventorySearchBar from "../InventorySearchBar";
import ProductTable from "./ProductTable";
import type { InventoryProduct, InventoryCategory } from "../../types";
import { exportToCSV, exportToExcel } from "../../utils/exportUtils";
import ExportDropdown from "@/components/ExportDropdown";

const InsumoIcon = (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    />
  </svg>
);

const EquipoIcon = (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
    />
  </svg>
);

interface ProductTabProps {
  products: InventoryProduct[];
  categories: InventoryCategory[];
  onRefreshCategories: () => void;
  onRefreshProducts?: () => void;
  isAdmin: boolean;
}

const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function ProductTab({
  products,
  categories,
  onRefreshCategories,
  onRefreshProducts,
  isAdmin,
}: ProductTabProps) {
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filtered = useMemo(() => {
    const q = normalize(search);
    return products.filter((p) => {
      const matchSearch = !q || normalize(p.name).includes(q);
      const matchCategory =
        activeCategoryId === null || p.category_id === activeCategoryId;
      return matchSearch && matchCategory;
    });
  }, [products, search, activeCategoryId]);

  const insumos = useMemo(
    () => filtered.filter((p) => p.type === "insumo"),
    [filtered],
  );
  const equipos = useMemo(
    () => filtered.filter((p) => p.type === "equipo"),
    [filtered],
  );

  const handleExportCSV = () => {
    setShowExportMenu(false);
    const ok = exportToCSV(filtered, categories, "inventario_productos");
    toast[ok ? "success" : "error"](
      ok ? "CSV exportado" : "Error al exportar CSV",
    );
  };

  const handleExportExcel = async () => {
    setShowExportMenu(false);
    const loading = toast.loading("Generando Excel…");
    const ok = await exportToExcel(
      filtered,
      categories,
      "inventario_productos",
    );
    toast.dismiss(loading);
    toast[ok ? "success" : "error"](
      ok ? "Excel exportado" : "Error al exportar Excel",
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Fila 1: Categorías + ícono gestionar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <CategorySelector
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />
        </div>

        {isAdmin && (
          <CategoryManager
            categories={categories}
            onRefresh={onRefreshCategories}
            onRefreshProducts={onRefreshProducts}
          />
        )}
      </div>

      {/* Fila 2: Buscador + Export */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <InventorySearchBar
            contexto="dashboard"
            value={search}
            onSearch={setSearch}
          />
        </div>
        {/* Export */}
        <ExportDropdown
          items={[
            { label: "Exportar como CSV", onClick: handleExportCSV },
            { label: "Exportar como Excel", onClick: handleExportExcel },
          ]}
        />
      </div>

      {/* Fila 3: Tablas */}
      <ProductTable
        products={insumos}
        title="Insumos Médicos"
        icon={InsumoIcon}
        type="insumo"
      />
      <ProductTable
        products={equipos}
        title="Equipos & Mobiliario"
        icon={EquipoIcon}
        type="equipo"
      />
    </div>
  );
}
