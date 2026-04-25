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
  // Filtrar solo consumos sin paciente
  const usagesWithoutPatient = usages.filter((u) => u.status === "sin_paciente");
  
  const today = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const todayUsages = usagesWithoutPatient.filter((u) => {
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
        title="Consumos sin paciente"
        subtitle="Mermas, limpiezas, pruebas y otros consumos no asociados a procedimientos."
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

      {/* Info banner */}
      <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <p className="font-medium">ℹ️ Sobre los consumos con paciente</p>
        <p className="text-xs mt-1">
          Los insumos usados en procedimientos clínicos se registran desde el{" "}
          <span className="font-semibold">expediente del paciente</span> y no aparecen en esta lista. 
          Esta sección solo muestra consumos sin paciente asociado.
        </p>
      </div>

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
            {usagesWithoutPatient.length}
          </div>
          <div className="text-xs text-gray-500">consumos sin paciente</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
            Motivos comunes
          </div>
          <div className="text-xs text-gray-600 space-y-0.5 mt-2">
            <div>🧹 Limpieza</div>
            <div>🧪 Pruebas</div>
            <div>📦 Mermas</div>
          </div>
        </div>
      </div>

      {/* Usage Table */}
      <UsageTable usages={usagesWithoutPatient} loading={loading} />
    </>
  );
}
