"use client";

import { useState } from "react";
import {
  CheckCircle, AlertTriangle, DollarSign, TrendingUp,
  Star, Download, FileBarChart, Building2, Loader2,
  ChevronRight, Activity
} from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const PRESTADORES = [
  { nombre: "IPS Norte",        servicios: 42, gps: 42, firma: 42, monto: "$7.2M", estado: "aprobada",  razon: null },
  { nombre: "IPS SurOccidente", servicios: 38, gps: 38, firma: 37, monto: "$5.8M", estado: "revision",  razon: "1 sin firma" },
  { nombre: "IPS Chapinero",    servicios: 28, gps: 25, firma: 28, monto: "$4.1M", estado: "rechazada", razon: "3 sin GPS" },
  { nombre: "IPS Oncología",    servicios: 22, gps: 22, firma: 22, monto: "$3.4M", estado: "aprobada",  razon: null },
  { nombre: "IPS Neurología",   servicios: 12, gps: 12, firma: 12, monto: "$1.9M", estado: "aprobada",  razon: null },
];

const SCORING = [
  { nombre: "IPS Norte",        score: 4.8, razon: "GPS 100%, satisfacción alta" },
  { nombre: "IPS Oncología",    score: 4.7, razon: "Sin irregularidades" },
  { nombre: "IPS Neurología",   score: 4.5, razon: "Cumplimiento total" },
  { nombre: "IPS SurOccidente", score: 3.9, razon: "1 firma pendiente" },
  { nombre: "IPS Chapinero",    score: 2.8, razon: "3 visitas sin GPS verificado" },
];

const EXPORTES = [
  { id: "rips",       label: "Exportar RIPS Mayo 2025",     icon: FileBarChart },
  { id: "supersalud", label: "Indicadores Supersalud",      icon: Building2    },
  { id: "adres",      label: "Reporte ADRES",               icon: Download     },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ESTADO: Record<string, { bg: string; text: string; icon: any }> = {
  aprobada:  { bg: "bg-emerald-500/10", text: "text-emerald-700", icon: CheckCircle },
  revision:  { bg: "bg-amber-500/10",   text: "text-amber-700",   icon: AlertTriangle },
  rechazada: { bg: "bg-rose-500/10",    text: "text-rose-700",    icon: AlertTriangle },
};

function Stars({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const isFilled = i <= Math.round(score);
        const isHigh = score >= 4;
        const isMed = score >= 3;
        
        let color = "text-slate-200 fill-slate-200";
        if (isFilled) {
          color = isHigh ? "text-amber-400 fill-amber-400" : isMed ? "text-amber-500 fill-amber-500" : "text-rose-500 fill-rose-500";
        }
        
        return <Star key={i} className={`w-3.5 h-3.5 ${color}`} />;
      })}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuditoriaPage() {
  const [exportando, setExportando] = useState<string | null>(null);

  function handleExport(id: string) {
    if (exportando) return;
    setExportando(id);
    setTimeout(() => setExportando(null), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-900">
      <div className="space-y-8 max-w-[1200px] mx-auto">
        
        {/* ── Header ── */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 items-center rounded-full bg-indigo-500/10 px-2.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-500/20">
                EPS Sura
              </span>
              <span className="text-sm font-medium text-slate-500">Mayo 2025</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Auditoría Domiciliaria</h1>
            <p className="text-sm text-slate-500 mt-1">Monitoreo sistémico de servicios y verificación de firmas.</p>
          </div>
          
          <button
            onClick={() => handleExport("rips")}
            disabled={!!exportando}
            className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {exportando === "rips" ? (
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            ) : (
              <Activity className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
            )}
            {exportando === "rips" ? "Procesando matriz..." : "Generar RIPS Central"}
          </button>
        </header>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Cumplimiento GPS/Firma", value: "100%", sub: "Servicios verificados", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Irregularidades Activas", value: "3", sub: "GPS o firma ausente", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", alert: true },
            { label: "Capital Radicado", value: "$18.4M", sub: "COP · Listo para facturar", icon: DollarSign, color: "text-slate-900", bg: "bg-slate-100" },
            { label: "Siniestralidad Extramural", value: "2.1%", sub: "↓ 0.3pp vs Abril", icon: TrendingUp, color: "text-slate-900", bg: "bg-slate-100" }
          ].map((kpi, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              {kpi.alert && <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
                <div className={`flex h-8 w-8 items-center justify-center rounded-md ${kpi.bg}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className={`text-3xl font-semibold tracking-tight ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Table & Scoring Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Table */}
          <div className="lg:col-span-2 rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Estado de Liquidación</h2>
              <span className="text-xs text-slate-400">142 operaciones totales</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 font-medium">Prestador</th>
                    <th className="px-4 py-3 font-medium text-center">Volumen</th>
                    <th className="px-4 py-3 font-medium text-center">Tasa GPS</th>
                    <th className="px-4 py-3 font-medium text-center">Tasa Firma</th>
                    <th className="px-4 py-3 font-medium text-right">Monto</th>
                    <th className="px-5 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PRESTADORES.map((p) => {
                    const est = ESTADO[p.estado];
                    const StateIcon = est.icon;
                    return (
                      <tr key={p.nombre} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3 font-medium text-slate-900">{p.nombre}</td>
                        <td className="px-4 py-3 text-center text-slate-600">{p.servicios}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={p.gps === p.servicios ? "text-slate-900" : "text-rose-600 font-medium"}>
                            {p.gps}/{p.servicios}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={p.firma === p.servicios ? "text-slate-900" : "text-amber-600 font-medium"}>
                            {p.firma}/{p.servicios}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-slate-600">{p.monto}</td>
                        <td className="px-5 py-3">
                          <div className="flex flex-col items-start gap-1">
                            <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${est.bg} ${est.text}`}>
                              <StateIcon className="h-3 w-3" />
                              {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                            </span>
                            {p.razon && <span className="text-[10px] text-slate-400 font-medium tracking-tight">{p.razon}</span>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scoring List */}
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Índice de Confiabilidad</h2>
              <p className="text-xs text-slate-400 mt-0.5">Métrica compuesta de cumplimiento</p>
            </div>
            <div className="p-2 flex-1 overflow-y-auto">
              {SCORING.map((s) => (
                <div key={s.nombre} className="flex items-start justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{s.nombre}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.razon}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold tabular-nums text-slate-900">{s.score}</span>
                    <Stars score={s.score} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Subrutinas de Exportación ── */}
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Módulos de Reporte Regulatorio</h2>
          <div className="flex flex-wrap gap-3">
            {EXPORTES.map((e) => {
              const Icon = e.icon;
              const isProcessing = exportando === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => handleExport(e.id)}
                  disabled={!!exportando}
                  className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  ) : (
                    <Icon className="h-4 w-4 text-slate-400" />
                  )}
                  {e.label}
                  <ChevronRight className="h-3 w-3 text-slate-300 ml-1" />
                </button>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}