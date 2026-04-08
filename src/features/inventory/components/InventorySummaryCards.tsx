"use client";

import { useEffect, useState } from "react";
import {
  getInventorySummary,
} from "../services/inventoryService";
import type { InventorySummaryData } from "../types";
import {
  BanknotesIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

type Props = {
  month: number;
  year: number;
  isAdmin: boolean;
};

export default function InventorySummaryCards({ month, year, isAdmin }: Props) {
  const [data, setData] = useState<InventorySummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getInventorySummary(month, year)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [month, year]);

  if (loading)
    return <p className="text-gray-500 italic text-sm">Cargando resumen...</p>;
  if (error || !data)
    return <p className="text-red-500 text-sm">{error || "Error al cargar resumen."}</p>;

  const cards = isAdmin
    ? [
        {
          label: "Ingreso Total",
          value: formatCOP(data.total_income ?? 0),
          variation: data.income_variation,
          icon: BanknotesIcon,
          bg: "bg-emerald-50",
          iconColor: "text-emerald-600",
          border: "border-emerald-200",
        },
        {
          label: "Gastos Totales",
          value: formatCOP(data.total_expenses),
          variation: data.expenses_variation,
          icon: ShoppingCartIcon,
          bg: "bg-rose-50",
          iconColor: "text-rose-500",
          border: "border-rose-200",
          invertVariation: true,
        },
        {
          label: "Utilidad Neta",
          value: formatCOP(data.net_profit ?? 0),
          variation: data.profit_variation,
          icon: ArrowTrendingUpIcon,
          bg: (data.net_profit ?? 0) >= 0 ? "bg-blue-50" : "bg-orange-50",
          iconColor: (data.net_profit ?? 0) >= 0 ? "text-blue-600" : "text-orange-500",
          border: (data.net_profit ?? 0) >= 0 ? "border-blue-200" : "border-orange-200",
        },
      ]
    : [
        {
          label: "Mis gastos del mes",
          value: formatCOP(data.total_expenses),
          variation: data.expenses_variation,
          icon: ShoppingCartIcon,
          bg: "bg-rose-50",
          iconColor: "text-rose-500",
          border: "border-rose-200",
          invertVariation: true,
        },
      ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => {
        const v = card.variation;
        const isPositive = v != null && v > 0;
        // Para gastos: subida es mala (rojo), bajada es buena (verde)
        const goodColor = card.invertVariation ? (isPositive ? "text-red-500" : "text-emerald-600") : (isPositive ? "text-emerald-600" : "text-red-500");

        return (
        <div
          key={card.label}
          className={`flex items-center gap-4 rounded-2xl border ${card.border} ${card.bg} px-5 py-4 shadow-sm`}
        >
          <div className="rounded-xl p-2.5 bg-white shadow-sm">
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">{card.label}</p>
            <p className="text-lg font-bold text-gray-800">{card.value}</p>
          </div>
          {v != null && (
            <div className={`flex items-center gap-0.5 text-xs font-semibold ${goodColor}`}>
              {isPositive
                ? <ArrowUpIcon className="w-3 h-3" />
                : <ArrowDownIcon className="w-3 h-3" />}
              {Math.abs(v)}%
            </div>
          )}
        </div>
        );
      })}

      {/* Desglose por categoría */}
      {data.by_category.length > 0 && (
        <div className="sm:col-span-3 mt-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Gastos por categoría
          </p>
          <div className="flex flex-wrap gap-2">
            {data.by_category.map((cat) => (
              <span
                key={cat.category}
                className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm"
                style={{ borderColor: cat.color }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.category}: {formatCOP(cat.total)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
