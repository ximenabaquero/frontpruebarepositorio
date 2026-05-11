"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  XMarkIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import type { Appointment } from "../types";
import {
  appointmentKey,
  createAppointment,
  cancelAppointment,
} from "../services/agendamientoService";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include", headers: { Accept: "application/json" } })
    .then((r) => r.json());

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDatetimeLocal(dt: string): string {
  const d = new Date(dt);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function buildWhatsAppText(
  patientName: string,
  datetime: string,
  doctorName: string | null,
  fastingRequired: boolean,
): string {
  const date = new Date(datetime).toLocaleString("es-CO", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let text = `Hola ${patientName}! 👋\n\nTu cita en Cold Esthetic ha sido confirmada:\n\n📅 *Fecha:* ${date}`;
  if (doctorName) text += `\n👨‍⚕️ *Médico:* ${doctorName}`;
  if (fastingRequired) {
    text += `\n\n⚠️ *Importante:* Recuerda llegar con *8 horas de ayuno* previas al procedimiento.`;
  }
  text += `\n\nCualquier duda, escríbenos. ¡Te esperamos! 🌟`;
  return text;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  evaluationId: number;
  patientName: string;
  onClose: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AgendamientoModal({ evaluationId, patientName, onClose }: Props) {
  // ── Remoto ────────────────────────────────────────────────────────────────
  const { data, mutate, isLoading } = useSWR<{ data: Appointment | null }>(
    appointmentKey(evaluationId),
    fetcher,
  );
  const appointment: Appointment | null = data?.data ?? null;

  // ── Local ─────────────────────────────────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [procedureType, setProcedureType] = useState<"concejacion" | "sincecion">("concejacion");
  const [datetime, setDatetime] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const fastingRequired = procedureType === "concejacion";
  const showCreateView = !appointment || editMode;

  // ── Acciones ──────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!datetime) { toast.error("Selecciona fecha y hora"); return; }
    setIsSaving(true);
    try {
      await createAppointment(evaluationId, {
        appointment_datetime: new Date(datetime).toISOString(),
        procedure_type: procedureType,
        doctor_name: doctorName || undefined,
        notes: notes || undefined,
      });
      await mutate();
      setEditMode(false);
      toast.success("Cita agendada correctamente");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al agendar");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!appointment) return;
    setIsSaving(true);
    try {
      await cancelAppointment(appointment.id);
      await mutate();
      toast.success("Cita cancelada");
    } catch {
      toast.error("Error al cancelar la cita");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyWhatsApp = () => {
    if (!appointment) return;
    const text = buildWhatsAppText(
      patientName,
      appointment.appointment_datetime,
      appointment.doctor_name,
      appointment.fasting_required,
    );
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleEditInit = () => {
    if (appointment) {
      setProcedureType(appointment.procedure_type);
      setDatetime(formatDatetimeLocal(appointment.appointment_datetime));
      setDoctorName(appointment.doctor_name ?? "");
      setNotes(appointment.notes ?? "");
    }
    setEditMode(true);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-bold text-gray-900">Agendamiento</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Paciente */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
          Paciente: <span className="font-semibold text-gray-800">{patientName}</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Cargando...</div>
          ) : showCreateView ? (
            /* ── Vista: Crear / Editar ──────────────────────────── */
            <div className="px-6 py-5 space-y-5">

              {/* Tipo de procedimiento */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Tipo de procedimiento
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(["concejacion", "sincecion"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setProcedureType(type)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
                        procedureType === type
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {type === "concejacion" ? "Concejación" : "Sinceción"}
                      <p className="text-xs font-normal mt-0.5 opacity-70">
                        {type === "concejacion" ? "Requiere 8h de ayuno" : "Sin restricción"}
                      </p>
                    </button>
                  ))}
                </div>
                {fastingRequired && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 font-medium">
                    ⚠ La paciente debe llegar con <strong>8 horas de ayuno</strong> previas al procedimiento.
                  </div>
                )}
              </div>

              {/* Fecha y hora */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                  Fecha y hora
                </label>
                <input
                  type="datetime-local"
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400"
                />
              </div>

              {/* Médico */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                  Médico asignado <span className="font-normal normal-case">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Ej. Dr. Carlos Martínez"
                  maxLength={100}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400"
                />
              </div>

              {/* Notas */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                  Notas adicionales <span className="font-normal normal-case">(opcional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instrucciones especiales, observaciones..."
                  rows={2}
                  maxLength={500}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400 resize-none"
                />
              </div>
            </div>
          ) : (
            /* ── Vista: Cita confirmada ──────────────────────────── */
            <div className="px-6 py-5 space-y-4">
              {/* Badge estado */}
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border bg-emerald-50 border-emerald-200">
                <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">Cita confirmada</span>
              </div>

              {/* Detalles */}
              <div className="space-y-3 text-sm">
                <Row label="Fecha y hora">
                  {new Date(appointment.appointment_datetime).toLocaleString("es-CO", {
                    weekday: "long", day: "2-digit", month: "long",
                    year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </Row>
                <Row label="Procedimiento">
                  {appointment.procedure_type === "concejacion" ? "Concejación" : "Sinceción"}
                </Row>
                {appointment.doctor_name && (
                  <Row label="Médico">{appointment.doctor_name}</Row>
                )}
                <Row label="Ayuno">
                  {appointment.fasting_required ? (
                    <span className="text-amber-600 font-semibold">Sí — 8 horas previas</span>
                  ) : (
                    <span className="text-gray-500">No requerido</span>
                  )}
                </Row>
                {appointment.notes && (
                  <Row label="Notas">{appointment.notes}</Row>
                )}
              </div>

              {/* WhatsApp texto copiable */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Texto para WhatsApp
                </p>
                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 whitespace-pre-line leading-relaxed border border-gray-100 mb-2">
                  {buildWhatsAppText(
                    patientName,
                    appointment.appointment_datetime,
                    appointment.doctor_name,
                    appointment.fasting_required,
                  )}
                </div>
                <button
                  onClick={handleCopyWhatsApp}
                  className={`flex items-center gap-1.5 w-full justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    copied
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ClipboardDocumentCheckIcon className="w-4 h-4" />
                  {copied ? "¡Copiado!" : "Copiar texto"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {appointment && !editMode && (
              <>
                <button
                  onClick={handleEditInit}
                  className="px-3 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition"
                >
                  Editar
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                >
                  <XCircleIcon className="w-4 h-4" />
                  Cancelar cita
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cerrar
            </button>
            {showCreateView && (
              <button
                onClick={handleSave}
                disabled={isSaving || !datetime}
                className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
              >
                {isSaving ? "Guardando..." : "Confirmar cita"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-componente fila de detalle ────────────────────────────────────────────
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="text-gray-400 w-28 shrink-0 font-medium">{label}</span>
      <span className="text-gray-800">{children}</span>
    </div>
  );
}
