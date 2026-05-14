"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Users,
  FileText,
  ChevronRight,
  ArrowUpRight,
  LucideIcon,
  Activity,
  CheckCircle,
  ShieldAlert,
  Zap,
  HelpCircle,
} from "lucide-react";

// --- DATA (Preservada íntegramente) ---
const ALERTS = [
  { id: 1, patient: "Carlos Mendoza R.", msg: "Sin visita confirmada en 48h · GPS error", level: "critical" },
  { id: 2, patient: "María F. Gómez", msg: "SpO₂ 88% registrado · requiere revisión", level: "critical" },
  { id: 3, patient: "Jorge Andrés Palacio", msg: "Medicamento no dispensado · falta firma", level: "warning" },
  { id: 4, patient: "Ana Lucía Torres", msg: "Visita reportada pero sin verificación", level: "warning" },
  { id: 5, patient: "Roberto Silva Montoya", msg: "Signos no registrados en 24h", level: "warning" },
];

const REQUESTS = [
  { patient: "Luis Ángel Mora", service: "PHD", date: "9:00 AM" },
  { patient: "Gloria Inés Castro", service: "Curaciones", date: "10:30 AM" },
  { patient: "Ramiro Suárez B.", service: "Rehabilitación", date: "11:00 AM" },
  { patient: "Patricia Vega R.", service: "Medicamento", date: "2:00 PM" },
];

// --- COMPONENTS ---
const MiniKpi = ({ title, value, icon: Icon, color, bg, tooltip }: { title: string, value: string, icon: LucideIcon, color: string, bg: string, tooltip?: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-tight">{title}</p>
          {tooltip && (
            <div className="relative flex-shrink-0">
              <HelpCircle
                className="w-3.5 h-3.5 text-slate-300 cursor-help hover:text-slate-500 transition-colors"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
              />
              {show && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl z-50 leading-relaxed pointer-events-none">
                  {tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
              )}
            </div>
          )}
        </div>
        <div className={`flex h-8 w-8 items-center justify-center rounded-md ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </div>
      <div className="mt-4">
        <p className={`text-3xl font-semibold tracking-tight text-slate-900`}>{value}</p>
      </div>
    </div>
  );
};

export default function DashboardCompacto() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 antialiased">
      <main className="w-full max-w-[100vw] mx-auto p-4 lg:p-8 space-y-8">
        
        {/* Header Institucional */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 items-center rounded-full bg-indigo-500/10 px-2.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-500/20">
                EPS Sura Operaciones
              </span>
              <span className="text-sm font-medium text-slate-500">Mayo 2026</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Consola OLGA HealthTech</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estado de Red</p>
                <p className="text-sm font-medium text-emerald-600 flex items-center gap-1 justify-end">
                   <Activity size={14} /> Sistema Nominal
                </p>
             </div>
          </div>
        </header>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniKpi title="Pacientes activos" value="47" icon={Users} color="text-indigo-600" bg="bg-indigo-50"
            tooltip="Total de afiliados con plan domiciliario autorizado y activo en la red de prestadores." />
          <MiniKpi title="Alertas críticas" value="05" icon={ShieldAlert} color="text-rose-600" bg="bg-rose-50"
            tooltip="Pacientes con visita no confirmada en 48h o signos vitales fuera de rango. Requieren intervención inmediata." />
          <MiniKpi title="Por autorizar" value="08" icon={FileText} color="text-amber-600" bg="bg-amber-50"
            tooltip="Solicitudes de autorización pendientes de revisión. Incluye PHD, PAD, PARD y curaciones en casa." />
          <MiniKpi title="Ejecución mes" value="80%" icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50"
            tooltip="Porcentaje de servicios programados ejecutados y verificados con GPS + firma digital en el mes." />
        </div>

        {/* SECCIONES: 75% / 25% */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* COLUMNA ALERTAS (MODIFICADA PARA MÁS URGENCIA) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                </span>
                Atención Prioritaria
              </h2>
              <div className="flex items-center gap-2">
                <span className="animate-pulse flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded border border-rose-100">
                  <Zap size={10} fill="currentColor" /> ACCIÓN REQUERIDA
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              {ALERTS.map((alert) => (
                <Link 
                  key={alert.id}
                  href={`/pacientes/${alert.id}`}
                  className={`group flex items-center justify-between p-4 transition-all duration-200 shadow-sm border-l-4 rounded-r-xl rounded-l-sm
                    ${alert.level === 'critical' 
                      ? 'bg-rose-50/40 border-l-rose-600 hover:bg-rose-50 ring-1 ring-rose-200' 
                      : 'bg-white border-l-amber-500 hover:bg-slate-50 ring-1 ring-slate-200'}`}
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center 
                      ${alert.level === 'critical' ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500/10 text-amber-700'}`}>
                      <AlertTriangle className={alert.level === 'critical' ? "w-6 h-6" : "w-5 h-5"} />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <p className={`text-base font-bold ${alert.level === 'critical' ? 'text-rose-900' : 'text-slate-900'}`}>
                          {alert.patient}
                        </p>
                        {alert.level === 'critical' && (
                          <span className="text-[9px] font-black bg-rose-600 text-white px-1.5 py-0.5 rounded uppercase">Alta Prioridad</span>
                        )}
                      </div>
                      <p className={`text-sm font-medium ${alert.level === 'critical' ? 'text-rose-700/80' : 'text-slate-500'}`}>
                        {alert.msg}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className={`hidden md:block text-[10px] font-black uppercase tracking-widest 
                      ${alert.level === 'critical' ? 'text-rose-600' : 'text-slate-400'}`}> Intervenir </span>
                    <ChevronRight className={`w-5 h-5 ${alert.level === 'critical' ? 'text-rose-400' : 'text-slate-300'} group-hover:translate-x-1 transition-all`} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* COLUMNA SOLICITUDES (1/4) - Preservada */}
          <div className="space-y-4">
            <div className="px-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Solicitudes</h2>
            </div>

            <div className="bg-white ring-1 ring-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full border-t-2 border-t-indigo-500">
              <div className="p-4 space-y-3 flex-1">
                {REQUESTS.map((req, i) => (
                  <div key={i} className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-100 group hover:bg-white hover:border-indigo-200 transition-all cursor-default">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold text-slate-900 leading-tight">{req.patient}</p>
                      <span className="text-[9px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-100">{req.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">{req.service}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button className="w-full py-3 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 uppercase tracking-[0.1em]">
                  Autorizar Lote <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Minimalista */}
        <footer className="pt-8 flex flex-col md:flex-row justify-between items-center border-t border-slate-200 gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 OLGA Healthtech · Infraestructura Sura</p>
          <div className="flex gap-6 text-[10px] font-bold text-slate-400 tracking-widest">
            <button className="hover:text-indigo-600 transition-colors uppercase">Consola de Red</button>
            <button className="hover:text-indigo-600 transition-colors uppercase">Protocolos de Seguridad</button>
          </div>
        </footer>
      </main>
    </div>
  );
}