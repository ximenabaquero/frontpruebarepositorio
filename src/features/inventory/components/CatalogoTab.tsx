"use client";

import { useState } from "react";
import { PlusIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import PageHeader from "./PageHeader";
import CategoryManager from "./CategoryManager";
import ProductCatalog from "./ProductCatalog";
import ProductForm from "./ProductForm";
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
  const [showProductForm, setShowProductForm] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [productsOpen, setProductsOpen] = useState(true);

  return (
    <>
      <PageHeader
        eyebrow="Configuración"
        title="Catálogo"
        subtitle="Productos y categorías disponibles."
      />

      {/* Categories Section */}
      <details open={categoriesOpen} className="mb-8">
        <summary 
          onClick={(e) => {
            e.preventDefault();
            setCategoriesOpen(!categoriesOpen);
          }}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors list-none"
        >
          <div className="flex items-center gap-3">
            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Categorías ({categories.length})
            </h3>
          </div>
          {isAdmin && (
            <CategoryManager
              categories={categories}
              onRefresh={onRefreshCategories}
              compact={false}
            />
          )}
        </summary>
        <div className="mt-4">
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
      </details>

      {/* Products Section */}
      <details open={productsOpen} className="mb-8">
        <summary 
          onClick={(e) => {
            e.preventDefault();
            setProductsOpen(!productsOpen);
          }}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors list-none"
        >
          <div className="flex items-center gap-3">
            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Catálogo de productos ({products.length})
            </h3>
          </div>
          {isAdmin && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowProductForm(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Agregar producto
            </button>
          )}
        </summary>
        <div className="mt-4">
          <ProductCatalog 
            products={products} 
            onRefresh={onRefreshProducts}
            isAdmin={isAdmin}
            onAddProduct={() => setShowProductForm(true)}
          />
        </div>
      </details>

      {/* Modal para agregar producto */}
      {showProductForm && (
        <ProductForm
          categories={categories}
          onClose={() => setShowProductForm(false)}
          onSaved={() => {
            onRefreshProducts();
            setShowProductForm(false);
          }}
        />
      )}
    </>
  );
}
