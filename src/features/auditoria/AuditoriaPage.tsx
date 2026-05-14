"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle, DollarSign, TrendingUp,
  Star, Download, FileBarChart, Building2, Loader2,
  ChevronRight, Activity, HelpCircle, Users2,
  X, Cpu, ShieldX, Clock
} from "lucide-react";
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
  gps: number;
  firma: number;
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
    servicios: 42, gps: 42, firma: 42,
    cap_aprobado: 7_200_000, cap_cuarentena: 0, cap_rechazado: 0,
    fallos_hardware: 0, fallos_fraude: 0,
    fallos: [],
  },
  {
    nombre: "IPS SurOccidente",
    servicios: 38, gps: 38, firma: 37,
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
    servicios: 28, gps: 25, firma: 28,
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
    servicios: 22, gps: 22, firma: 22,
    cap_aprobado: 3_400_000, cap_cuarentena: 0, cap_rechazado: 0,
    fallos_hardware: 0, fallos_fraude: 0,
    fallos: [],
  },
  {
    nombre: "IPS Neurología",
    servicios: 12, gps: 12, firma: 12,
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

// ─── Tooltip helper (portal — escapa overflow-hidden) ────────────────────────

function Tip({ text, wide }: { text: string; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  function handleEnter() {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ x: r.left + r.width / 2, y: r.top });
    }
  }

  return (
    <div ref={ref} className="inline-flex flex-shrink-0">
      <HelpCircle
        className="w-3.5 h-3.5 text-slate-300 cursor-help hover:text-slate-500 transition-colors"
        onMouseEnter={handleEnter}
        onMouseLeave={() => setPos(null)}
      />
      {pos && createPortal(
        <div
          className={`fixed z-[9999] ${wide ? 'w-72' : 'w-60'} bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl leading-relaxed pointer-events-none`}
          style={{ left: pos.x, top: pos.y - 8, transform: 'translate(-50%, -100%)' }}
        >
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>,
        document.body
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

        {/* ── KPI Cards (4) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* 1. Presupuesto */}
          <div className="relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 border-t-2 border-t-indigo-500">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">Presupuesto</p>
              <Tip text="Porcentaje del presupuesto mensual de atención domiciliaria que ya se ejecutó. Si supera el 90% antes de cerrar el mes, se activa alerta de sobrecosto." wide />
            </div>
            <p className="text-4xl font-bold tabular-nums text-indigo-700 tracking-tight">83%</p>
            <p className="text-xs text-slate-400 mt-1">$18.4M de $22M ejecutados</p>
          </div>

          {/* 2. Servicios pactados vs realizados */}
          <div className="relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 border-t-2 border-t-emerald-500">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">Servicios<br/>pactados vs realizados</p>
              <Tip text="Cuántos servicios se verificaron como prestados vs. los que estaban contratados. Los que faltan están en conciliación o con fallo técnico." wide />
            </div>
            <p className="text-4xl font-bold tabular-nums text-emerald-700 tracking-tight">138/142</p>
            <p className="text-xs text-slate-400 mt-1">97.2% de cumplimiento</p>
          </div>

          {/* 3. % Reingresos */}
          <div className="relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 border-t-2 border-t-amber-400">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">% Reingresos<br/>30 días</p>
              <Tip text="Porcentaje de pacientes que regresaron al hospital dentro de los 30 días posteriores al alta. Si este número baja, el cuidado domiciliario está funcionando. Meta: menos del 10%." wide />
            </div>
            <p className="text-4xl font-bold tabular-nums text-amber-600 tracking-tight">8%</p>
            <p className="text-xs text-slate-400 mt-1">↓ 2pp vs Abril · Meta: &lt;10%</p>
          </div>

          {/* 4. Índice de Confiabilidad */}
          <div className="relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 border-t-2 border-t-slate-400">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">Índice de<br/>confiabilidad</p>
              <Tip text="Puntaje promedio de todos los prestadores activos, de 1 a 5. Se calcula con GPS, firma digital, irregularidades y tiempos de respuesta. Determina prioridad de pago y renovación de contratos." wide />
            </div>
            <p className="text-4xl font-bold tabular-nums text-slate-800 tracking-tight">4.1/5</p>
            <p className="text-xs text-slate-400 mt-1">Promedio red activa · Mayo 2026</p>
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
                    <th className="px-3 py-3 font-medium text-center">
                      <span className="flex items-center justify-center gap-1">GPS <Tip text="Cuántos servicios registraron exitosamente la ubicación del profesional en el domicilio del paciente. Si el número es menor que Ops, hubo visitas donde no se pudo confirmar que el profesional llegó al lugar correcto." wide /></span>
                    </th>
                    <th className="px-3 py-3 font-medium text-center">
                      <span className="flex items-center justify-center gap-1">Firma <Tip text="Cuántos servicios tienen la firma digital del paciente o cuidador como constancia de que la atención fue recibida. Sin firma, el servicio queda en cuarentena hasta conciliación — no puede pagarse directamente." wide /></span>
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
                        <td className="px-3 py-3 text-center tabular-nums">
                          <span className={p.gps === p.servicios ? "text-emerald-700 font-semibold" : "text-rose-600 font-semibold"}>
                            {p.gps}/{p.servicios}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center tabular-nums">
                          <span className={p.firma === p.servicios ? "text-emerald-700 font-semibold" : "text-amber-600 font-semibold"}>
                            {p.firma}/{p.servicios}
                          </span>
                        </td>
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
                    <td className="px-3 py-3 text-center text-xs font-bold tabular-nums text-emerald-700">
                      {PRESTADORES.reduce((s, p) => s + p.gps, 0)}/{TOTAL_OPS}
                    </td>
                    <td className="px-3 py-3 text-center text-xs font-bold tabular-nums text-emerald-700">
                      {PRESTADORES.reduce((s, p) => s + p.firma, 0)}/{TOTAL_OPS}
                    </td>
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

        {/* ── Atenciones efectivas por CUPS ── */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users2 className="h-4 w-4 text-indigo-500" />
              <h2 className="text-base font-semibold text-slate-900">Atenciones efectivas por CUPS</h2>
              <Tip text="Agrupa los servicios por tipo de procedimiento (código CUPS del Ministerio de Salud). Permite detectar qué tipo de atención domiciliaria se está prestando más, cuánto cuesta y si el volumen es coherente con los contratos firmados." wide />
            </div>
            <span className="text-xs text-slate-400">Mayo 2026</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 font-medium">IPS</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="flex items-center gap-1">CUPS <Tip text="Código único del procedimiento según el Ministerio de Salud. Define exactamente qué tipo de servicio se prestó y determina la tarifa oficial de pago." /></span>
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    <span className="flex items-center justify-center gap-1">Atenciones <Tip text="Número de veces que se prestó este servicio en el mes. Si el número es muy alto para una sola IPS, puede indicar sobrefacturación." /></span>
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    <span className="flex items-center justify-end gap-1">Monto total <Tip text="Total facturado por este tipo de servicio en el mes. Se cruza contra las tarifas del contrato para detectar cobros por encima de lo acordado." /></span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CUPS_MEDICOS.map((row) => (
                  <tr key={row.cups} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 text-slate-500">{row.ips}</td>
                    <td className="px-4 py-3 text-slate-700 text-xs font-mono">{row.cups}</td>
                    <td className="px-4 py-3 text-center text-slate-900 font-semibold">{row.atenciones}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-900">{row.monto}</td>
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
