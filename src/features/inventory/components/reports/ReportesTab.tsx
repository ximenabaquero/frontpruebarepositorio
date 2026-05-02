"use client";

import { useState, useEffect } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import PageHeader from "../PageHeader";
import SpendByCategoryChart from "./SpendByCategory";
import SpendByDistributorChart from "./SpendByDistributor";
import PriceHistoryChart from "./PriceHistoryChart";
import {
  getSpendByCategory,
  getSpendByDistributor,
  getPriceHistory,
} from "../../services/inventoryService";
import type {
  SpendByCategory,
  SpendByDistributor,
  PriceHistoryPoint,
  InventoryProduct,
} from "../../types";

interface ReportesTabProps {
  products: InventoryProduct[];
}

export default function ReportesTab({ products }: ReportesTabProps) {
  const [spendByCategory, setSpendByCategory] = useState<SpendByCategory[]>([]);
  const [spendByDistributor, setSpendByDistributor] = useState<
    SpendByDistributor[]
  >([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || null;

  // Load spend reports
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [categoryData, distributorData] = await Promise.all([
          getSpendByCategory(),
          getSpendByDistributor(),
        ]);
        setSpendByCategory(categoryData);
        setSpendByDistributor(distributorData);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Load price history when product changes
  useEffect(() => {
    if (!selectedProductId) {
      setPriceHistory([]);
      return;
    }

    const load = async () => {
      try {
        const data = await getPriceHistory(selectedProductId);
        setPriceHistory(data);
      } catch (error) {
        console.error("Error loading price history:", error);
        setPriceHistory([]);
      }
    };
    load();
  }, [selectedProductId]);

  return (
    <>
      <PageHeader
        eyebrow="Análisis"
        title="Reportes"
        subtitle="Dónde se va el dinero y cómo evolucionan los precios."
        actions={[
          <button
            key="export"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Exportar PDF
          </button>,
        ]}
      />

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-gray-400">Cargando reportes...</div>
        </div>
      ) : (
        <>
          {/* Spend charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <SpendByCategoryChart data={spendByCategory} />
            <SpendByDistributorChart data={spendByDistributor} />
          </div>

          {/* Price history chart */}
          <div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Selecciona un producto para ver su histórico de precios:
              </label>
              <select
                value={selectedProductId || ""}
                onChange={(e) =>
                  setSelectedProductId(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className="w-full max-w-md px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Selecciona un producto --</option>
                {products
                  .filter((p) => p.type === "insumo")
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>
            <PriceHistoryChart
              history={priceHistory}
              product={selectedProduct}
            />
          </div>
        </>
      )}
    </>
  );
}
