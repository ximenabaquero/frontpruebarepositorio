"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import {
  XMarkIcon, PlusIcon, TrashIcon, BeakerIcon,
  ClipboardDocumentListIcon, ArrowUpTrayIcon, DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import type { ExamOrder } from "../types";
import {
  createExamOrder,
  updateExamOrder,
  uploadExamResult,
  examOrderKey,
} from "../services/examOrderService";
import { exportElementToPDF } from "@/utils/exportPDF";
import ExamenOrdenPdf from "./ExamenOrdenPdf";

const BASE_EXAMS = ["PT", "PTT", "Hemograma", "Embarazo", "VIH"];

function suggestExams(age: number, bmi: number | string): string[] {
  const list = [...BASE_EXAMS];
  if (age > 50) list.push("Electrocardiograma");
  if (Number(bmi) >= 25) list.push("Ecografía abdominal");
  return list;
}

const STATUS_CONFIG = {
  pendiente: { label: "Pendiente de resultados", icon: ClockIcon,        color: "text-yellow-600",  bg: "bg-yellow-50 border-yellow-200" },
  apto:      { label: "Resultados aptos",        icon: CheckCircleIcon,  color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  no_apto:   { label: "Resultados no aptos",     icon: XCircleIcon,      color: "text-red-600",     bg: "bg-red-50 border-red-200" },
};

const fetcher = (url: string) =>
  fetch(url, { credentials: "include", headers: { Accept: "application/json" } }).then((r) => r.json());

interface Props {
  evaluationId: number;
  patientName: string;
  age: number;
  bmi: number | string;
  onClose: () => void;
}

type Tab = "solicitud" | "resultados";

export default function OrdenExamenesModal({ evaluationId, patientName, age, bmi, onClose }: Props) {
  const pdfRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, mutate, isLoading } = useSWR<{ data: ExamOrder | null }>(examOrderKey(evaluationId), fetcher);
  const examOrder: ExamOrder | null = data?.data ?? null;

  const [activeTab, setActiveTab] = useState<Tab>("solicitud");
  const [editMode, setEditMode] = useState(false);
  const [examList, setExamList] = useState<string[]>(() => suggestExams(age, bmi));
  const [newExam, setNewExam] = useState("");
  const [resultNotes, setResultNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const showCreateView = !examOrder || editMode;

  // ─── Acciones solicitud ────────────────────────────────────────────────────
  const handleSaveOrder = async () => {
    if (examList.length === 0) return;
    setIsSaving(true);
    try {
      await createExamOrder(evaluationId, examList);
      await mutate();
      setEditMode(false);
      toast.success("Orden de exámenes guardada");
    } catch { toast.error("Error al guardar la orden"); }
    finally { setIsSaving(false); }
  };

  const handleSetResult = async (status: "apto" | "no_apto") => {
    if (!examOrder) return;
    setIsSaving(true);
    try {
      await updateExamOrder(examOrder.id, { status, notes: resultNotes || undefined });
      await mutate();
      toast.success(status === "apto" ? "Marcados como aptos" : "Marcados como no aptos");
    } catch { toast.error("Error al actualizar"); }
    finally { setIsSaving(false); }
  };

  const addExam = () => {
    const t = newExam.trim();
    if (t && !examList.includes(t)) setExamList((p) => [...p, t]);
    setNewExam("");
  };

  // ─── Upload resultado ──────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !examOrder) return;
    setIsUploading(true);
    try {
      await uploadExamResult(examOrder.id, file);
      await mutate();
      toast.success("Archivo de resultados subido");
    } catch { toast.error("Error al subir el archivo"); }
    finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const resultFileUrl = examOrder?.result_file_path
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "")}/storage/${examOrder.result_file_path}`
    : null;

  const isPdf = resultFileUrl?.toLowerCase().endsWith(".pdf");

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BeakerIcon className="w-5 h-5 text-teal-500" />
              <h2 className="text-base font-bold text-gray-900">Orden de Exámenes</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition">
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Paciente */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex gap-4 text-sm text-gray-600">
            <span className="font-semibold text-gray-800">{patientName}</span>
            <span>·</span>
            <span>{age} años</span>
            <span>·</span>
            <span>IMC: <span className={Number(bmi) >= 25 ? "font-semibold text-orange-600" : "font-semibold text-gray-800"}>{Number(bmi).toFixed(1)}</span></span>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("solicitud")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all border-b-2 ${
                activeTab === "solicitud"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <ClipboardDocumentListIcon className="w-4 h-4" />
              Solicitud
            </button>
            <button
              onClick={() => setActiveTab("resultados")}
              disabled={!examOrder}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all border-b-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                activeTab === "resultados"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <ArrowUpTrayIcon className="w-4 h-4" />
              Resultados
              {examOrder?.result_file_path && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Cargando...</div>
            ) : activeTab === "solicitud" ? (

              /* ══ TAB: SOLICITUD ══════════════════════════════════════════ */
              showCreateView ? (
                <div className="px-6 py-5 space-y-4">
                  {Number(bmi) >= 25 && (
                    <div className="px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-700 font-medium">
                      ⚠ IMC ≥ 25 — se incluye Ecografía abdominal automáticamente
                    </div>
                  )}
                  {age > 50 && (
                    <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 font-medium">
                      ℹ Mayor de 50 años — se incluye Electrocardiograma automáticamente
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Exámenes a solicitar</p>
                    <ul className="space-y-1.5">
                      {examList.map((exam) => (
                        <li key={exam} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-sm">
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                            {exam}
                          </span>
                          {!BASE_EXAMS.includes(exam) && (
                            <button onClick={() => setExamList((p) => p.filter((e) => e !== exam))} className="p-1 text-gray-400 hover:text-red-500 transition">
                              <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newExam}
                      onChange={(e) => setNewExam(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addExam()}
                      placeholder="Agregar examen adicional..."
                      className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400"
                    />
                    <button onClick={addExam} disabled={!newExam.trim()} className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition disabled:opacity-40">
                      <PlusIcon className="w-4 h-4" />
                      Agregar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-5 space-y-4">
                  {(() => {
                    const cfg = STATUS_CONFIG[examOrder!.status];
                    const Icon = cfg.icon;
                    return (
                      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${cfg.bg}`}>
                        <Icon className={`w-5 h-5 ${cfg.color}`} />
                        <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                        {examOrder!.received_at && (
                          <span className="ml-auto text-xs text-gray-400">
                            {new Date(examOrder!.received_at).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Exámenes solicitados</p>
                    <ul className="space-y-1.5">
                      {examOrder!.exams.map((exam) => (
                        <li key={exam} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                          {exam}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {examOrder!.notes && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Notas</p>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">{examOrder!.notes}</p>
                    </div>
                  )}
                </div>
              )

            ) : (

              /* ══ TAB: RESULTADOS ═════════════════════════════════════════ */
              <div className="px-6 py-5 space-y-5">

                {/* Archivo subido */}
                {resultFileUrl ? (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Archivo de resultados</p>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50">
                      <DocumentTextIcon className="w-8 h-8 text-emerald-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-emerald-700 truncate">
                          {isPdf ? "Documento PDF" : "Imagen de resultados"}
                        </p>
                        <p className="text-xs text-emerald-600">Archivo subido correctamente</p>
                      </div>
                      <a
                        href={resultFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition"
                      >
                        Ver
                      </a>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="text-xs text-gray-500 hover:text-teal-600 transition underline"
                    >
                      Reemplazar archivo
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Subir resultados del laboratorio</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex flex-col items-center justify-center gap-2 w-full py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-teal-300 hover:text-teal-600 transition disabled:opacity-50"
                    >
                      <ArrowUpTrayIcon className="w-8 h-8" />
                      <span className="text-sm font-medium">
                        {isUploading ? "Subiendo..." : "Seleccionar archivo"}
                      </span>
                      <span className="text-xs text-gray-400">PDF, JPG, PNG — máx. 10 MB</span>
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Marcar como apto / no apto */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    {examOrder!.status === "pendiente" ? "¿Los resultados son aptos?" : "Estado actual"}
                  </p>

                  {examOrder!.status !== "pendiente" ? (
                    (() => {
                      const cfg = STATUS_CONFIG[examOrder!.status];
                      const Icon = cfg.icon;
                      return (
                        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${cfg.bg}`}>
                          <Icon className={`w-5 h-5 ${cfg.color}`} />
                          <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                        </div>
                      );
                    })()
                  ) : (
                    <>
                      <textarea
                        value={resultNotes}
                        onChange={(e) => setResultNotes(e.target.value)}
                        placeholder="Observaciones sobre los resultados (opcional)..."
                        rows={2}
                        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSetResult("no_apto")}
                          disabled={isSaving}
                          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          No aptos
                        </button>
                        <button
                          onClick={() => handleSetResult("apto")}
                          disabled={isSaving}
                          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Aptos
                        </button>
                      </div>
                    </>
                  )}

                  {/* Resetear estado */}
                  {examOrder!.status !== "pendiente" && (
                    <button
                      onClick={() => handleSetResult("apto" === examOrder!.status ? "no_apto" : "apto")}
                      className="text-xs text-gray-400 hover:text-gray-600 transition underline"
                    >
                      Cambiar estado
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              {examOrder && activeTab === "solicitud" && (
                <>
                  <button onClick={() => { if (pdfRef.current) exportElementToPDF(pdfRef.current, `orden-examenes-${patientName.replace(/\s+/g, "-")}.pdf`); }}
                    className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition">
                    Imprimir orden
                  </button>
                  {!editMode && (
                    <button onClick={() => { setExamList(examOrder.exams); setEditMode(true); }}
                      className="px-3 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition">
                      Editar orden
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
                Cerrar
              </button>
              {activeTab === "solicitud" && showCreateView && (
                <button onClick={handleSaveOrder} disabled={isSaving || examList.length === 0}
                  className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition disabled:opacity-50">
                  {isSaving ? "Guardando..." : "Guardar orden"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {examOrder && (
        <ExamenOrdenPdf ref={pdfRef} patientName={patientName} age={age} bmi={bmi}
          exams={examOrder.exams} currentYear={new Date().getFullYear()} />
      )}
    </>
  );
}
