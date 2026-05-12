"use client";

import { useState } from "react";
import {
  CheckCircle, AlertTriangle, Clock, TrendingUp,
  Shield, FileText, Building2, BarChart3, Star,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  kpisAuditoria, cuentasRadicadas, siniestralidad,
  type EstadoAuditoria,
} from "@/data/mock/auditoria";

const ESTADO_STYLES: Record<EstadoAuditoria, { bg: string; text: string; dot: string; label: string; icon: typeof CheckCircle }> = {
  auditado:     { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", label: "Auditado con evidencia", icon: CheckCircle },
  en_revision:  { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500",   label: "En revisión",           icon: Clock        },
  irregularidad:{ bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-500",     label: "Irregularidad detectada",icon: AlertTriangle },
};

const MENU_TABS = [
  { id: "dashboard", label: "Resumen",          icon: BarChart3  },
  { id: "rips",      label: "RIPS",             icon: FileText   },
  { id: "supersalud",label: "Supersalud",       icon: Shield     },
  { id: "adres",     label: "ADRES",            icon: Building2  },
  { id: "scoring",   label: "Scoring prestadores", icon: Star    },
];

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Building2 className="w-8 h-8 text-gray-300" />
      </div>
      <p className="text-sm font-semibold text-gray-500">Módulo {label}</p>
      <p className="text-xs text-gray-400 mt-1">En construcción — disponible en Fase 2</p>
      <div className="mt-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-xs text-amber-700 font-medium">⚠️ Requiere integración con {label}</p>
      </div>
    </div>
  );
}

export default function AuditoriaPage() {
  const [tab, setTab] = useState("dashboard");

  const totalCuentas = cuentasRadicadas.length;
  const auditadas = cuentasRadicadas.filter((c) => c.estado === "auditado").length;
  const totalMonto = cuentasRadicadas.reduce((a, c) => a + c.monto, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Auditoría y Reportes</h1>
        <p className="text-sm text-gray-500 mt-0.5">Verificación de servicios · EPS Sura · Mayo 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-tour="kpi-verificados" className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs text-gray-400 font-medium">Este mes</span>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{kpisAuditoria.pct_verificados}%</p>
          <p className="text-sm text-gray-500 mt-0.5">Servicios verificados</p>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${kpisAuditoria.pct_verificados}%` }} />
          </div>
        </div>

        <div data-tour="kpi-irregularidades" className="bg-white rounded-2xl border-2 border-red-200 p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-xs text-red-500 font-semibold">⚠️ Detectados</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{kpisAuditoria.fraudes_detectados}</p>
          <p className="text-sm text-gray-500 mt-0.5">Irregularidades detectadas</p>
          <p className="text-xs text-red-600 font-medium mt-2">Visitas fantasma + GPS fuera de rango</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-violet-600" />
            </div>
            <span className="text-xs text-gray-400 font-medium">Mayo 2026</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            $247M <span className="text-base font-semibold text-gray-400">COP</span>
          </p>
          <p className="text-sm text-gray-500 mt-0.5">Siniestralidad del mes</p>
          <p className="text-xs text-amber-600 font-medium mt-2">79.7% del presupuesto ($310M)</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-xs text-gray-400 font-medium">Promedio</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{kpisAuditoria.score_promedio}</p>
          <p className="text-sm text-gray-500 mt-0.5">Score calidad prestadores</p>
          <div className="flex gap-0.5 mt-2">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.floor(kpisAuditoria.score_promedio) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs de módulos */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div data-tour="tabs-regulatorio" className="flex overflow-x-auto border-b border-gray-200">
          {MENU_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                tab === t.id
                  ? "border-emerald-600 text-emerald-700 bg-emerald-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Contenido del tab */}
        {tab === "dashboard" ? (
          <div className="p-6 space-y-6">

            {/* Gráfico siniestralidad */}
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-4">Siniestralidad mensual (últimos 6 meses) · millones COP</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={siniestralidad} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[150, 320]} />
                  <Tooltip
                    formatter={(value, name) => [`$${value}M COP`, name === "siniestralidad" ? "Siniestralidad" : "Presupuesto"]}
                    contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e5e7eb" }}
                  />
                  <ReferenceLine y={310} stroke="#d97706" strokeDasharray="4 3" label={{ value: "Presupuesto $310M", position: "right", fontSize: 10, fill: "#d97706" }} />
                  <Bar dataKey="siniestralidad" name="Siniestralidad" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla cuentas radicadas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-900">
                  Cuentas radicadas para auditoría
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    {auditadas}/{totalCuentas} auditadas · {formatCOP(totalMonto)} total
                  </span>
                </h2>
              </div>
              <div data-tour="tabla-cuentas" className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Prestador</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Servicios</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Monto</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cuentasRadicadas.map((c) => {
                      const est = ESTADO_STYLES[c.estado];
                      const Icon = est.icon;
                      return (
                        <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-gray-900">{c.prestador}</p>
                            <p className="text-xs text-gray-400">{c.fecha_radicacion}</p>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-gray-600">{c.tipo}</td>
                          <td className="px-4 py-3.5 font-bold text-gray-900">{c.servicios}</td>
                          <td className="px-4 py-3.5 font-bold text-gray-900">{formatCOP(c.monto)}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1">
                              <Star className={`w-3.5 h-3.5 ${c.score >= 4 ? "text-amber-400 fill-amber-400" : "text-red-400 fill-red-400"}`} />
                              <span className={`text-sm font-bold ${c.score >= 4 ? "text-gray-900" : "text-red-700"}`}>{c.score}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${est.bg} ${est.text}`}>
                              <Icon className="w-3 h-3" />
                              {est.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <PlaceholderTab label={MENU_TABS.find((t) => t.id === tab)?.label ?? tab} />
        )}
      </div>
    </div>
  );
}
