"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle, Clock, XCircle,
  AlertTriangle, TrendingUp, TrendingDown, Minus,
  User, Stethoscope, CalendarDays, Activity,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { detallesPacientes } from "@/data/mock/detalle-paciente";
import { pacientesPagador } from "@/data/mock/pacientes";
import ConfirmModal from "@/components/ConfirmModal";

const ESTADO_ICON = {
  cumplido:    { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100", line: "bg-emerald-500" },
  pendiente:   { icon: Clock,       color: "text-gray-400",    bg: "bg-gray-100",    line: "bg-gray-300"   },
  no_cumplido: { icon: XCircle,     color: "text-red-600",     bg: "bg-red-100",     line: "bg-red-400"    },
};

type ModalType = "modificar" | "suspender" | "derivar" | null;

export default function PacienteDetallePage({ id }: { id: number }) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalType>(null);
  const [derivarNota, setDerivarNota] = useState("");
  const [accionHecha, setAccionHecha] = useState<string | null>(null);

  const meta = pacientesPagador.find((p) => p.id === id);
  const detalle = detallesPacientes.find((d) => d.id === id) ?? detallesPacientes[0];

  if (!meta) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-sm">Paciente no encontrado en la demo.</p>
        <button onClick={() => router.back()} className="mt-4 text-emerald-600 text-sm font-semibold hover:underline">
          ← Volver
        </button>
      </div>
    );
  }

  const tieneDiabetes = meta.diagnostico.toLowerCase().includes("diabet");
  const tieneEPOC    = meta.diagnostico.toLowerCase().includes("epoc");

  function handleAccion(tipo: string) {
    setAccionHecha(tipo);
    setModal(null);
    setTimeout(() => setAccionHecha(null), 3000);
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">

      {/* Back + header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.push("/pacientes")}
          className="mt-1 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{meta.nombre}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{meta.diagnostico} · Día {meta.dias_post_alta} post-alta</p>
        </div>
        {/* Acciones */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setModal("modificar")}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Modificar plan
          </button>
          <button
            onClick={() => setModal("derivar")}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            Derivar
          </button>
          <button
            onClick={() => setModal("suspender")}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
          >
            Suspender
          </button>
        </div>
      </div>

      {/* Toast de acción */}
      <AnimatePresence>
        {accionHecha && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-600 text-white text-sm font-semibold px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {accionHecha}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Datos demográficos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: User,         label: "Cédula",         value: detalle.cedula },
          { icon: CalendarDays, label: "Fecha de nacimiento", value: detalle.fecha_nacimiento },
          { icon: Stethoscope,  label: "Médico tratante",     value: detalle.medico },
          { icon: Activity,     label: "Plan de cuidado",     value: detalle.plan },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <item.icon className="w-4 h-4 text-emerald-600" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
            </div>
            <p className="text-sm font-semibold text-gray-800 leading-snug">{item.value}</p>
          </div>
        ))}
      </div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-900">{meta.riesgo_pct}%</p>
          <p className="text-xs text-gray-500 mt-0.5">Riesgo de reingreso</p>
          <div className={`mt-2 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
            meta.riesgo === "alto" ? "bg-red-100 text-red-700" : meta.riesgo === "medio" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
          }`}>
            {meta.riesgo.toUpperCase()}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-900">{meta.adherencia}%</p>
          <p className="text-xs text-gray-500 mt-0.5">Adherencia al plan</p>
          <p className="text-lg mt-1">{meta.adherencia >= 90 ? "🟢" : meta.adherencia >= 70 ? "🟡" : "🔴"}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 mt-1">
            {meta.tendencia === "mejorando" && <TrendingUp className="w-6 h-6 text-emerald-600" />}
            {meta.tendencia === "deteriorando" && <TrendingDown className="w-6 h-6 text-red-600" />}
            {meta.tendencia === "estable" && <Minus className="w-6 h-6 text-gray-500" />}
          </div>
          <p className={`text-sm font-bold mt-1 capitalize ${
            meta.tendencia === "mejorando" ? "text-emerald-700" : meta.tendencia === "deteriorando" ? "text-red-700" : "text-gray-600"
          }`}>{meta.tendencia}</p>
          <p className="text-xs text-gray-500 mt-0.5">Tendencia clínica</p>
        </div>
      </div>

      {/* Two column: Timeline + Gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Timeline de servicios</h2>
            <p className="text-xs text-gray-400 mt-0.5">Plan de atención domiciliaria</p>
          </div>
          <div className="p-5 space-y-0 relative">
            {detalle.timeline.map((item, idx) => {
              const s = ESTADO_ICON[item.estado];
              const Icon = s.icon;
              const isLast = idx === detalle.timeline.length - 1;
              return (
                <div key={item.id} className="flex gap-3 relative">
                  {/* Línea vertical */}
                  {!isLast && (
                    <div className={`absolute left-[15px] top-8 w-0.5 h-full ${s.line} opacity-30`} />
                  )}
                  {/* Icono */}
                  <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full ${s.bg} flex items-center justify-center z-10`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  {/* Contenido */}
                  <div className={`pb-5 flex-1 min-w-0 ${isLast ? "" : ""}`}>
                    <p className="text-xs font-bold text-gray-500">{item.fecha}</p>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{item.servicio}</p>
                    <p className="text-xs text-gray-400">{item.profesional}</p>
                    {item.estado === "cumplido" && (
                      <Link
                        href={`/evidencia/${idx + 1}`}
                        className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        Ver evidencia →
                      </Link>
                    )}
                    {item.nota && (
                      <p className={`text-xs mt-1 px-2 py-1 rounded-lg ${
                        item.estado === "no_cumplido" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        ⚠️ {item.nota}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfico signos vitales */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Signos vitales</h2>
            <p className="text-xs text-gray-400 mt-0.5">Últimos {detalle.vitales.length} registros</p>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={detalle.vitales} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e5e7eb" }}
                  labelStyle={{ fontWeight: 700, marginBottom: 4 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="pa_sistolica" name="PA sistólica" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="pa_diastolica" name="PA diastólica" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="fc" name="FC (lpm)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                {tieneEPOC && (
                  <Line type="monotone" dataKey="spo2" name="SpO₂ (%)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                )}
                {tieneDiabetes && detalle.vitales[0]?.glucemia !== undefined && (
                  <Line type="monotone" dataKey="glucemia" name="Glucemia (mg/dL)" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Alertas de rango */}
          {meta.riesgo === "alto" && (
            <div className="mx-4 mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-xs text-red-700 font-medium">
                {meta.riesgo === "alto" && meta.diagnostico.includes("ICC")
                  ? "PA sistólica en aumento — última lectura 158 mmHg"
                  : meta.diagnostico.includes("EPOC")
                  ? "SpO₂ por debajo del umbral mínimo (88%)"
                  : "Parámetros fuera de rango — revisar plan"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <ConfirmModal
        isOpen={modal === "suspender"}
        title="Suspender plan de cuidado"
        message={`¿Está seguro que desea suspender el plan de atención domiciliaria de ${meta.nombre}? Esta acción suspenderá todos los servicios programados.`}
        confirmLabel="Suspender plan"
        variant="danger"
        onConfirm={() => handleAccion("Plan suspendido — equipo notificado")}
        onCancel={() => setModal(null)}
      />

      {/* Modal modificar plan */}
      <AnimatePresence>
        {modal === "modificar" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-gray-900 mb-1">Modificar plan de cuidado</h3>
              <p className="text-xs text-gray-500 mb-4">{meta.nombre}</p>
              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Plan actual</p>
                <p className="text-sm text-gray-700">{detalle.plan}</p>
              </div>
              <textarea
                className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                rows={3}
                placeholder="Describe la modificación al plan..."
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={() => handleAccion("Plan de cuidado actualizado")}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
                >
                  Guardar cambios
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal derivar */}
      <AnimatePresence>
        {modal === "derivar" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-gray-900 mb-1">Derivar paciente</h3>
              <p className="text-xs text-gray-500 mb-4">{meta.nombre} · {meta.diagnostico}</p>
              <select className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white">
                <option>Especialista en cardiología</option>
                <option>Especialista en neumología</option>
                <option>Especialista en endocrinología</option>
                <option>Medicina paliativa</option>
                <option>Hospitalización urgente</option>
              </select>
              <textarea
                className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                rows={3}
                placeholder="Motivo de la derivación..."
                value={derivarNota}
                onChange={(e) => setDerivarNota(e.target.value)}
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={() => handleAccion("Derivación registrada — especialista notificado")}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                >
                  Confirmar derivación
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
