"use client";

import { useState, useEffect } from "react";
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
  SpendReport,
  PriceHistoryPoint,
  InventoryProduct,
} from "../../types";

interface Props {
  products: InventoryProduct[];
}

const MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear];

export default function ReportesTab({ products }: Props) {
  const [categoryData, setCategoryData] =
    useState<SpendReport<SpendByCategory> | null>(null);
  const [distributorData, setDistributorData] =
    useState<SpendReport<SpendByDistributor> | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  const [loadingSpend, setLoadingSpend] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [month, setMonth] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number>(currentYear);

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) ?? null;

  // Recargar reportes de gasto cuando cambian filtros
  useEffect(() => {
    const load = async () => {
      setLoadingSpend(true);
      try {
        const [cat, dist] = await Promise.all([
          getSpendByCategory({ month, year }),
          getSpendByDistributor({ month, year }),
        ]);
        setCategoryData(cat);
        setDistributorData(dist);
      } catch (e) {
        console.error("Error cargando reportes:", e);
      } finally {
        setLoadingSpend(false);
      }
    };
    load();
  }, [month, year]);

  // Cargar historial cuando cambia el producto
  useEffect(() => {
    if (!selectedProductId) {
      setPriceHistory([]);
      return;
    }
    const load = async () => {
      setLoadingHistory(true);
      try {
        setPriceHistory(await getPriceHistory(selectedProductId));
      } catch {
        setPriceHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    };
    load();
  }, [selectedProductId]);

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        eyebrow="Análisis de Gastos e Historial de Precios"
        title="Reportes"
        subtitle="Visualización y análisis del comportamiento del gasto por categoría y distribuidor, así como de las tendencias de precios."
      />
      {/* ── Filtros de período ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Período:
        </span>

        {/* Año actual — estático, se expande cuando haya más años */}
        <span className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-sm font-semibold rounded-xl shadow-sm">
          {currentYear}
        </span>

        {/* Mes */}
        <select
          value={month ?? ""}
          onChange={(e) =>
            setMonth(e.target.value ? Number(e.target.value) : undefined)
          }
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
        >
          <option value="">Todos los meses</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {month !== undefined && (
          <button
            onClick={() => setMonth(undefined)}
            className="text-xs text-indigo-500 hover:text-indigo-700 underline"
          >
            Limpiar mes
          </button>
        )}
      </div>

      {/* ── Gasto por categoría y distribuidor ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SpendByCategoryChart data={categoryData} loading={loadingSpend} />
        <SpendByDistributorChart
          data={distributorData}
          loading={loadingSpend}
        />
      </div>

      {/* ── Histórico de precios ────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Producto:
          </span>
          <select
            value={selectedProductId ?? ""}
            onChange={(e) =>
              setSelectedProductId(
                e.target.value ? Number(e.target.value) : null,
              )
            }
            className="flex-1 max-w-sm px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            <option value="">Seleccioná un producto...</option>
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
          loading={loadingHistory}
        />
      </div>
    </div>
  );
}
