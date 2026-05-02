"use client";

import { useState, useMemo, useEffect } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import CategorySelector from "../CategorySelector";
import CategoryManager from "../CategoryManager";
import InventorySearchBar from "../InventorySearchBar";
import PurchaseTable from "./PurchaseTable";
import type { InventoryPurchase, InventoryCategory } from "../../types";

interface PurchaseTabProps {
  purchases: InventoryPurchase[];
  categories: InventoryCategory[];
  loading: boolean;
  isAdmin: boolean;
  onOpenPurchase: () => void;
  onRefreshCategories: () => void;
  onRefreshProducts: () => void;
}

const ITEMS_PER_PAGE = 10;

const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function PurchaseTab({
  purchases,
  categories,
  loading,
  isAdmin,
  onOpenPurchase,
  onRefreshCategories,
  onRefreshProducts,
}: PurchaseTabProps) {
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const q = normalize(search);
    return purchases.filter((p) => {
      const matchCategory =
        activeCategoryId === null ||
        p.product?.category?.id === activeCategoryId;

      const matchSearch =
        !q ||
        normalize(p.product?.name ?? "").includes(q) ||
        normalize(p.user?.name ?? "").includes(q) ||
        normalize(p.distributor?.name ?? "").includes(q);

      return matchCategory && matchSearch;
    });
  }, [purchases, search, activeCategoryId]);

  // Vuelve a página 1 cada vez que cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategoryId]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedPurchases = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [filtered, currentPage],
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Fila 1: Categorías + botón */}
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
          onClick={onOpenPurchase}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shrink-0"
        >
          <ShoppingCartIcon className="w-4 h-4" />
          Registrar compra
        </button>
      </div>

      {/* Fila 2: Buscador */}
      <InventorySearchBar
        contexto="compras"
        value={search}
        onSearch={setSearch}
      />

      {/* Fila 3: Tabla + paginación */}
      <PurchaseTable
        purchases={paginatedPurchases}
        isAdmin={isAdmin}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onNext={() => setCurrentPage((p) => p + 1)}
        onPrev={() => setCurrentPage((p) => p - 1)}
      />
    </div>
  );
}
