"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "./PageHeader";
import CategoryManager from "./CategoryManager";
import ProductCatalog from "./ProductCatalog";
import type { InventoryProduct, InventoryCategory } from "../types";

interface CatalogoTabProps {
  products: InventoryProduct[];
  categories: InventoryCategory[];
  isAdmin: boolean;
  onRefreshCategories: () => void;
  onRefreshProducts: () => void;
}

export default function CatalogoTab({
  products,
  categories,
  isAdmin,
  onRefreshCategories,
  onRefreshProducts,
}: CatalogoTabProps) {
  return (
    <>
      <PageHeader
        eyebrow="Configuración"
        title="Catálogo"
        subtitle="Productos y categorías disponibles."
        actions={
          isAdmin
            ? [
                <CategoryManager
                  key="cat"
                  categories={categories}
                  onRefresh={onRefreshCategories}
                  compact={false}
                />,
              ]
            : []
        }
      />

      {/* Categories Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Categorías ({categories.length})
        </h3>
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {categories.map((cat) => {
              const catProducts = products.filter(
                (p) => p.category_id === cat.id
              );
              return (
                <div
                  key={cat.id}
                  className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {cat.name}
                    </h4>
                    <span className="text-xs font-mono text-gray-500">
                      {catProducts.length}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {catProducts.length}{" "}
                    {catProducts.length === 1 ? "producto" : "productos"}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
            <p className="text-sm text-gray-500">
              No hay categorías aún.{" "}
              {isAdmin && "Crea una para poder registrar compras."}
            </p>
          </div>
        )}
      </div>

      {/* Products Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Productos ({products.length})
        </h3>
        <ProductCatalog products={products} onRefresh={onRefreshProducts} />
      </div>
    </>
  );
}
