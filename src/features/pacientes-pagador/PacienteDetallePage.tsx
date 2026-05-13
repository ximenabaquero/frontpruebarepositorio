"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle, Clock, XCircle,
  AlertTriangle, Activity, Phone, FileText,
  MapPin, PenLine, AlertCircle, Circle
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

type ModalType = "modificar" | "derivar" | null;

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
        <p className="text-sm">Paciente no encontrado. Error de consulta o registro inexistente.</p>
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
    <div className="p-6 space-y-6 max-w-6xl mx-auto pb-24">
      {/* Toast de acción */}
      <AnimatePresence>
        {accionHecha && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-6 right-6 z-50 bg-emerald-600 text-white text-sm font-semibold px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg"
          >
            <CheckCircle className="w-4 h-4" />
            {accionHecha}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Franja superior — quién es */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.push("/pacientes")}
          className="mt-1 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{meta.nombre}</h1>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-200 uppercase tracking-wider">
              Plan Autorizado
            </span>
            <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${
              meta.riesgo === "alto" ? "bg-red-50 text-red-700 border-red-200" : 
              meta.riesgo === "medio" ? "bg-amber-50 text-amber-700 border-amber-200" : 
              "bg-blue-50 text-blue-700 border-blue-200"
            }`}>
              <Circle className={`w-2 h-2 fill-current ${
                meta.riesgo === "alto" ? "text-red-600" : meta.riesgo === "medio" ? "text-amber-500" : "text-blue-500"
              }`} />
              Riesgo {meta.riesgo}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            58 años · {meta.diagnostico} · Día {meta.dias_post_alta} de 14 · IPS Norte
          </p>
        </div>
      </div>

      {/* Bloque 1: Alerta activa */}
      {meta.riesgo === "alto" && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 shadow-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-red-900 uppercase tracking-wide">Alerta de sistema</h3>
            <p className="text-sm text-red-800 mt-0.5 font-medium">
              Sin visita confirmada en 48h — GPS no registrado — Última visita documentada: 12 may 9:00 AM.
              {meta.diagnostico.includes("ICC") && " PA sistólica en aumento — Última lectura: 158 mmHg."}
            </p>
          </div>
        </div>
      )}

      {/* Bloque 2: Plan autorizado */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
          <Activity className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-gray-900">Detalle de Autorización (EPS)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              <strong className="text-gray-900 font-semibold">Plan autorizado:</strong>{' '}
              <span className="font-bold text-emerald-700">PHD</span> <span className="text-gray-400 mx-1">·</span> <span className="text-gray-600">Enfermería diaria + cardiología 3x/sem + medicamentos IV</span>
            </p>
            <p className="text-sm text-gray-700"><strong className="text-gray-900 font-semibold">Duración:</strong> 14 días · Día {meta.dias_post_alta} de 14</p>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Incluye:</p>
              <ul className="text-sm text-gray-600 list-none space-y-1.5">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>Enfermería 2 veces al día</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>Control médico 2 veces por semana</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>Oxígeno suplementario</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>Tele-monitoreo diario</li>
              </ul>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Documentos de respaldo:</p>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between text-left px-4 py-3 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 rounded-xl transition-all group">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">Orden médica — Dr. Salazar / HUN</span>
                </div>
                <span className="text-xs text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Ver PDF →</span>
              </button>
              <button className="w-full flex items-center justify-between text-left px-4 py-3 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 rounded-xl transition-all group">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">Historia clínica — Resumen</span>
                </div>
                <span className="text-xs text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Ver PDF →</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two column: Timeline + Gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bloque 3: Ejecución del plan */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Ejecución cronológica</h2>
            <p className="text-xs text-gray-500 mt-0.5">Pendientes y completados</p>
          </div>
          <div className="p-5 flex-1 overflow-y-auto max-h-[350px] relative">
            {detalle.timeline.map((item, idx) => {
              const s = ESTADO_ICON[item.estado];
              const Icon = s.icon;
              const isLast = idx === detalle.timeline.length - 1;
              return (
                <div key={item.id} className="flex gap-3 relative">
                  {!isLast && (
                    <div className={`absolute left-[15px] top-8 w-0.5 h-full ${s.line} opacity-30`} />
                  )}
                  <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full ${s.bg} flex items-center justify-center z-10`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <div className="pb-5 flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-gray-500">{item.fecha}</p>
                        <p className={`text-sm font-semibold leading-tight mt-0.5 ${item.estado === "no_cumplido" ? "text-red-700" : "text-gray-900"}`}>
                          {item.servicio}
                        </p>
                      </div>
                    </div>
                    {item.estado === "cumplido" && (
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
                          <MapPin className="w-3 h-3 text-emerald-600" /> GPS verificado
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
                          <PenLine className="w-3 h-3 text-emerald-600" /> Firma capturada
                        </span>
                      </div>
                    )}
                    {item.estado === "cumplido" && (
                      <Link href={`/evidencia/${idx + 1}`} className="inline-block mt-2 text-[11px] font-bold text-emerald-600 hover:underline">
                        Ver evidencia →
                      </Link>
                    )}
                    {item.nota && (
                      <div className={`mt-2 px-3 py-2 rounded-lg border flex items-start gap-2 ${
                        item.estado === "no_cumplido" ? "bg-red-50 border-red-100 text-red-700" : "bg-amber-50 border-amber-100 text-amber-700"
                      }`}>
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p className="text-xs font-medium">{item.nota}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bloque 4: Signos vitales recientes */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-gray-900">Signos vitales recientes</h2>
              <p className="text-xs text-gray-500 mt-0.5">Valores de visitas verificadas</p>
            </div>
            {/* Quick KPI for context without emojis */}
            <div className="text-right flex flex-col items-end">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Adherencia</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">{meta.adherencia}%</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  meta.adherencia >= 90 ? "bg-emerald-100 text-emerald-700" : 
                  meta.adherencia >= 70 ? "bg-amber-100 text-amber-700" : 
                  "bg-red-100 text-red-700"
                }`}>
                  {meta.adherencia >= 90 ? "Óptima" : meta.adherencia >= 70 ? "Regular" : "Crítica"}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 flex-1">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={detalle.vitales} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  labelStyle={{ fontWeight: 700, marginBottom: 4, color: '#111827' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: '10px' }} />
                <Line type="monotone" dataKey="pa_sistolica" name="PA Sistólica" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: "#ef4444" }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="pa_diastolica" name="PA Diastólica" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="fc" name="FC (lpm)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                {tieneEPOC && (
                  <Line type="monotone" dataKey="spo2" name="SpO₂ (%)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                )}
                {tieneDiabetes && detalle.vitales[0]?.glucemia !== undefined && (
                  <Line type="monotone" dataKey="glucemia" name="Glucemia" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Botones al fondo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => handleAccion("Llamada al prestador iniciada...")}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Phone className="w-4 h-4" />
            Contactar prestador
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModal("modificar")}
              className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Modificar plan
            </button>
            <button
              onClick={() => setModal("derivar")}
              className="px-8 py-3 bg-red-50 text-red-700 border border-red-200 font-bold rounded-xl hover:bg-red-100 transition-colors shadow-sm"
            >
              Derivar a urgencias
            </button>
          </div>
        </div>
      </div>

      {/* Modales - Modificar Plan */}
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
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-gray-900 mb-1">Modificar plan de cuidado</h3>
              <p className="text-xs text-gray-500 mb-4">{meta.nombre}</p>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Plan actual</p>
                <p className="text-sm text-gray-700 font-medium">PHD — Hospitalización Domiciliaria</p>
              </div>
              <textarea
                className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                rows={3}
                placeholder="Describa la justificación clínica para la modificación..."
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

      {/* Modales - Derivar */}
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
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-red-700">Derivar a urgencias</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">{meta.nombre} · {meta.diagnostico}</p>
              <select className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 mb-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white text-gray-800 font-medium">
                <option>Descompensación hemodinámica</option>
                <option>Falla respiratoria</option>
                <option>Abandono de tratamiento / Sin respuesta</option>
                <option>Otro</option>
              </select>
              <textarea
                className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
                rows={3}
                placeholder="Notas para el equipo de traslado / triage..."
                value={derivarNota}
                onChange={(e) => setDerivarNota(e.target.value)}
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={() => handleAccion("Ambulancia despachada — Urgencias notificadas")}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
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