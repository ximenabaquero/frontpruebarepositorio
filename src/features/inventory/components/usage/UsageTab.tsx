"use client";

import { useState, useMemo } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import CategorySelector from "../CategorySelector";
import CategoryManager from "../CategoryManager";
import InventorySearchBar from "../InventorySearchBar";
import UsageTable from "./UsageTable";
import type { InventoryUsage, InventoryCategory } from "../../types";

interface UsageTabProps {
  usages: InventoryUsage[];
  categories: InventoryCategory[];
  loading: boolean;
  isAdmin: boolean;
  onOpenConsume: () => void;
  onRefreshCategories: () => void;
  onRefreshProducts: () => void;
}

const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function UsageTab({
  usages,
  categories,
  loading,
  isAdmin,
  onOpenConsume,
  onRefreshCategories,
  onRefreshProducts,
}: UsageTabProps) {
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = normalize(search);
    return usages.filter((u) => {
      const matchCategory =
        activeCategoryId === null ||
        u.product?.category?.id === activeCategoryId;

      const matchSearch =
        !q ||
        normalize(u.product?.name ?? "").includes(q) ||
        normalize(u.user?.name ?? "").includes(q) ||
        normalize(u.reason ?? "").includes(q);

      return matchCategory && matchSearch;
    });
  }, [usages, search, activeCategoryId]);

  return (
    <div className="flex flex-col gap-5">
      {/* Fila 1: Categorías + Gestionar + Registrar */}
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

        <button
          onClick={onOpenConsume}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shrink-0"
        >
          <PlusIcon className="w-4 h-4" />
          Registrar consumo
        </button>
      </div>

      {/* Fila 2: Buscador */}
      <InventorySearchBar
        contexto="consumos"
        value={search}
        onSearch={setSearch}
      />

      {/* Fila 3: Tabla */}
      <UsageTable usages={filtered} loading={loading} />
    </div>
  );
}
