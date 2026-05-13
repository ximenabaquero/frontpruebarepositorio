"use client";

import { useState } from "react";
import {
  CheckCircle, AlertTriangle, DollarSign, TrendingUp,
  Star, Download, FileBarChart, Building2, Loader2,
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
  { id: "rips",      label: "Exportar RIPS Mayo 2025",    icon: FileBarChart, color: "emerald" },
  { id: "supersalud",label: "Indicadores Supersalud",     icon: Building2,    color: "blue"    },
  { id: "adres",     label: "Reporte ADRES",              icon: Download,     color: "violet"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ESTADO: Record<string, { bg: string; text: string; border: string; label: string }> = {
  aprobada:  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Aprobada" },
  revision:  { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   label: "Revisar" },
  rechazada: { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     label: "Rechazada" },
};

function Stars({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= Math.round(score)
              ? score >= 4 ? "text-amber-400 fill-amber-400"
                : score >= 3 ? "text-amber-300 fill-amber-300"
                : "text-red-400 fill-red-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuditoriaPage() {
  const [exportando, setExportando] = useState<string | null>(null);

  function handleExport(id: string) {
    setExportando(id);
    setTimeout(() => setExportando(null), 2500);
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">

      {/* ── Encabezado ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auditoría y reportes</h1>
          <p className="text-sm text-gray-500 mt-0.5">EPS Sura · Verificación de servicios domiciliarios</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
            📅 Mayo 2025
          </span>
          <button
            onClick={() => handleExport("rips")}
            className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-xl transition-all"
            style={{ background: "#0FB888" }}
          >
            {exportando === "rips" ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generando...</>
            ) : (
              <><Download className="w-4 h-4" /> Exportar RIPS</>
            )}
          </button>
        </div>
      </div>

      {/* ── Sección 1: 4 KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-600">100%</p>
          <p className="text-sm text-gray-600 mt-1 leading-tight">Servicios con GPS + firma verificados</p>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-emerald-500 w-full" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-red-200 p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-black text-red-600">3</p>
          <p className="text-sm text-gray-600 mt-1 leading-tight">Visitas con irregularidades detectadas</p>
          <p className="text-xs text-red-500 font-semibold mt-2">GPS fuera de rango o firma ausente</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-violet-600" />
          </div>
          <p className="text-3xl font-black text-gray-900">$18.4M</p>
          <p className="text-xs text-gray-400 font-medium">COP</p>
          <p className="text-sm text-gray-600 mt-1 leading-tight">Listo para facturar</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-gray-900">2.1%</p>
          <p className="text-sm text-gray-600 mt-1 leading-tight">Siniestralidad extramural del mes</p>
          <p className="text-xs text-emerald-600 font-semibold mt-2">↓ 0.3pp vs abril</p>
        </div>
      </div>

      {/* ── Sección 2: Tabla de prestadores ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Estado de cuentas por prestador</h2>
          <p className="text-xs text-gray-400 mt-0.5">142 servicios ejecutados · Mayo 2025</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Prestador</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Servicios</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">GPS ✅</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Firma ✅</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Monto radicado</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PRESTADORES.map((p) => {
                const est = ESTADO[p.estado];
                const rowBg = p.estado === "rechazada" ? "bg-red-50/30" : p.estado === "revision" ? "bg-amber-50/30" : "";
                return (
                  <tr key={p.nombre} className={`${rowBg} hover:bg-gray-50/60 transition-colors`}>
                    <td className="px-5 py-4 font-semibold text-gray-900">{p.nombre}</td>
                    <td className="px-4 py-4 text-center font-bold text-gray-900">{p.servicios}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`font-bold ${p.gps === p.servicios ? "text-emerald-600" : "text-red-600"}`}>
                        {p.gps} {p.gps < p.servicios && <span className="text-xs text-red-500">({p.servicios - p.gps} sin GPS)</span>}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`font-bold ${p.firma === p.servicios ? "text-emerald-600" : "text-amber-600"}`}>
                        {p.firma} {p.firma < p.servicios && <span className="text-xs text-amber-500">({p.servicios - p.firma} sin firma)</span>}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-gray-900">{p.monto} COP</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${est.bg} ${est.text} ${est.border}`}>
                        {p.estado === "aprobada" && <CheckCircle className="w-3 h-3" />}
                        {p.estado === "revision" && <AlertTriangle className="w-3 h-3" />}
                        {p.estado === "rechazada" && <AlertTriangle className="w-3 h-3" />}
                        {est.label}
                        {p.razon && <span className="opacity-70">· {p.razon}</span>}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Sección 3: Scoring ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Scoring de prestadores</h2>
          <p className="text-xs text-gray-400 mt-0.5">Calificación basada en GPS, firma y cumplimiento</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SCORING.map((s) => {
            const color = s.score >= 4.5 ? "emerald" : s.score >= 3.5 ? "amber" : "red";
            const colors: Record<string, string> = {
              emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
              amber:   "bg-amber-50 border-amber-200 text-amber-700",
              red:     "bg-red-50 border-red-200 text-red-700",
            };
            const scoreColors: Record<string, string> = {
              emerald: "text-emerald-600",
              amber:   "text-amber-600",
              red:     "text-red-600",
            };
            return (
              <div key={s.nombre} className={`rounded-2xl border p-4 flex flex-col gap-2 ${colors[color]}`}>
                <p className="text-sm font-bold text-gray-900">{s.nombre}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-black ${scoreColors[color]}`}>★ {s.score}</span>
                </div>
                <Stars score={s.score} />
                <p className="text-xs text-gray-500 leading-snug">{s.razon}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Sección 4: Exportes regulatorios ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Exportes regulatorios</h2>
          <p className="text-xs text-gray-400 mt-0.5">Reportes requeridos por entes de control · Mayo 2025</p>
        </div>
        <div className="p-6 flex flex-wrap gap-4">
          {EXPORTES.map((e) => {
            const Icon = e.icon;
            const isLoading = exportando === e.id;
            const btnColors: Record<string, string> = {
              emerald: "bg-emerald-600 hover:bg-emerald-700",
              blue:    "bg-blue-600 hover:bg-blue-700",
              violet:  "bg-violet-600 hover:bg-violet-700",
            };
            return (
              <button
                key={e.id}
                onClick={() => handleExport(e.id)}
                disabled={!!exportando}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all shadow-sm disabled:opacity-60 ${btnColors[e.color]}`}
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generando reporte...</>
                ) : (
                  <><Icon className="w-4 h-4" /> {e.label}</>
                )}
              </button>
            );
          })}
        </div>
        {exportando && (
          <div className="mx-6 mb-6 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-sm text-emerald-700 font-semibold">
              ⏳ Generando reporte... Este proceso puede tardar unos segundos.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
