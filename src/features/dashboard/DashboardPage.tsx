"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Activity,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

const TOP_PATIENTS = [
  {
    name: "Carlos Mendoza R.",
    diagnosis: "ICC post-trasplante cardíaco",
    days: 8,
    risk: 94,
    alert: "PA 158/98 — sin visita 48h",
    badge: "CRÍTICO",
    color: "red",
  },
  {
    name: "María Fernanda Gómez",
    diagnosis: "EPOC severo + HTA",
    days: 14,
    risk: 78,
    alert: "SpO₂ 88% en último registro",
    badge: "ALTO",
    color: "orange",
  },
  {
    name: "Jorge Andrés Palacio",
    diagnosis: "Diabetes + neuropatía",
    days: 21,
    risk: 61,
    alert: "Glucometría fuera de rango x2",
    badge: "MEDIO",
    color: "yellow",
  },
];

const ALERTS = [
  { patient: "Carlos Mendoza R.", msg: "Sin visita confirmada en 48h — GPS nunca llegó", time: "Hace 2h", level: "critical" },
  { patient: "María F. Gómez", msg: "SpO₂ 88% registrado por enfermera — deterioro", time: "Hace 3h", level: "critical" },
  { patient: "Ana Lucía Torres", msg: "Medicamento no dispensado — falta firma paciente", time: "Hace 5h", level: "warning" },
  { patient: "Roberto Silva M.", msg: "Visita reportada pero GPS nunca verificado", time: "Hace 6h", level: "warning" },
  { patient: "Claudia Peña V.", msg: "Signos vitales no registrados en últimas 24h", time: "Hace 9h", level: "warning" },
];

