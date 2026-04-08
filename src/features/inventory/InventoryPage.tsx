"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

import MainLayout from "@/layouts/MainLayout";
import AuthGuard from "@/components/AuthGuard";
import RegisterHeaderBar from "@/features/post-login/components/RegisterHeaderBar";
import { useAuth } from "@/features/auth/AuthContext";

import InventorySummaryCards from "./components/InventorySummaryCards";
import CategoryManager from "./components/CategoryManager";
import ProductCatalog from "./components/ProductCatalog";
import PurchaseForm from "./components/PurchaseForm";
import PurchaseTable from "./components/PurchaseTable";
import UsageTable from "./components/UsageTable";
import UsageForm from "./components/UsageForm";

import {
  getCategories,
  getPurchases,
  deletePurchase,
  getProducts,
  getUsages,
  deleteUsage,
} from "./services/inventoryService";
import type {
  InventoryCategory,
  InventoryProduct,
  InventoryPurchase,
  InventoryUsage,
} from "./types";

const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

type Tab = "compras" | "consumos";

export default function InventoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [purchases, setPurchases] = useState<InventoryPurchase[]>([]);
  const [usages, setUsages] = useState<InventoryUsage[]>([]);

  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [loadingUsages, setLoadingUsages] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>("compras");

  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<InventoryPurchase | null>(null);
  const [confirmDeletePurchase, setConfirmDeletePurchase] = useState<InventoryPurchase | null>(null);

  const [showUsageForm, setShowUsageForm] = useState(false);
  const [confirmDeleteUsage, setConfirmDeleteUsage] = useState<InventoryUsage | null>(null);

  const years = Array.from({ length: 4 }, (_, i) => now.getFullYear() - i);

  const loadCategories = useCallback(async () => {
    try { setCategories(await getCategories()); } catch { /* silencioso */ }
  }, []);

  const loadProducts = useCallback(async () => {
    try { setProducts(await getProducts()); } catch { setProducts([]); }
  }, []);

  const loadPurchases = useCallback(async () => {
    setLoadingPurchases(true);
    try { setPurchases(await getPurchases({ month, year })); }
    catch { setPurchases([]); }
    finally { setLoadingPurchases(false); }
  }, [month, year]);

  const loadUsages = useCallback(async () => {
    setLoadingUsages(true);
    try { setUsages(await getUsages({ month, year })); }
    catch { setUsages([]); }
    finally { setLoadingUsages(false); }
  }, [month, year]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { loadPurchases(); }, [loadPurchases]);
  useEffect(() => { loadUsages(); }, [loadUsages]);

  async function handleConfirmDeletePurchase() {
    if (!confirmDeletePurchase) return;
    try {
      await deletePurchase(confirmDeletePurchase.id);
      toast.success("Compra eliminada");
      loadPurchases();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setConfirmDeletePurchase(null);
    }
  }

  async function handleConfirmDeleteUsage() {
    if (!confirmDeleteUsage) return;
    try {
      await deleteUsage(confirmDeleteUsage.id);
      toast.success("Consumo eliminado");
      loadUsages();
      loadProducts(); // stock se restaura
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setConfirmDeleteUsage(null);
    }
  }

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

            {/* Título + filtros mes/año */}
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Consumos Registrados
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Gestión de inventario y trazabilidad de insumos médicos.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {MONTHS.map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Tarjetas de resumen */}
            <div className="mt-6">
              <InventorySummaryCards month={month} year={year} isAdmin={isAdmin} />
            </div>

            {/* Categorías como pills + botón crear */}
            {categories.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Categorías de Consumo
                  </p>
                  {isAdmin && (
                    <CategoryManager
                      categories={categories}
                      onRefresh={loadCategories}
                      compact
                    />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm"
                      style={{ borderColor: cat.color }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Catálogo de productos (solo admin, colapsable) */}
            {isAdmin && (
              <ProductCatalog
                products={products}
                categories={categories}
                onRefresh={loadProducts}
              />
            )}

            {/* Tabs + botón acción */}
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
                <button
                  onClick={() => setActiveTab("compras")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === "compras"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  Historial de Compras
                </button>
                <button
                  onClick={() => setActiveTab("consumos")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === "consumos"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  Consumos Registrados
                </button>
              </div>

              {activeTab === "compras" ? (
                <button
                  onClick={() => { setEditingPurchase(null); setShowPurchaseForm(true); }}
                  disabled={categories.length === 0}
                  title={categories.length === 0 ? "No hay categorías disponibles" : ""}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Registrar compra
                </button>
              ) : (
                <button
                  onClick={() => setShowUsageForm(true)}
                  disabled={products.filter((p) => p.active && p.stock > 0).length === 0}
                  title={products.filter((p) => p.active && p.stock > 0).length === 0 ? "No hay productos con stock" : ""}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Registrar Consumo
                </button>
              )}
            </div>

            {/* Contenido del tab activo */}
            {activeTab === "compras" ? (
              <PurchaseTable
                purchases={purchases}
                isAdmin={isAdmin}
                currentUserId={user?.id ?? 0}
                onEdit={(p) => { setEditingPurchase(p); setShowPurchaseForm(true); }}
                onDelete={(p) => setConfirmDeletePurchase(p)}
                loading={loadingPurchases}
              />
            ) : (
              <UsageTable
                usages={usages}
                onDelete={(u) => setConfirmDeleteUsage(u)}
                loading={loadingUsages}
              />
            )}
          </div>
        </div>

        {/* Modales */}
        <ConfirmModal
          isOpen={confirmDeletePurchase !== null}
          title="Eliminar compra"
          message={`¿Eliminar "${confirmDeletePurchase?.item_name}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          variant="danger"
          onConfirm={handleConfirmDeletePurchase}
          onCancel={() => setConfirmDeletePurchase(null)}
        />

        <ConfirmModal
          isOpen={confirmDeleteUsage !== null}
          title="Eliminar consumo"
          message={`¿Eliminar el consumo de "${confirmDeleteUsage?.product?.name}"? El stock se restaurará.`}
          confirmLabel="Eliminar"
          variant="danger"
          onConfirm={handleConfirmDeleteUsage}
          onCancel={() => setConfirmDeleteUsage(null)}
        />

        {showPurchaseForm && (
          <PurchaseForm
            categories={categories}
            editing={editingPurchase}
            onClose={() => setShowPurchaseForm(false)}
            onSaved={loadPurchases}
          />
        )}

        {showUsageForm && (
          <UsageForm
            products={products}
            onClose={() => setShowUsageForm(false)}
            onSaved={() => { loadUsages(); loadProducts(); }}
          />
        )}
      </MainLayout>
    </AuthGuard>
  );
}
