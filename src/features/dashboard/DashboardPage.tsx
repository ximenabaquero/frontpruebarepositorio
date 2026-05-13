"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Users,
  FileText,
  ChevronRight,
  ArrowUpRight,
  LucideIcon,
} from "lucide-react";

// --- DATA ---
const ALERTS = [
  { id: 1, patient: "Carlos Mendoza R.", msg: "Sin visita confirmada en 48h · GPS error", level: "critical" },
  { id: 2, patient: "María F. Gómez", msg: "SpO₂ 88% registrado · requiere revisión", level: "critical" },
  { id: 3, patient: "Ana Lucía Torres", msg: "Medicamento no dispensado · falta firma", level: "warning" },
  { id: 4, patient: "Roberto Silva M.", msg: "Visita reportada pero sin verificación", level: "warning" },
  { id: 5, patient: "Claudia Peña V.", msg: "Signos no registrados en 24h", level: "warning" },
];

const REQUESTS = [
  { patient: "Luis Ángel Mora", service: "PHD", date: "9:00 AM" },
  { patient: "Gloria Inés Castro", service: "Curaciones", date: "10:30 AM" },
  { patient: "Ramiro Suárez B.", service: "Rehabilitación", date: "11:00 AM" },
  { patient: "Patricia Vega R.", service: "Medicamento", date: "2:00 PM" },
];

// --- COMPONENTS ---
const MiniKpi = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: LucideIcon, color: string }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5 w-full">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
  </div>
);

export default function DashboardCompacto() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 antialiased">
      {/* Eliminado max-w-7xl para usar todo el ancho disponible */}
      <main className="w-full max-w-[100vw] mx-auto p-4 lg:p-8 space-y-8">

        {/* KPI GRID - Ahora con más presencia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MiniKpi title="Pacientes activos" value="47" icon={Users} color="bg-blue-50 text-blue-600" />
          <MiniKpi title="Alertas críticas" value="05" icon={AlertTriangle} color="bg-red-50 text-red-600" />
          <MiniKpi title="Por autorizar" value="08" icon={FileText} color="bg-amber-50 text-amber-600" />
          <MiniKpi title="Ejecución mes" value="80%" icon={ArrowUpRight} color="bg-emerald-50 text-emerald-600" />
        </div>

        {/* SECCIONES: Alertas ocupa el 75% y Solicitudes el 25% del ancho total */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* COLUMNA ALERTAS (Ocupa 3 de 4 columnas) */}
          <div className="lg:col-span-3 space-y-4 text-left">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                Panel de Alertas Clínicas
              </h2>
              <span className="text-xs font-bold text-gray-400">MONITOREO EN TIEMPO REAL</span>
            </div>

            <div className="grid gap-3">
              {ALERTS.map((alert) => (
                <Link 
                  key={alert.id}
                  href={`/paciente/${alert.id}`} // Redirección corregida
                  className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-blue-500 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-6 min-w-0">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${alert.level === 'critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{alert.patient}</p>
                      <p className="text-sm text-gray-500 font-medium">{alert.msg}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden md:block text-[10px] font-black text-gray-300 group-hover:text-blue-500 transition-colors uppercase tracking-widest">Ver detalle</span>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* COLUMNA SOLICITUDES (Ocupa 1 de 4 columnas) */}
          <div className="space-y-4 text-left">
            <div className="px-2">
              <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                Solicitudes
              </h2>
            </div>

            <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm flex flex-col h-full min-h-[400px]">
              <div className="p-6 space-y-4 flex-1">
                {REQUESTS.map((req, i) => (
                  <div key={i} className="flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-blue-200 transition-all cursor-default">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-black text-gray-900 leading-tight">{req.patient}</p>
                      <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-100">{req.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                       <p className="text-[11px] font-black text-blue-600 uppercase tracking-tighter">{req.service}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                <button className="w-full py-4 bg-gray-900 text-white text-xs font-black rounded-xl hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em]">
                  Autorizar Todo <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER ADAPTADO AL ANCHO */}
        <footer className="pt-8 flex flex-col md:flex-row justify-between items-center border-t border-gray-200 gap-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">© 2026 OLGA Healthtech · Sura Operaciones</p>
          <div className="flex gap-8 text-[10px] font-black text-gray-400 tracking-widest">
            <button className="hover:text-blue-600 transition-colors uppercase">Consola de Red</button>
            <button className="hover:text-blue-600 transition-colors uppercase">Reporte de Fallos</button>
          </div>
        </footer>
      </main>
    </div>
  );
}