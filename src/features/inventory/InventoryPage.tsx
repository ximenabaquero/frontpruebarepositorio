"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import MainLayout from "@/layouts/MainLayout";
import AuthGuard from "@/components/AuthGuard";
import RegisterHeaderBar from "@/features/post-login/components/RegisterHeaderBar";
import { useAuth } from "@/features/auth/AuthContext";

import InventorySidebar from "./components/InventorySidebar";
import InventorySummaryCards from "./components/InventorySummaryCards";
import StockTab from "./components/StockTab";
import ConsumosTab from "./components/ConsumosTab";
import ComprasTab from "./components/ComprasTab";
import ReportesTab from "./components/ReportesTab";
import CatalogoTab from "./components/CatalogoTab";
import DistribuidoresTab from "./components/DistribuidoresTab";
import PurchaseForm from "./components/PurchaseForm";
import UsageForm from "./components/UsageForm";

import {
  getCategories,
  getPurchases,
  getProducts,
  getUsages,
  getDistributors,
  createDistributor,
  updateDistributor,
  deleteDistributor,
} from "./services/inventoryService";
import type {
  InventoryCategory,
  InventoryProduct,
  InventoryPurchase,
  InventoryUsage,
  Distributor,
} from "./types";

type TabType = "stock" | "consumos" | "compras" | "reportes" | "catalogo" | "distribuidores";

export default function InventoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const now = new Date();

  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [purchases, setPurchases] = useState<InventoryPurchase[]>([]);
  const [usages, setUsages] = useState<InventoryUsage[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);

  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [loadingUsages, setLoadingUsages] = useState(true);

  const [activeTab, setActiveTab] = useState<TabType>("stock");

  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showUsageForm, setShowUsageForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | undefined>();

  const loadCategories = useCallback(async () => {
    try { setCategories(await getCategories()); } catch { /* silencioso */ }
  }, []);

  const loadProducts = useCallback(async () => {
    try { setProducts(await getProducts()); } catch { setProducts([]); }
  }, []);

  const loadPurchases = useCallback(async () => {
    setLoadingPurchases(true);
    try { setPurchases(await getPurchases()); }
    catch { setPurchases([]); }
    finally { setLoadingPurchases(false); }
  }, []);

  const loadUsages = useCallback(async () => {
    setLoadingUsages(true);
    try { setUsages(await getUsages()); }
    catch { setUsages([]); }
    finally { setLoadingUsages(false); }
  }, []);

  const loadDistributors = useCallback(async () => {
    try { setDistributors(await getDistributors()); } catch { setDistributors([]); }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { loadPurchases(); }, [loadPurchases]);
  useEffect(() => { loadUsages(); }, [loadUsages]);
  useEffect(() => { loadDistributors(); }, [loadDistributors]);

  // Calculate stats for sidebar
  const insumos = products.filter((p) => p.type === "insumo");
  const criticalCount = insumos.filter((p) => p.stock === 0 || p.stock < 5).length;
  const lowCount = insumos.filter((p) => p.stock >= 5 && p.stock < 10).length;

  const todayUsages = usages.filter((u) => {
    const usageDate = new Date(u.usage_date);
    return (
      usageDate.getDate() === now.getDate() &&
      usageDate.getMonth() === now.getMonth() &&
      usageDate.getFullYear() === now.getFullYear()
    );
  });

  const handleOpenPurchase = (product?: InventoryProduct) => {
    setSelectedProduct(product);
    setShowPurchaseForm(true);
  };

  const handleOpenConsume = (product?: InventoryProduct) => {
    setSelectedProduct(product);
    setShowUsageForm(true);
  };

  const handleClosePurchase = () => {
    setShowPurchaseForm(false);
    setSelectedProduct(undefined);
  };

  const handleCloseUsage = () => {
    setShowUsageForm(false);
    setSelectedProduct(undefined);
  };

  return (
    <AuthGuard>
      <MainLayout>
        <div className="bg-gradient-to-b from-indigo-50 via-white to-white min-h-screen">
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

            {/* Título */}
            <div className="mt-3 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Gestión de Inventario
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Control completo de stock, compras y consumos.
              </p>
            </div>

            {/* Tarjetas de resumen (solo admin) */}
            {isAdmin && (
              <div className="mb-6">
                <InventorySummaryCards isAdmin={isAdmin} />
              </div>
            )}

            {/* Main Layout: Sidebar + Content */}
            <div className="grid grid-cols-[220px_1fr] gap-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[calc(100vh-300px)]">
              {/* Sidebar */}
              <InventorySidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                productsCount={products.length}
                distributorsCount={distributors.length}
                criticalCount={criticalCount}
                lowCount={lowCount}
                consumosToday={todayUsages.length}
                comprasThisMonth={purchases.length}
              />

              {/* Main Content Area */}
              <main className="py-6 px-7 min-w-0 overflow-auto">
                {activeTab === "stock" && (
                  <StockTab
                    products={products}
                    categories={categories}
                    onOpenPurchase={handleOpenPurchase}
                    onOpenConsume={handleOpenConsume}
                    isAdmin={isAdmin}
                  />
                )}
                {activeTab === "consumos" && (
                  <ConsumosTab
                    usages={usages}
                    loading={loadingUsages}
                    onOpenConsume={() => handleOpenConsume()}
                  />
                )}
                {activeTab === "compras" && (
                  <ComprasTab
                    purchases={purchases}
                    loading={loadingPurchases}
                    isAdmin={isAdmin}
                    onOpenPurchase={() => handleOpenPurchase()}
                  />
                )}
                {activeTab === "reportes" && (
                  <ReportesTab
                    products={products}
                  />
                )}
                {activeTab === "catalogo" && (
                  <CatalogoTab
                    products={products}
                    categories={categories}
                    isAdmin={isAdmin}
                    onRefreshCategories={loadCategories}
                    onRefreshProducts={loadProducts}
                  />
                )}
                {activeTab === "distribuidores" && (
                  <DistribuidoresTab
                    distributors={distributors}
                    onCreate={createDistributor}
                    onUpdate={updateDistributor}
                    onDelete={deleteDistributor}
                    onCreated={(d) => setDistributors((prev) => [...prev, d].sort((a, b) => a.name.localeCompare(b.name)))}
                    onUpdated={(d) => setDistributors((prev) => prev.map((x) => (x.id === d.id ? d : x)))}
                    onDeleted={(id) => setDistributors((prev) => prev.filter((x) => x.id !== id))}
                  />
                )}
              </main>
            </div>
          </div>
        </div>

        {/* Modales */}
        {showPurchaseForm && (
          <PurchaseForm
            categories={categories}
            products={products}
            onClose={handleClosePurchase}
            onSaved={() => {
              loadPurchases();
              loadProducts();
            }}
          />
        )}

        {showUsageForm && (
          <UsageForm
            products={products}
            onClose={handleCloseUsage}
            onSaved={() => {
              loadUsages();
              loadProducts();
            }}
          />
        )}
      </MainLayout>
    </AuthGuard>
  );
}
