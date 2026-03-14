"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
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

import {
  getCategories,
  getPurchases,
  deletePurchase,
  getProducts,
} from "./services/inventoryService";
import type {
  InventoryCategory,
  InventoryProduct,
  InventoryPurchase,
} from "./types";

const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

export default function InventoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [filterCategory, setFilterCategory] = useState<number | "">("");

  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [purchases, setPurchases] = useState<InventoryPurchase[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);

  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<InventoryPurchase | null>(null);
  const [confirmDeletePurchase, setConfirmDeletePurchase] = useState<InventoryPurchase | null>(null);

  const years = Array.from({ length: 4 }, (_, i) => now.getFullYear() - i);

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      // silencioso
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      setProducts([]);
    }
  }, []);

  const loadPurchases = useCallback(async () => {
    setLoadingPurchases(true);
    try {
      const data = await getPurchases({
        month,
        year,
        category_id: filterCategory !== "" ? filterCategory : undefined,
      });
      setPurchases(data);
    } catch {
      setPurchases([]);
    } finally {
      setLoadingPurchases(false);
    }
  }, [month, year, filterCategory]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { loadPurchases(); }, [loadPurchases]);

  function handleEdit(p: InventoryPurchase) {
    setEditingPurchase(p);
    setShowPurchaseForm(true);
  }

  async function handleConfirmDeletePurchase() {
    if (!confirmDeletePurchase) return;
    try {
      await deletePurchase(confirmDeletePurchase.id);
      toast.success(isAdmin ? "Compra eliminada" : "Gasto eliminado");
      loadPurchases();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setConfirmDeletePurchase(null);
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

            <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
              {isAdmin ? "Inventario y gastos" : "Mis gastos"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isAdmin
                ? "Registra y controla los gastos de la clínica. Ve ingresos vs gastos y tu ganancia neta."
                : "Registra los insumos y materiales que usaste en la clínica este mes."}
            </p>

            {/* Filtros de periodo */}
            <div className="mt-5 flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <FunnelIcon className="w-3.5 h-3.5" />
                Filtrar por:
              </div>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {MONTHS.map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              {categories.length > 0 && (
                <select
                  value={filterCategory}
                  onChange={(e) =>
                    setFilterCategory(e.target.value !== "" ? Number(e.target.value) : "")
                  }
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Tarjetas de resumen */}
            <InventorySummaryCards month={month} year={year} isAdmin={isAdmin} />

            {/* Gestión de categorías (solo admin) */}
            {isAdmin && (
              <CategoryManager categories={categories} onRefresh={loadCategories} />
            )}

            {/* Catálogo de productos (solo admin) */}
            {isAdmin && (
              <ProductCatalog
                products={products}
                categories={categories}
                onRefresh={loadProducts}
              />
            )}

            {/* Compras / Gastos */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                {isAdmin ? "Compras registradas" : "Mis gastos registrados"}
              </h2>
              <button
                onClick={() => { setEditingPurchase(null); setShowPurchaseForm(true); }}
                disabled={categories.length === 0}
                title={categories.length === 0 ? "No hay categorías disponibles aún" : ""}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                {isAdmin ? "Registrar compra" : "Registrar gasto"}
              </button>
            </div>
            <PurchaseTable
              purchases={purchases}
              isAdmin={isAdmin}
              currentUserId={user?.id ?? 0}
              onEdit={handleEdit}
              onDelete={(p) => setConfirmDeletePurchase(p)}
              loading={loadingPurchases}
            />
          </div>
        </div>

        <ConfirmModal
          isOpen={confirmDeletePurchase !== null}
          title={isAdmin ? "Eliminar compra" : "Eliminar gasto"}
          message={`¿Eliminar "${confirmDeletePurchase?.item_name}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          variant="danger"
          onConfirm={handleConfirmDeletePurchase}
          onCancel={() => setConfirmDeletePurchase(null)}
        />

        {showPurchaseForm && (
          <PurchaseForm
            categories={categories}
            editing={editingPurchase}
            onClose={() => setShowPurchaseForm(false)}
            onSaved={loadPurchases}
          />
        )}
      </MainLayout>
    </AuthGuard>
  );
}
