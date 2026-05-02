"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import MainLayout from "@/layouts/MainLayout";
import AuthGuard from "@/components/AuthGuard";
import RegisterHeaderBar from "@/features/post-login/components/RegisterHeaderBar";
import { useAuth } from "@/features/auth/AuthContext";

import InventoryNav from "./components/InventoryNav";
import InventorySummaryCards from "./components/InventorySummaryCards";
import ProductTab from "./components/dashboard/ProductTab";
import UsageTab from "./components/usage/UsageTab";
import PurchaseTab from "./components/purchase/PurchaseTab";
import ReportesTab from "./components/reports/ReportesTab";
import CatalogoTab from "./components/CatalogoTab";
import DistribuidorTab from "./components/distribuidor/DistribuidorTab";
import PurchaseForm from "./components/purchase/PurchaseForm";

import {
  getCategories,
  getPurchases,
  getProducts,
  getUsages,
  getDistributors,
  createDistributor,
  updateDistributor,
} from "./services/inventoryService";

import type {
  InventoryCategory,
  InventoryProduct,
  InventoryPurchase,
  InventoryUsage,
  Distributor,
} from "./types";

type TabType =
  | "dashboard"
  | "distribuidores"
  | "compras"
  | "consumos"
  | "reportes";

export default function InventoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  // Estados de datos
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [purchases, setPurchases] = useState<InventoryPurchase[]>([]);
  const [usages, setUsages] = useState<InventoryUsage[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);

  // Estados de UI
  const [loadingUsages, setLoadingUsages] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard"); // Valor inicial corregido
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    InventoryProduct | undefined
  >();

  // Callbacks de carga de datos
  const loadCategories = useCallback(async () => {
    try {
      setCategories(await getCategories());
    } catch {
      /* silenciar */
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setProducts(await getProducts());
    } catch {
      setProducts([]);
    }
  }, []);

  const loadPurchases = useCallback(async () => {
    try {
      setPurchases(await getPurchases());
    } catch {
      setPurchases([]);
    }
  }, []);

  const loadUsages = useCallback(async () => {
    setLoadingUsages(true);
    try {
      setUsages(await getUsages());
    } catch {
      setUsages([]);
    } finally {
      setLoadingUsages(false);
    }
  }, []);

  const loadDistributors = useCallback(async () => {
    try {
      const result = await getDistributors();
      setDistributors(result);
    } catch (e) {
      setDistributors([]);
    }
  }, []);

  // Carga inicial masiva
  useEffect(() => {
    loadCategories();
    loadProducts();
    loadPurchases();
    loadUsages();
    loadDistributors();
  }, [
    loadCategories,
    loadProducts,
    loadPurchases,
    loadUsages,
    loadDistributors,
  ]);

  // Handlers
  const handleOpenPurchase = (product?: InventoryProduct) => {
    setSelectedProduct(product);
    setShowPurchaseForm(true);
  };

  const handleOpenConsume = (product?: InventoryProduct) => {
    setSelectedProduct(product);
    // Aquí abrirías tu formulario de consumo cuando lo habilites
    console.log("Abrir consumo para:", product?.name);
  };

  return (
    <AuthGuard>
      <MainLayout>
        <div className="bg-gradient-to-b from-indigo-50 via-white to-white min-h-screen pb-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <RegisterHeaderBar
              onBackToRegisterClick={() => router.push("/register-patient")}
              onImagesClick={() => router.push("/control-images")}
              onPatientsClick={() => router.push("/patients")}
              onStatsClick={() => router.push("/stats")}
              onRemitentesClick={() => router.push("/admin/remitentes")}
              onInventoryClick={() => router.push("/inventory")}
              active="inventory"
            />

            {/* Título de Sección */}
            <div className="mt-8 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Gestión de Inventario
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Control completo de stock, compras y consumos.
              </p>
            </div>

            {/* Resumen para Admins */}
            {isAdmin && (
              <div className="mb-8">
                <InventorySummaryCards isAdmin={isAdmin} />
              </div>
            )}

            {/* Navegación por Pestañas */}
            <InventoryNav activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Área de Contenido Dinámico */}
            <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
              <main className="py-6 px-7">
                {activeTab === "dashboard" && (
                  <ProductTab
                    products={products}
                    categories={categories}
                    onRefreshCategories={loadCategories}
                    onRefreshProducts={loadProducts}
                    isAdmin={isAdmin}
                  />
                )}

                {activeTab === "compras" && (
                  <PurchaseTab
                    purchases={purchases}
                    categories={categories}
                    loading={false}
                    isAdmin={isAdmin}
                    onOpenPurchase={handleOpenPurchase}
                    onRefreshCategories={loadCategories} // AGREGAR
                    onRefreshProducts={loadProducts} // AGREGAR
                  />
                )}

                {activeTab === "consumos" && (
                  <UsageTab
                    usages={usages}
                    categories={categories}
                    loading={loadingUsages}
                    isAdmin={isAdmin}
                    onOpenConsume={() => handleOpenConsume()}
                    onRefreshCategories={loadCategories}
                    onRefreshProducts={loadProducts}
                  />
                )}

                {activeTab === "reportes" && (
                  <ReportesTab products={products} />
                )}

                {activeTab === "distribuidores" && (
                  <DistribuidorTab
                    distributors={distributors}
                    onCreate={createDistributor}
                    onUpdate={updateDistributor}
                    onCreated={(d) =>
                      setDistributors((prev) =>
                        [...prev, d].sort((a, b) =>
                          a.name.localeCompare(b.name),
                        ),
                      )
                    }
                    onUpdated={(d) =>
                      setDistributors((prev) =>
                        prev.map((x) => (x.id === d.id ? d : x)),
                      )
                    }
                  />
                )}
              </main>
            </div>
          </div>
        </div>

        {/* Modales Globales */}
        {showPurchaseForm && (
          <PurchaseForm
            categories={categories}
            products={products}
            onClose={() => setShowPurchaseForm(false)}
            onSaved={() => {
              loadPurchases();
              loadProducts();
            }}
          />
        )}
      </MainLayout>
    </AuthGuard>
  );
}