export default function DashboardPage() {
  const presupuesto = 310;
  const gastado = 247;
  const pct = Math.round((gastado / presupuesto) * 100);

  return (
    <div className="bg-gray-50 font-sans">

      {/* ── ALERT BANNER ── */}
      <div className="bg-red-600 text-white">
        <div className="px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-pulse" />
            <span className="text-sm font-semibold">
              5 alertas clínicas pendientes requieren atención inmediata
            </span>
          </div>
          <a href="#alertas" className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full font-semibold transition-colors whitespace-nowrap flex items-center gap-1">
            Ver todas <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      <main className="px-6 py-6 space-y-6">

        {/* ── PAGE TITLE ── */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Ejecutivo</h1>
          <p className="text-sm text-gray-500 mt-0.5">Visión general del cuidado extramural · Actualizado hace 4 min</p>
        </div>

        {/* ── KPI CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Pacientes */}
          <div data-tour="kpi-pacientes" className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Este mes</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">47</p>
            <p className="text-sm text-gray-500 mb-3">Pacientes monitoreados</p>
            <div className="flex gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />12 alto
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />23 medio
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />12 bajo
              </span>
            </div>
          </div>

          {/* Alertas */}
          <div data-tour="kpi-alertas" className="bg-white rounded-2xl border-2 border-red-200 p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xs text-red-500 font-semibold animate-pulse">● ACTIVO</span>
            </div>
            <p className="text-3xl font-bold text-red-600">5</p>
            <p className="text-sm text-gray-500 mb-3">Alertas clínicas pendientes</p>
            <a href="#alertas" className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors">
              Revisar ahora <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* Solicitudes */}
          <div data-tour="kpi-solicitudes" className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Pendientes</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">8</p>
            <p className="text-sm text-gray-500 mb-3">Solicitudes por autorizar</p>
            <Link href="/autorizaciones" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Autorizar servicios <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Presupuesto */}
          <div data-tour="kpi-presupuesto" className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-violet-600" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Mayo 2026</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              $247M <span className="text-lg font-semibold text-gray-400">/ $310M</span>
            </p>
            <p className="text-sm text-gray-500 mb-3">Costo atención vs presupuesto</p>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
              <div
                className={`h-2 rounded-full transition-all ${pct > 85 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 font-medium">
              <span>{pct}% ejecutado</span>
              <span>${presupuesto - gastado}M disponible</span>
            </div>
          </div>
        </div>

        {/* ── TWO-COLUMN ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Top 3 pacientes en riesgo */}
          <div data-tour="top3" className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Top 3 — Riesgo de reingreso esta semana</h2>
                <p className="text-xs text-gray-400 mt-0.5">Pacientes que requieren intervención prioritaria</p>
              </div>
              <Activity className="w-5 h-5 text-gray-300" />
            </div>
            <div className="divide-y divide-gray-50">
              {TOP_PATIENTS.map((p, i) => (
                <Link key={i} href={`/pacientes/${i + 1}`} className="block px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        p.color === "red" ? "bg-red-500" : p.color === "orange" ? "bg-orange-500" : "bg-amber-400"
                      }`}>
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{p.name}</p>
                        <p className="text-xs text-gray-500 truncate">{p.diagnosis} · Día {p.days} post-alta</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <AlertTriangle className={`w-3 h-3 flex-shrink-0 ${p.color === "red" ? "text-red-500" : p.color === "orange" ? "text-orange-500" : "text-amber-500"}`} />
                          <p className={`text-xs font-medium ${p.color === "red" ? "text-red-600" : p.color === "orange" ? "text-orange-600" : "text-amber-600"}`}>
                            {p.alert}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        p.color === "red" ? "bg-red-100 text-red-700" :
                        p.color === "orange" ? "bg-orange-100 text-orange-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>{p.badge}</span>
                      <p className="text-lg font-bold text-gray-900 mt-1">{p.risk}<span className="text-xs text-gray-400 font-normal">%</span></p>
                      <p className="text-[10px] text-gray-400">riesgo</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <Link href="/pacientes" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                Ver todos los pacientes monitoreados <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Distribución de riesgo + panel lateral */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Distribución visual */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Distribución por nivel de riesgo</h2>
              <div className="space-y-3">
                {[
                  { label: "Alto riesgo", count: 12, total: 47, color: "bg-red-500" },
                  { label: "Riesgo medio", count: 23, total: 47, color: "bg-amber-400" },
                  { label: "Bajo riesgo", count: 12, total: 47, color: "bg-emerald-500" },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-medium">{r.label}</span>
                      <span className="font-bold text-gray-900">{r.count} <span className="text-gray-400 font-normal">/ {r.total}</span></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${r.color}`} style={{ width: `${(r.count / r.total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 text-center gap-2">
                <div><p className="text-lg font-bold text-emerald-600">94%</p><p className="text-[10px] text-gray-400 leading-tight">GPS verificado</p></div>
                <div><p className="text-lg font-bold text-gray-900">6.4%</p><p className="text-[10px] text-gray-400 leading-tight">Reingreso 30d</p></div>
                <div><p className="text-lg font-bold text-gray-900">4.7</p><p className="text-[10px] text-gray-400 leading-tight">Score calidad</p></div>
              </div>
            </div>

            {/* Estado hoy */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Estado de hoy</h2>
              <div className="space-y-2.5">
                {[
                  { icon: CheckCircle, label: "Visitas completadas", val: "31 / 38", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { icon: Clock, label: "En progreso ahora", val: "7", color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: AlertTriangle, label: "Sin confirmar", val: "4", color: "text-red-600", bg: "bg-red-50" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center`}>
                        <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                      </div>
                      <span className="text-xs text-gray-600">{item.label}</span>
                    </div>
                    <span className={`text-xs font-bold ${item.color}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── ALERTAS DETALLE ── */}
        <div id="alertas" data-tour="alertas-panel" className="bg-white rounded-2xl border-2 border-red-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-bold text-red-700">Alertas clínicas pendientes</h2>
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">5</span>
            </div>
            <span className="text-xs text-red-500 font-medium">Requieren acción inmediata</span>
          </div>
          <div className="divide-y divide-gray-50">
            {ALERTS.map((a, i) => (
              <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-red-50/50 transition-colors">
                <div className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${a.level === "critical" ? "bg-red-500" : "bg-amber-400"}`} style={{ marginTop: '6px' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{a.patient}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a.msg}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 whitespace-nowrap">{a.time}</span>
                  <button className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap">
                    Atender
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SOLICITUDES ── */}
        <div id="solicitudes" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-gray-900">Solicitudes por autorizar</h2>
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">8</span>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { patient: "Luis Ángel Mora", service: "Terapia respiratoria domiciliaria", date: "Hoy, 9:00 AM", priority: "Alta" },
              { patient: "Gloria Inés Castro", service: "Curación herida quirúrgica", date: "Hoy, 10:30 AM", priority: "Media" },
              { patient: "Ramiro Suárez B.", service: "Fisioterapia post-fractura cadera", date: "Hoy, 11:00 AM", priority: "Media" },
              { patient: "Patricia Vega R.", service: "Infusión de antibiótico IV", date: "Hoy, 2:00 PM", priority: "Alta" },
            ].map((s, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{s.patient}</p>
                  <p className="text-xs text-gray-500">{s.service} · {s.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.priority === "Alta" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {s.priority}
                  </span>
                  <button className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors">
                    Autorizar
                  </button>
                  <button className="text-xs font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                    Revisar
                  </button>
                </div>
              </div>
            ))}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                Ver las 4 solicitudes restantes <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

      </main>

      <footer className="text-center py-4 text-[11px] text-gray-400 border-t border-gray-100 mt-4">
        OLGA Healthtech · Dashboard Ejecutivo EPS Sura · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
