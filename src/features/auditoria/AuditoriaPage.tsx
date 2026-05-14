"use client";

import { useState } from "react";
import {
  CheckCircle, DollarSign, TrendingUp,
  Star, Download, FileBarChart, Building2, Loader2,
  ChevronRight, Activity, HelpCircle, Users2,
  X, Cpu, ShieldX, Clock
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ReferenceLine, ResponsiveContainer,
} from "recharts";

// ─── Comparativo data ─────────────────────────────────────────────────────────

const COMPARATIVO = [
  { mes: "Dic", inversion: 18.2, gasto: 16.8 },
  { mes: "Ene", inversion: 19.0, gasto: 17.4 },
  { mes: "Feb", inversion: 18.5, gasto: 19.1 },
  { mes: "Mar", inversion: 20.0, gasto: 18.3 },
  { mes: "Abr", inversion: 21.0, gasto: 19.7 },
  { mes: "May", inversion: 22.0, gasto: 18.4 },
];
const PRESUPUESTO_LIMITE = 21.5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtM(n: number) {
  return n === 0 ? "—" : `$${(n / 1_000_000).toFixed(1)}M`;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

type Fallo = {
  tipo: "hardware" | "fraude";
  codigo: string;
  descripcion: string;
  motivo: string;
  resolucion: string;
};

type Prestador = {
  nombre: string;
  servicios: number;
  cap_aprobado: number;
  cap_cuarentena: number;
  cap_rechazado: number;
  fallos_hardware: number;
  fallos_fraude: number;
  fallos: Fallo[];
};

const PRESTADORES: Prestador[] = [
  {
    nombre: "IPS Norte",
    servicios: 42,
    cap_aprobado: 7_200_000, cap_cuarentena: 0, cap_rechazado: 0,
    fallos_hardware: 0, fallos_fraude: 0,
    fallos: [],
  },
  {
    nombre: "IPS SurOccidente",
    servicios: 38,
    cap_aprobado: 5_650_000, cap_cuarentena: 150_000, cap_rechazado: 0,
    fallos_hardware: 1, fallos_fraude: 0,
    fallos: [
      {
        tipo: "hardware",
        codigo: "SIGN-TIMEOUT-003",
        descripcion: "Firma digital — timeout de dispositivo",
        motivo: "Batería del tablet agotada durante la sesión de firma",
        resolucion: "Pendiente recaptura en próxima visita",
      },
    ],
  },
  {
    nombre: "IPS Chapinero",
    servicios: 28,
    cap_aprobado: 3_540_000, cap_cuarentena: 360_000, cap_rechazado: 200_000,
    fallos_hardware: 2, fallos_fraude: 1,
    fallos: [
      {
        tipo: "hardware",
        codigo: "GPS-TIMEOUT-011",
        descripcion: "GPS — timeout de red móvil",
        motivo: "Sin cobertura 4G en zona residencial Fontibón durante 42 min",
        resolucion: "Pendiente conciliación con operador de red",
      },
      {
        tipo: "hardware",
        codigo: "GPS-OS-DENIED-014",
        descripcion: "GPS — permiso denegado por SO",
        motivo: "Permisos de ubicación revocados tras actualización de Android 14",
        resolucion: "Requiere reinstalación y re-aceptación de permisos",
      },
      {
        tipo: "fraude",
        codigo: "GPS-SPOOF-007",
        descripcion: "GPS spoofing detectado",
        motivo: "Coordenadas reportadas a 23 km del domicilio registrado del paciente",
        resolucion: "Caso derivado a fiscalía interna · Capital bloqueado",
      },
    ],
  },
  {
    nombre: "IPS Oncología",
    servicios: 22,
    cap_aprobado: 3_400_000, cap_cuarentena: 0, cap_rechazado: 0,
    fallos_hardware: 0, fallos_fraude: 0,
    fallos: [],
  },
  {
    nombre: "IPS Neurología",
    servicios: 12,
    cap_aprobado: 1_900_000, cap_cuarentena: 0, cap_rechazado: 0,
    fallos_hardware: 0, fallos_fraude: 0,
    fallos: [],
  },
];

// Totales derivados
const TOTAL_OPS        = PRESTADORES.reduce((s, p) => s + p.servicios, 0);
const TOTAL_FALLOS_HW  = PRESTADORES.reduce((s, p) => s + p.fallos_hardware, 0);
const TOTAL_FRAUDE     = PRESTADORES.reduce((s, p) => s + p.fallos_fraude, 0);
const TOTAL_FALLOS     = TOTAL_FALLOS_HW + TOTAL_FRAUDE;
const YIELD_REAL       = (((TOTAL_OPS - TOTAL_FALLOS) / TOTAL_OPS) * 100).toFixed(1);
const TOTAL_APROBADO   = PRESTADORES.reduce((s, p) => s + p.cap_aprobado, 0);
const TOTAL_CUARENTENA = PRESTADORES.reduce((s, p) => s + p.cap_cuarentena, 0);
const TOTAL_RECHAZADO  = PRESTADORES.reduce((s, p) => s + p.cap_rechazado, 0);

const SCORING = [
  { nombre: "IPS Norte",        score: 4.8, razon: "GPS 100%, satisfacción alta" },
  { nombre: "IPS Oncología",    score: 4.7, razon: "Sin irregularidades" },
  { nombre: "IPS Neurología",   score: 4.5, razon: "Cumplimiento total" },
  { nombre: "IPS SurOccidente", score: 3.9, razon: "1 firma pendiente de conciliación" },
  { nombre: "IPS Chapinero",    score: 2.8, razon: "2 fallos hardware + 1 fraude detectado" },
];

const CUPS_MEDICOS = [
  { medico: "Sandra Muñoz",          ips: "IPS Norte",        cups: "890201 — Enfermería domiciliaria",    atenciones: 42, monto: "$3.8M", gps_pct: 100 },
  { medico: "Diana Roa",             ips: "IPS SurOccidente", cups: "930101 — Fisioterapia respiratoria",  atenciones: 38, monto: "$2.9M", gps_pct: 100 },
  { medico: "Jorge Leal",            ips: "IPS Chapinero",    cups: "890301 — Curación pie diabético",     atenciones: 28, monto: "$1.6M", gps_pct: 89  },
  { medico: "Dr. Andrés Ospina",     ips: "IPS Norte",        cups: "890101 — Cardiología domiciliaria",   atenciones: 22, monto: "$4.1M", gps_pct: 100 },
  { medico: "Dra. Claudia Restrepo", ips: "IPS SurOccidente", cups: "890102 — Neumología domiciliaria",    atenciones: 12, monto: "$2.3M", gps_pct: 100 },
];

const EXPORTES = [
  { id: "supersalud", label: "Indicadores Supersalud",   icon: Building2    },
  { id: "adres",      label: "Reporte ADRES",            icon: Download     },
];

// ─── Tooltip helper ───────────────────────────────────────────────────────────

function Tip({ text, wide }: { text: string; wide?: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex flex-shrink-0">
      <HelpCircle
        className="w-3.5 h-3.5 text-slate-300 cursor-help hover:text-slate-500 transition-colors"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 ${wide ? 'w-72' : 'w-60'} bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl z-50 leading-relaxed pointer-events-none`}>
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stars({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(score);
        const color = filled
          ? score >= 4 ? "text-amber-400 fill-amber-400"
          : score >= 3 ? "text-amber-500 fill-amber-500"
          : "text-rose-500 fill-rose-500"
          : "text-slate-200 fill-slate-200";
        return <Star key={i} className={`w-3.5 h-3.5 ${color}`} />;
      })}
    </div>
  );
}

function CapitalCell({ value, variant }: { value: number; variant: "aprobado" | "cuarentena" | "rechazado" }) {
  if (value === 0) return <span className="text-slate-300 tabular-nums">—</span>;
  const styles = {
    aprobado:   "text-emerald-700 font-semibold",
    cuarentena: "text-amber-700  font-semibold",
    rechazado:  "text-rose-700   font-semibold",
  };
  return <span className={`tabular-nums ${styles[variant]}`}>{fmtM(value)}</span>;
}

// ─── Fallo Modal ──────────────────────────────────────────────────────────────

function FalloModal({ prestador, onClose }: { prestador: Prestador; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Detalle de fallos</p>
            <h3 className="text-base font-semibold text-slate-900">{prestador.nombre}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
          <div className="px-5 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Aprobado</p>
            <p className="text-sm font-bold text-emerald-700">{fmtM(prestador.cap_aprobado)}</p>
          </div>
          <div className="px-5 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Cuarentena</p>
            <p className="text-sm font-bold text-amber-700">{fmtM(prestador.cap_cuarentena)}</p>
          </div>
          <div className="px-5 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Rechazado</p>
            <p className="text-sm font-bold text-rose-700">{fmtM(prestador.cap_rechazado)}</p>
          </div>
        </div>

        {/* Fallos list */}
        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {prestador.fallos.map((f) => (
            <div key={f.codigo} className="px-6 py-4">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${
                  f.tipo === "hardware" ? "bg-slate-100" : "bg-rose-50"
                }`}>
                  {f.tipo === "hardware"
                    ? <Cpu className="w-3.5 h-3.5 text-slate-600" />
                    : <ShieldX className="w-3.5 h-3.5 text-rose-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      f.tipo === "hardware" ? "bg-slate-100 text-slate-600" : "bg-rose-100 text-rose-700"
                    }`}>
                      {f.tipo === "hardware" ? "Hardware / Red" : "Fraude clínico"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{f.codigo}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mb-0.5">{f.descripcion}</p>
                  <p className="text-xs text-slate-500 mb-1">{f.motivo}</p>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <p className="text-[11px] text-slate-400 italic">{f.resolucion}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuditoriaPage() {
  const [exportando, setExportando]           = useState<string | null>(null);
  const [tooltipKpi, setTooltipKpi]           = useState<string | null>(null);
  const [falloModal, setFalloModal]           = useState<Prestador | null>(null);

  function handleExport(id: string) {
    if (exportando) return;
    setExportando(id);
    setTimeout(() => setExportando(null), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-6 font-sans text-slate-900">
      <div className="space-y-8 max-w-[1200px] mx-auto">

        {/* ── Header ── */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 items-center rounded-full bg-indigo-500/10 px-2.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-500/20">
                EPS Sura
              </span>
              <span className="text-sm font-medium text-slate-500">Mayo 2026</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-slate-900">Auditoría Domiciliaria</h1>
            <p className="text-sm text-slate-500 mt-1">
              {TOTAL_OPS} operaciones auditadas · {TOTAL_FALLOS} con fallo registrado · Conciliación financiera activa.
            </p>
          </div>
          
        </header>

        {/* ── KPI Cards (5) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

          {/* 1. Yield Real */}
          <div className="lg:col-span-1 relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 border-t-2 border-t-indigo-500">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">Yield real<br/>de operación</p>
              <div className="relative flex-shrink-0">
                <HelpCircle
                  className="w-3.5 h-3.5 text-slate-300 cursor-help hover:text-slate-500 transition-colors"
                  onMouseEnter={() => setTooltipKpi("yield")}
                  onMouseLeave={() => setTooltipKpi(null)}
                />
                {tooltipKpi === "yield" && (
                  <div className="absolute bottom-full right-0 mb-2 w-56 bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl z-50 leading-relaxed pointer-events-none">
                    Operaciones limpias ÷ total. Excluye fallos hardware y fraude. Base matemática para el SLA con prestadores.
                    <div className="absolute top-full right-2 border-4 border-transparent border-t-slate-900" />
                  </div>
                )}
              </div>
            </div>
            <p className="text-4xl font-bold tabular-nums text-indigo-700 tracking-tight">{YIELD_REAL}%</p>
            <p className="text-xs text-slate-400 mt-1">{TOTAL_OPS - TOTAL_FALLOS}/{TOTAL_OPS} ops verificadas</p>
          </div>

          {/* 2. Fallos Hardware */}
          <div className="lg:col-span-1 relative rounded-xl bg-slate-800 p-5 shadow-sm border-t-2 border-t-slate-600">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-tight">Fallos de<br/>hardware / red</p>
              <div className="flex items-center gap-1.5">
                <Tip text="Errores técnicos del dispositivo del profesional: GPS timeout (sin señal), OS denied (permisos revocados), batería agotada. No implican intención de fraude — van a cuarentena para conciliación con el prestador." wide />
                <Cpu className="w-4 h-4 text-slate-500 flex-shrink-0" />
              </div>
            </div>
            <p className="text-4xl font-bold tabular-nums text-slate-100 tracking-tight">{TOTAL_FALLOS_HW}</p>
            <p className="text-xs text-slate-500 mt-1">Timeout · OS denied · Sin señal</p>
          </div>

          {/* 3. Fraude Clínico */}
          <div className="lg:col-span-1 relative rounded-xl bg-rose-950 p-5 shadow-sm border-t-2 border-t-rose-700">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-bold text-rose-400 uppercase tracking-widest leading-tight">Alertas de<br/>fraude clínico</p>
              <div className="flex items-center gap-1.5">
                <Tip text="Servicios donde la evidencia indica intención de fraude: GPS spoofing (coordenadas falsificadas), visita fantasma (coordenadas a más de 500m del domicilio), o servicios simultáneos del mismo profesional. El capital va a rechazo definitivo." wide />
                <ShieldX className="w-4 h-4 text-rose-600 flex-shrink-0" />
              </div>
            </div>
            <p className="text-4xl font-bold tabular-nums text-rose-200 tracking-tight">{TOTAL_FRAUDE}</p>
            <p className="text-xs text-rose-700 mt-1">GPS spoofing · Visita fantasma</p>
          </div>

          {/* 4. Capital Radicado */}
          <div className="lg:col-span-1 relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">Capital<br/>radicado</p>
              <div className="relative flex-shrink-0">
                <HelpCircle
                  className="w-3.5 h-3.5 text-slate-300 cursor-help hover:text-slate-500 transition-colors"
                  onMouseEnter={() => setTooltipKpi("capital")}
                  onMouseLeave={() => setTooltipKpi(null)}
                />
                {tooltipKpi === "capital" && (
                  <div className="absolute bottom-full right-0 mb-2 w-56 bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl z-50 leading-relaxed pointer-events-none">
                    Monto total COP presentado para facturación. Incluye aprobado + cuarentena. Capital rechazado no se radica.
                    <div className="absolute top-full right-2 border-4 border-transparent border-t-slate-900" />
                  </div>
                )}
              </div>
            </div>
            <p className="text-3xl font-bold tabular-nums text-slate-900 tracking-tight">
              {fmtM(TOTAL_APROBADO + TOTAL_CUARENTENA)}
            </p>
            <p className="text-xs text-slate-400 mt-1">{fmtM(TOTAL_RECHAZADO)} bloqueado</p>
          </div>

          {/* 5. Siniestralidad */}
          <div className="lg:col-span-1 relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">Siniestralidad<br/>extramural</p>
              <div className="relative flex-shrink-0">
                <HelpCircle
                  className="w-3.5 h-3.5 text-slate-300 cursor-help hover:text-slate-500 transition-colors"
                  onMouseEnter={() => setTooltipKpi("siniest")}
                  onMouseLeave={() => setTooltipKpi(null)}
                />
                {tooltipKpi === "siniest" && (
                  <div className="absolute bottom-full right-0 mb-2 w-56 bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl z-50 leading-relaxed pointer-events-none">
                    Gasto real domiciliario vs presupuesto contratado. Meta EPS Sura: ≤ 2.5%.
                    <div className="absolute top-full right-2 border-4 border-transparent border-t-slate-900" />
                  </div>
                )}
              </div>
            </div>
            <p className="text-3xl font-bold tabular-nums text-slate-900 tracking-tight">2.1%</p>
            <p className="text-xs text-slate-400 mt-1">↓ 0.3pp vs Abril · Meta: ≤2.5%</p>
          </div>

        </div>

        {/* ── Comparativo inversión vs gasto ── */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-semibold text-slate-900">Inversión contratada vs. Gasto real</h2>
                <Tip text="Inversión contratada: valor pactado en el contrato con cada prestador por mes. Gasto real: lo que efectivamente se ejecutó y auditó. La línea roja es el techo presupuestal ($21.5M COP). El triángulo ▲ indica mes donde el gasto superó la inversión." wide />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Millones COP · Dic 2025 – May 2026</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ahorro acumulado</p>
              <p className="text-lg font-bold text-emerald-600">$9.4M COP</p>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={COMPARATIVO} margin={{ top: 8, right: 16, left: -8, bottom: 4 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="M" domain={[14, 24]} />
                <RechartsTooltip
                  formatter={(v: number | undefined) => v !== undefined ? [`$${v}M COP`] : ['']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <ReferenceLine y={PRESUPUESTO_LIMITE} stroke="#f43f5e" strokeDasharray="4 4"
                  label={{ value: 'Límite presup.', fill: '#f43f5e', fontSize: 10, position: 'right' }} />
                <Bar dataKey="inversion" name="Inversión contratada" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gasto" name="Gasto real" fill="#10b981" radius={[4, 4, 0, 0]}
                  label={(props: any) => {
                    const { x, y, width, value, index } = props;
                    return value > COMPARATIVO[index].inversion
                      ? <text x={x + width / 2} y={y - 4} fill="#f43f5e" fontSize={9} textAnchor="middle" fontWeight={700}>▲</text>
                      : null;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Tabla de Liquidación + Scoring ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Tabla */}
          <div className="lg:col-span-2 rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Estado de Liquidación</h2>
                <p className="text-xs text-slate-400 mt-0.5">Capital dividido por estado de conciliación</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                <span className="text-emerald-700">■ Aprobado</span>
                <span className="text-amber-600">■ Cuarentena</span>
                <span className="text-rose-600">■ Rechazado</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 font-medium">Prestador</th>
                    <th className="px-3 py-3 font-medium text-center">
                      <span className="flex items-center justify-center gap-1">Ops <Tip text="Total de servicios domiciliarios facturados por esta IPS en el período." /></span>
                    </th>
                    <th className="px-3 py-3 font-medium text-right">
                      <span className="flex items-center justify-end gap-1">Capital aprobado <Tip text="Servicios con GPS verificado + firma digital + nota clínica completa. Listos para pago sin glosa." /></span>
                    </th>
                    <th className="px-3 py-3 font-medium text-right">
                      <span className="flex items-center justify-end gap-1">En cuarentena <Tip text="Servicios con fallo técnico (hardware o red) que impidió capturar evidencia. Están en proceso de conciliación con el prestador antes de decidir pago." wide /></span>
                    </th>
                    <th className="px-3 py-3 font-medium text-right">
                      <span className="flex items-center justify-end gap-1">Rechazado <Tip text="Servicios con fraude comprobado (GPS spoofing, visita fantasma). El capital queda bloqueado y el caso se deriva a fiscalía interna." wide /></span>
                    </th>
                    <th className="px-4 py-3 font-medium text-center">
                      <span className="flex items-center justify-center gap-1">Fallos <Tip text="Chip gris = fallo de hardware/red (conciliable). Chip rojo = fraude clínico (rechazo definitivo)." /></span>
                    </th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PRESTADORES.map((p) => {
                    const tienefallos = p.fallos.length > 0;
                    return (
                      <tr key={p.nombre} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-5 py-3 font-medium text-slate-900 whitespace-nowrap">{p.nombre}</td>
                        <td className="px-3 py-3 text-center text-slate-500 tabular-nums">{p.servicios}</td>
                        <td className="px-3 py-3 text-right">
                          <CapitalCell value={p.cap_aprobado} variant="aprobado" />
                        </td>
                        <td className="px-3 py-3 text-right">
                          <CapitalCell value={p.cap_cuarentena} variant="cuarentena" />
                          {p.cap_cuarentena > 0 && (
                            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Pendiente conciliación</p>
                          )}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <CapitalCell value={p.cap_rechazado} variant="rechazado" />
                          {p.cap_rechazado > 0 && (
                            <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Fraude comprobado</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {tienefallos ? (
                            <div className="flex items-center justify-center gap-1.5">
                              {p.fallos_hardware > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                                  <Cpu className="w-2.5 h-2.5" />{p.fallos_hardware}
                                </span>
                              )}
                              {p.fallos_fraude > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                                  <ShieldX className="w-2.5 h-2.5" />{p.fallos_fraude}
                                </span>
                              )}
                            </div>
                          ) : (
                            <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {tienefallos ? (
                            <button
                              onClick={() => setFalloModal(p)}
                              className="whitespace-nowrap text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                            >
                              Ver detalles →
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Totales */}
                <tfoot className="bg-slate-50/80 border-t-2 border-slate-200">
                  <tr>
                    <td className="px-5 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">Total</td>
                    <td className="px-3 py-3 text-center text-xs font-bold tabular-nums text-slate-700">{TOTAL_OPS}</td>
                    <td className="px-3 py-3 text-right text-xs font-bold text-emerald-700 tabular-nums">{fmtM(TOTAL_APROBADO)}</td>
                    <td className="px-3 py-3 text-right text-xs font-bold text-amber-700 tabular-nums">{fmtM(TOTAL_CUARENTENA)}</td>
                    <td className="px-3 py-3 text-right text-xs font-bold text-rose-700 tabular-nums">{fmtM(TOTAL_RECHAZADO)}</td>
                    <td colSpan={2} className="px-4 py-3 text-xs text-slate-400">{TOTAL_FALLOS} fallos registrados</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Scoring */}
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-semibold text-slate-900">Índice de Confiabilidad</h2>
                <Tip text="Puntaje de 1 a 5 calculado automáticamente por OLGA según: tasa GPS, tasa firma, irregularidades históricas y tiempos de respuesta. Determina la prioridad de pago y la elegibilidad de nuevos contratos." wide />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Métrica compuesta de cumplimiento</p>
            </div>
            <div className="p-2 flex-1 overflow-y-auto">
              {SCORING.map((s) => (
                <div key={s.nombre} className="flex items-start justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{s.nombre}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.razon}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                    <span className="text-sm font-semibold tabular-nums text-slate-900">{s.score}</span>
                    <Stars score={s.score} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CUPS por profesional ── */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users2 className="h-4 w-4 text-indigo-500" />
              <h2 className="text-base font-semibold text-slate-900">Atenciones efectivas por profesional</h2>
              <Tip text="Desglose de servicios por profesional con su código CUPS (Clasificación Única de Procedimientos en Salud). Permite detectar concentración de servicios en un solo profesional, patrón de facturación inusual o profesionales con bajo cumplimiento GPS." wide />
            </div>
            <span className="text-xs text-slate-400">Mayo 2026 · CUPS verificados</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 font-medium">Médico / Profesional</th>
                  <th className="px-4 py-3 font-medium">IPS</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="flex items-center gap-1">CUPS principal <Tip text="Código CUPS: identificador único del tipo de procedimiento según el Ministerio de Salud. Base para tarifación y glosas en el sistema de salud colombiano." /></span>
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    <span className="flex items-center justify-center gap-1">Atenciones <Tip text="Número de visitas domiciliarias facturadas por este profesional en el mes bajo este CUPS." /></span>
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    <span className="flex items-center justify-end gap-1">Monto total <Tip text="Valor total facturado por este profesional en el período. Se cruza contra el contrato de la IPS para detectar sobrefacturación." /></span>
                  </th>
                  <th className="px-5 py-3 font-medium text-center">
                    <span className="flex items-center justify-center gap-1">% GPS <Tip text="Porcentaje de visitas de este profesional donde el GPS fue verificado exitosamente. Verde = 100%. Ámbar = fallos técnicos pendientes." /></span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CUPS_MEDICOS.map((row) => (
                  <tr key={row.medico} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-900">{row.medico}</td>
                    <td className="px-4 py-3 text-slate-500">{row.ips}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-mono">{row.cups}</td>
                    <td className="px-4 py-3 text-center text-slate-700 font-semibold">{row.atenciones}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-600">{row.monto}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${
                        row.gps_pct === 100 ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"
                      }`}>
                        {row.gps_pct === 100 ? <CheckCircle className="h-3 w-3" /> : <Cpu className="h-3 w-3" />}
                        {row.gps_pct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Exportación ── */}
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-1.5 mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Módulos de Reporte Regulatorio</h2>
            <Tip text="Exportaciones a los entes reguladores del sistema de salud colombiano. RIPS: Registro Individual de Prestación de Servicios (obligatorio para el Ministerio de Salud). Supersalud: ente de control y vigilancia. ADRES: Administradora de los Recursos del Sistema General de Seguridad Social." wide />
          </div>
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
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : <Icon className="h-4 w-4 text-slate-400" />}
                  {e.label}
                  <ChevronRight className="h-3 w-3 text-slate-300 ml-1" />
                </button>
              );
            })}
          </div>
        </section>

      </div>

      {/* ── Fallo Modal ── */}
      {falloModal && <FalloModal prestador={falloModal} onClose={() => setFalloModal(null)} />}
    </div>
  );
}
