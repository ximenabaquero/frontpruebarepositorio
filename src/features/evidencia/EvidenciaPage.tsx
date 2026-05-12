"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, CheckCircle, AlertTriangle, Clock,
  MapPin, User, FileText, Pen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { serviciosEvidencia } from "@/data/mock/servicios";
import ConfirmModal from "@/components/ConfirmModal";
import toast, { Toaster } from "react-hot-toast";

// SSR false obligatorio para Leaflet
const MapaEvidencia = dynamic(() => import("./MapaEvidencia"), { ssr: false });

export default function EvidenciaPage({ id }: { id: number }) {
  const router = useRouter();
  const servicio = serviciosEvidencia.find((s) => s.id === id) ?? serviciosEvidencia[0];
  const esIrregular = servicio.estado === "irregularidad";

  const [modalIrregular, setModalIrregular] = useState(false);
  const [aprobado, setAprobado] = useState(servicio.estado === "verificado");
  const [showCheck, setShowCheck] = useState(false);
  const [motivoIrregular, setMotivoIrregular] = useState("");

  const horaInicio = servicio.hora_inicio;
  const horaFin = servicio.hora_fin;
  const [h1, m1] = horaInicio.split(":").map(Number);
  const [h2, m2] = horaFin.split(":").map(Number);
  const duracion = (h2 * 60 + m2) - (h1 * 60 + m1);

  function handleAprobar() {
    setAprobado(true);
    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 2000);
    toast("✅ Servicio aprobado para auditoría", {
      style: { background: "#059669", color: "#fff", fontWeight: "600", borderRadius: "10px" },
    });
  }

  function handleIrregularidad() {
    setModalIrregular(false);
    toast("⚠️ Irregularidad marcada — auditoria notificada", {
      style: { background: "#DC2626", color: "#fff", fontWeight: "600", borderRadius: "10px" },
    });
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <Toaster position="top-right" />

      {/* Back + header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.push("/pacientes")}
          className="mt-1 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Evidencia de Servicio</h1>
          <p className="text-sm text-gray-500 mt-0.5">{servicio.tipo} · {servicio.fecha}</p>
        </div>
        {/* Estado badge */}
        <div className="flex items-center gap-2">
          {esIrregular && (
            <span className="flex items-center gap-1.5 text-xs font-bold bg-red-100 text-red-700 px-3 py-1.5 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" /> Irregularidad detectada
            </span>
          )}
          {aprobado && !esIrregular && (
            <span className="flex items-center gap-1.5 text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" /> Auditado con evidencia
            </span>
          )}
        </div>
      </div>

      {/* Banner de alerta para irregularidad */}
      {esIrregular && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800">Posible visita fantasma detectada</p>
            <p className="text-xs text-red-700 mt-0.5">
              El GPS del profesional se registró a {servicio.distancia_metros}m del domicilio del paciente.
              El rango máximo permitido es 200m. Se requiere revisión manual.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Mapa */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-gray-900">Verificación GPS</h2>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />Domicilio</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />GPS real</span>
            </div>
          </div>
          <div style={{ height: "340px" }} className="relative">
            <MapaEvidencia
              latDestino={servicio.lat_destino}
              lngDestino={servicio.lng_destino}
              latGPS={servicio.lat_gps}
              lngGPS={servicio.lng_gps}
              profesional={servicio.profesional}
              timestamp={servicio.timestamp_llegada}
              distanciaMetros={servicio.distancia_metros}
              esIrregular={esIrregular}
            />
          </div>
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Distancia al destino</span>
            <span className={`text-sm font-bold ${servicio.distancia_metros <= 200 ? "text-emerald-700" : "text-red-700"}`}>
              {servicio.distancia_metros}m {servicio.distancia_metros <= 200 ? "✅" : "⚠️"}
            </span>
          </div>
        </div>

        {/* Info del servicio */}
        <div className="flex flex-col gap-4">

          {/* Card info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Información del servicio</h2>
            {[
              { icon: User,      label: "Paciente",     value: servicio.paciente },
              { icon: User,      label: "Profesional",  value: servicio.profesional },
              { icon: FileText,  label: "Tipo",         value: servicio.tipo },
              { icon: Clock,     label: "Hora inicio",  value: servicio.hora_inicio },
              { icon: Clock,     label: "Hora fin",     value: servicio.hora_fin },
              { icon: Clock,     label: "Duración",     value: `${duracion} minutos` },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Timestamp verificado */}
          <div className={`rounded-2xl border p-4 flex items-center gap-3 ${esIrregular ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${esIrregular ? "bg-red-100" : "bg-emerald-100"}`}>
              <MapPin className={`w-5 h-5 ${esIrregular ? "text-red-600" : "text-emerald-600"}`} />
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${esIrregular ? "text-red-700" : "text-emerald-700"}`}>
                {esIrregular ? "GPS fuera de rango" : "GPS Verificado"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(servicio.timestamp_llegada).toLocaleString("es-CO", {
                  dateStyle: "medium", timeStyle: "short"
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nota clínica + firma */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Nota clínica */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-gray-900">Nota clínica</h2>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{servicio.nota_clinica}</p>
        </div>

        {/* Firma digital */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Pen className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-gray-900">Firma digital del paciente</h2>
          </div>
          {/* Firma mock SVG */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center" style={{ height: 120 }}>
            <svg viewBox="0 0 300 100" width="260" height="90" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 70 Q40 30 60 55 Q80 80 100 45 Q120 10 140 50 Q160 85 180 40 Q200 5 220 45 Q240 80 260 55 Q275 40 285 45"
                fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              />
              <path d="M20 80 L285 80" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 3" />
            </svg>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <p className="text-xs text-emerald-700 font-semibold">
              Firma capturada · {servicio.fecha} {servicio.hora_fin}
            </p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3 justify-end">
        {!aprobado && !esIrregular && (
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAprobar}
              className="flex items-center gap-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-200"
            >
              <CheckCircle className="w-4 h-4" />
              Aprobar para auditoría
            </motion.button>
            <AnimatePresence>
              {showCheck && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.3, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        {aprobado && !esIrregular && (
          <span className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-6 py-3 rounded-xl">
            <CheckCircle className="w-4 h-4" /> Aprobado para auditoría
          </span>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setModalIrregular(true)}
          className="flex items-center gap-2 text-sm font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 px-6 py-3 rounded-xl transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          Marcar irregularidad
        </motion.button>
      </div>

      {/* Modal irregularidad */}
      <AnimatePresence>
        {modalIrregular && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalIrregular(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Marcar irregularidad</h3>
                  <p className="text-xs text-gray-500">Se notificará al equipo de auditoría</p>
                </div>
              </div>
              <textarea
                className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
                rows={4}
                placeholder="Describe la irregularidad detectada..."
                value={motivoIrregular}
                onChange={(e) => setMotivoIrregular(e.target.value)}
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setModalIrregular(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={handleIrregularidad}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                >
                  Reportar irregularidad
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
