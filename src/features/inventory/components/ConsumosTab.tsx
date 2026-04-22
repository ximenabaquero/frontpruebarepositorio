"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "./PageHeader";
import UsageTable from "./UsageTable";
import type { InventoryUsage } from "../types";

interface ConsumosTabProps {
  usages: InventoryUsage[];
  loading: boolean;
  onOpenConsume: () => void;
}

export default function ConsumosTab({
  usages,
  loading,
  onOpenConsume,
}: ConsumosTabProps) {
  const today = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const todayUsages = usages.filter((u) => {
    const usageDate = new Date(u.usage_date);
    const now = new Date();
    return (
      usageDate.getDate() === now.getDate() &&
      usageDate.getMonth() === now.getMonth() &&
      usageDate.getFullYear() === now.getFullYear()
    );
  });

  return (
    <>
      <PageHeader
        eyebrow="Movimientos"
        title="Consumos"
        subtitle="Qué se usó, quién lo usó y en qué procedimiento."
        actions={[
          <button
            key="consume"
            onClick={onOpenConsume}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Registrar consumo
          </button>,
        ]}
      />

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
            Hoy · {today}
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono">
            {todayUsages.length}
          </div>
          <div className="text-xs text-gray-500">movimientos registrados</div>
        </div>
        
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
            Este período
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono">
            {usages.length}
          </div>
          <div className="text-xs text-gray-500">consumos totales</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
            Con paciente
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono">
            {usages.filter((u) => u.status === "con_paciente").length}
          </div>
          <div className="text-xs text-gray-500">
            {usages.filter((u) => u.status === "sin_paciente").length} sin paciente
          </div>
        </div>
      </div>

      {/* Usage Table */}
      <UsageTable usages={usages} loading={loading} />
    </>
  );
}
