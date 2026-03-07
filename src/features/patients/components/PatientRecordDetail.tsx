"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import Image from "next/image";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import RegisterHeaderBar from "../../post-login/components/RegisterHeaderBar";
import ExportButton from "../../../components/ExportButton";
import BackButton from "../../../components/BackButton";
import AuthGuard from "@/components/AuthGuard";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  }).then((res) => res.json());

interface Props {
  patientId: number;
  evaluationId: number;
}

interface ProcedureItem {
  id?: number;
  item_name: string;
  price: string;
}

const STATUS_CONFIG = {
  EN_ESPERA: { label: "En espera", classes: "bg-yellow-100 text-yellow-700" },
  CONFIRMADO: {
    label: "Confirmado",
    classes: "bg-emerald-100 text-emerald-700",
  },
  CANCELADO: { label: "Cancelado", classes: "bg-red-100 text-red-600" },
} as const;

export default function PatientRecordDetail({
  patientId,
  evaluationId,
}: Props) {
  const [currentYear] = useState(new Date().getFullYear());
  const exportRef = useRef<HTMLDivElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [showEditEval, setShowEditEval] = useState(false);
  const [evalForm, setEvalForm] = useState({
    weight: "",
    height: "",
    medical_background: "",
  });
  const [isSavingEval, setIsSavingEval] = useState(false);

  const [editingProcId, setEditingProcId] = useState<number | null>(null);
  const [procForm, setProcForm] = useState<{
    procedure_date: string;
    notes: string;
    items: ProcedureItem[];
  }>({
    procedure_date: "",
    notes: "",
    items: [],
  });
  const [isSavingProc, setIsSavingProc] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);

  const { data, error, isLoading, mutate } = useSWR(
    evaluationId
      ? `${apiBaseUrl}/api/v1/medical-evaluations/${evaluationId}`
      : null,
    fetcher,
  );

  const handleStatusChange = async (action: "confirmar" | "cancelar") => {
    setIsChangingStatus(true);
    const token = Cookies.get("XSRF-TOKEN") ?? "";
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/v1/medical-evaluations/${evaluationId}/${action}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "X-XSRF-TOKEN": token, Accept: "application/json" },
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { message?: string }).message ?? "Error al cambiar estado",
        );
      }
      toast.success(
        action === "confirmar"
          ? "Valoracion confirmada"
          : "Valoracion cancelada",
      );
      mutate();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setIsChangingStatus(false);
    }
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setTermsAccepted(false);
    sigCanvasRef.current?.clear();
  };

  const handleConfirmar = async () => {
    if (!termsAccepted) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      toast.error("La firma es obligatoria");
      return;
    }
    const signature = sigCanvasRef.current.toDataURL("image/png");
    setIsConfirming(true);
    const token = Cookies.get("XSRF-TOKEN") ?? "";
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/v1/medical-evaluations/${evaluationId}/confirmar`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": token,
          },
          body: JSON.stringify({
            terms_accepted: true,
            patient_signature: signature,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { message?: string }).message ?? "Error al confirmar",
        );
      }
      toast.success("Valoración confirmada");
      closeConfirmModal();
      mutate();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setIsConfirming(false);
    }
  };

  const openEditEval = () => {
    const ev = data?.data;
    setEvalForm({
      weight: String(ev?.weight ?? ""),
      height: String(ev?.height ?? ""),
      medical_background: ev?.medical_background ?? "",
    });
    setShowEditEval(true);
  };

  const handleSaveEval = async () => {
    if (!evalForm.weight || !evalForm.height || !evalForm.medical_background) {
      toast.error("Completa todos los campos");
      return;
    }
    setIsSavingEval(true);
    const token = Cookies.get("XSRF-TOKEN") ?? "";
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/v1/medical-evaluations/${evaluationId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": token,
          },
          body: JSON.stringify({
            weight: parseFloat(evalForm.weight),
            height: parseFloat(evalForm.height),
            medical_background: evalForm.medical_background,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { message?: string }).message ?? "Error al guardar",
        );
      }
      toast.success("Evaluacion actualizada");
      setShowEditEval(false);
      mutate();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setIsSavingEval(false);
    }
  };

  const openEditProc = (proc: any) => {
    setEditingProcId(proc.id);
    setProcForm({
      procedure_date: proc.procedure_date?.slice(0, 10) ?? "",
      notes: proc.notes ?? "",
      items: proc.items.map((i: any) => ({
        id: i.id,
        item_name: i.item_name,
        price: String(i.price),
      })),
    });
  };

  const closeEditProc = () => {
    setEditingProcId(null);
    setProcForm({ procedure_date: "", notes: "", items: [] });
  };

  const addProcItem = () =>
    setProcForm((f) => ({
      ...f,
      items: [...f.items, { item_name: "", price: "" }],
    }));

  const removeProcItem = (idx: number) =>
    setProcForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const updateProcItem = (
    idx: number,
    field: "item_name" | "price",
    value: string,
  ) =>
    setProcForm((f) => ({
      ...f,
      items: f.items.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item,
      ),
    }));

  const handleSaveProc = async () => {
    if (!procForm.procedure_date || procForm.items.length === 0) {
      toast.error("Completa la fecha y al menos un item");
      return;
    }
    setIsSavingProc(true);
    const token = Cookies.get("XSRF-TOKEN") ?? "";
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/v1/procedures/${editingProcId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": token,
          },
          body: JSON.stringify({
            procedure_date: procForm.procedure_date,
            notes: procForm.notes,
            items: procForm.items.map((i) => ({
              item_name: i.item_name,
              price: parseFloat(i.price) || 0,
            })),
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { message?: string }).message ?? "Error al guardar",
        );
      }
      toast.success("Procedimiento actualizado");
      closeEditProc();
      mutate();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setIsSavingProc(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <p className="text-center py-10">Cargando historial...</p>
      </MainLayout>
    );
  }

  if (error || !data?.data) {
    return (
      <MainLayout>
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Error al cargar datos del paciente.
        </div>
      </MainLayout>
    );
  }

  const evaluation = data.data;
  const patient = evaluation.patient;
  const procedures = evaluation.procedures || [];
  const brandName = evaluation.user?.brand_name;
  const referrer = evaluation.referrer_name;
  const status: keyof typeof STATUS_CONFIG = evaluation.status ?? "EN_ESPERA";
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.EN_ESPERA;
  const isConfirmed = status === "CONFIRMADO";
  const isCanceled = status === "CANCELADO";
  const liveTotal = procForm.items.reduce(
    (s, i) => s + (parseFloat(i.price) || 0),
    0,
  );

  return (
    <AuthGuard>
      <MainLayout>
        <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="max-w-5xl mx-auto">
              <RegisterHeaderBar
                onStatsClick={() => router.push("/stats")}
                onImagesClick={() => router.push("/control-images")}
                onPatientsClick={() => router.push("/patients")}
                onBackToRegisterClick={() => router.push("/register-patient")}
                onRemitentesClick={() => router.push("/admin/remitentes")}
                active="patients"
              />

              <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
                Registro clinico del paciente
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Historial medico con procedimientos, notas clinicas y costos
                asociados.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 mb-6">
                <BackButton />
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusCfg.classes}`}
                  >
                    {status === "CONFIRMADO" && (
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                    )}
                    {status === "CANCELADO" && (
                      <XCircleIcon className="h-3.5 w-3.5" />
                    )}
                    {statusCfg.label}
                  </span>
                  {!isConfirmed && (
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      disabled={isChangingStatus}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Confirmar
                    </button>
                  )}
                  {!isCanceled && (
                    <button
                      onClick={() => handleStatusChange("cancelar")}
                      disabled={isChangingStatus}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                    >
                      <XCircleIcon className="h-4 w-4" />
                      Cancelar
                    </button>
                  )}
                  <ExportButton
                    targetRef={invoiceRef}
                    filename={`factura-paciente-${patientId}.pdf`}
                    label="Imprimir factura"
                  />
                  <ExportButton
                    targetRef={exportRef}
                    filename={`historia-clinica-paciente-${patientId}.pdf`}
                  />
                </div>
              </div>

              <div
                ref={exportRef}
                className="max-w-5xl mx-auto bg-white border border-gray-100 shadow-md rounded-2xl"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start px-4 sm:px-8 py-6 bg-white rounded-t-2xl gap-4">
                  <div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 p-[2px] shadow-sm">
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                          <Image
                            src="/coldestheticlogo.png"
                            alt="Coldesthetic"
                            width={32}
                            height={32}
                            className="h-full w-full object-contain"
                            priority
                          />
                        </div>
                      </div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
                        {brandName}
                      </h1>
                    </div>
                    <p className="ml-12 text-[10px] uppercase tracking-wider text-gray-400">
                      Realiza tus suenos de una forma segura
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-end gap-6 text-[13px] text-gray-700">
                    <div className="flex flex-col items-start">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                        Remitente
                      </p>
                      <div className="flex items-center gap-1">
                        <CheckBadgeIcon className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium">{referrer}</span>
                      </div>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex flex-col items-start">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                        Fecha
                      </p>
                      <p className="font-medium">
                        {(() => {
                          const fecha = new Date(
                            evaluation.procedures?.[0]?.procedure_date ??
                              evaluation.created_at,
                          ).toLocaleString("es-ES", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          });
                          return fecha.charAt(0).toUpperCase() + fecha.slice(1);
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 mt-1 mb-3" />

                <div className="px-4 sm:px-8 py-6 space-y-10">
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="h-5 w-1 bg-emerald-500 rounded-full" />
                      <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
                        Datos personales
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 rounded-xl border border-gray-200 bg-white p-4 text-sm">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Nombre completo
                        </p>
                        <p className="font-medium text-gray-800">
                          {patient.first_name} {patient.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Cedula
                        </p>
                        <p className="font-medium text-gray-800">
                          {patient.cedula}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Fecha de nacimiento
                        </p>
                        <p className="font-medium text-gray-800">
                          {new Date(patient.date_of_birth).toLocaleDateString(
                            "es-ES",
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Edad
                        </p>
                        <p className="font-medium text-gray-800">
                          {evaluation.patient_age_at_evaluation} anos
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Sexo biologico
                        </p>
                        <p className="font-medium text-gray-800">
                          {patient.biological_sex}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Celular
                        </p>
                        <p className="font-medium text-gray-800">
                          {patient.cellphone}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-1 bg-blue-500 rounded-full" />
                        <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
                          Evaluacion clinica
                        </h3>
                      </div>
                      {!isConfirmed && (
                        <button
                          onClick={openEditEval}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition print:hidden"
                        >
                          <PencilSquareIcon className="h-3.5 w-3.5" />
                          Editar
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Peso
                        </p>
                        <p className="font-medium">{evaluation.weight} kg</p>
                        <div className="border-t border-gray-100 mt-2" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Estatura
                        </p>
                        <p className="font-medium">{evaluation.height} m</p>
                        <div className="border-t border-gray-100 mt-2" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          IMC
                        </p>
                        <p className="font-semibold text-blue-600">
                          {evaluation.bmi}
                        </p>
                        <div className="border-t border-gray-100 mt-2" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-0.5">
                          Estado IMC
                        </p>
                        <span className="inline-block mt-1 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                          {evaluation.bmi_status}
                        </span>
                        <div className="border-t border-gray-100 mt-2" />
                      </div>
                    </div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                      Antecedentes medicos
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm">
                      <p className="text-gray-700">
                        {evaluation.medical_background}
                      </p>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="h-5 w-1 bg-emerald-500 rounded-full" />
                      <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
                        Procedimientos y precios
                      </h3>
                    </div>
                    {procedures.map((proc: any) => (
                      <div key={proc.id} className="space-y-4 mb-8">
                        <div className="flex justify-end print:hidden">
                          <button
                            onClick={() => openEditProc(proc)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                          >
                            <PencilSquareIcon className="h-3.5 w-3.5" />
                            Editar procedimiento
                          </button>
                        </div>
                        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                              <th className="text-[10px] uppercase font-bold text-gray-500 tracking-wide text-left py-3 px-3">
                                Procedimiento
                              </th>
                              <th className="text-[10px] uppercase font-bold text-gray-500 tracking-wide text-right py-3 px-3">
                                Precio unitario
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {proc.items.map((item: any) => (
                              <tr
                                key={item.id}
                                className="border-t border-gray-100"
                              >
                                <td className="py-2 px-3 text-gray-700">
                                  {item.item_name}
                                </td>
                                <td className="py-2 px-3 text-right font-medium text-gray-800">
                                  ${Number(item.price).toLocaleString("es-CO")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Notas clinicas
                        </p>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm italic text-gray-600">
                          {proc.notes}
                        </div>
                        <div className="text-right">
                          <div className="border-t border-gray-100 mt-1 mb-4" />
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">
                            Valor clinico total
                          </p>
                          <p className="text-4xl font-extrabold text-green-500">
                            ${Number(proc.total_amount).toLocaleString("es-CO")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </section>
                </div>

                {evaluation.patient_signature && (
                  <div className="px-4 sm:px-8 pb-6">
                    <div className="border-t border-gray-100 mb-6" />
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-3">
                      Firma de la paciente
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                      <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-2 inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={evaluation.patient_signature}
                          alt="Firma de la paciente"
                          className="h-24 object-contain"
                        />
                      </div>
                      <div className="text-xs text-gray-500 space-y-0.5">
                        {evaluation.confirmed_at && (
                          <p>
                            Firmado el{" "}
                            {new Date(evaluation.confirmed_at).toLocaleString(
                              "es-CO",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        )}
                        <p className="text-gray-400 italic">
                          La paciente confirma haber leído y aceptado el
                          registro clínico.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 text-center text-[10px] text-gray-400 py-4">
                  Coldesthetic - Historia Clinica (c) {currentYear} | Documento
                  confidencial
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>

      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeConfirmModal()}
        >
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-gray-900">
                Confirmar valoración
              </h2>
              <button
                onClick={closeConfirmModal}
                className="rounded-full p-1.5 hover:bg-gray-100 transition"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
              {/* Términos y condiciones */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                  Términos y condiciones
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600 space-y-2 max-h-44 overflow-y-auto">
                  <p>
                    Al confirmar esta valoración, la paciente declara que ha
                    leído, comprendido y acepta el registro clínico elaborado
                    por el profesional de Cold Esthetic.
                  </p>
                  <p>
                    La paciente confirma que la información personal y clínica
                    suministrada es verídica y autoriza su uso con fines
                    estrictamente médicos y de seguimiento.
                  </p>
                  <p>
                    La paciente entiende que los procedimientos descritos en
                    este documento se realizarán bajo su consentimiento
                    informado y que puede contactar al profesional ante
                    cualquier duda o complicación posterior.
                  </p>
                  <p>
                    Este documento tiene validez legal como constancia de
                    aceptación del tratamiento y del plan de procedimientos
                    acordado.
                  </p>
                </div>
              </div>

              {/* Checkbox aceptar */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-emerald-600"
                />
                <span className="text-sm text-gray-700">
                  He leído y acepto los términos y condiciones anteriores.
                </span>
              </label>

              {/* Pad de firma */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Firma de la paciente
                  </p>
                  <button
                    type="button"
                    onClick={() => sigCanvasRef.current?.clear()}
                    className="text-xs text-gray-400 hover:text-red-500 transition"
                  >
                    Limpiar
                  </button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                  <SignatureCanvas
                    ref={sigCanvasRef}
                    penColor="#1f2937"
                    canvasProps={{
                      className: "w-full",
                      style: { height: "160px", width: "100%" },
                    }}
                    backgroundColor="rgb(249,250,251)"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Firme dentro del recuadro con el ratón o el dedo.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                disabled={isConfirming}
                className="flex items-center gap-2 px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50"
              >
                <CheckCircleIcon className="h-4 w-4" />
                {isConfirming ? "Confirmando..." : "Confirmar valoración"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditEval && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) =>
            e.target === e.currentTarget && setShowEditEval(false)
          }
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                Editar evaluacion clinica
              </h2>
              <button
                onClick={() => setShowEditEval(false)}
                className="rounded-full p-1.5 hover:bg-gray-100 transition"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={evalForm.weight}
                    onChange={(e) =>
                      setEvalForm((f) => ({ ...f, weight: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Estatura (m) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={evalForm.height}
                    onChange={(e) =>
                      setEvalForm((f) => ({ ...f, height: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>
              {evalForm.weight && evalForm.height && (
                <p className="text-xs text-blue-600 font-semibold">
                  IMC estimado:{" "}
                  {(
                    parseFloat(evalForm.weight) /
                    Math.pow(parseFloat(evalForm.height), 2)
                  ).toFixed(2)}
                </p>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Antecedentes medicos *
                </label>
                <textarea
                  value={evalForm.medical_background}
                  onChange={(e) =>
                    setEvalForm((f) => ({
                      ...f,
                      medical_background: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                  rows={4}
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowEditEval(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEval}
                disabled={isSavingEval}
                className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                {isSavingEval ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingProcId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeEditProc()}
        >
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-gray-900">
                Editar procedimiento
              </h2>
              <button
                onClick={closeEditProc}
                className="rounded-full p-1.5 hover:bg-gray-100 transition"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Fecha del procedimiento *
                </label>
                <input
                  type="date"
                  value={procForm.procedure_date}
                  onChange={(e) =>
                    setProcForm((f) => ({
                      ...f,
                      procedure_date: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Notas clinicas
                </label>
                <textarea
                  value={procForm.notes}
                  onChange={(e) =>
                    setProcForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none"
                  rows={3}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Items *
                  </label>
                  <button
                    onClick={addProcItem}
                    className="flex items-center gap-1 text-xs text-emerald-600 font-medium hover:text-emerald-700"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    Agregar item
                  </button>
                </div>
                <div className="space-y-2">
                  {procForm.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Nombre del procedimiento"
                        value={item.item_name}
                        onChange={(e) =>
                          updateProcItem(idx, "item_name", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Precio"
                        value={item.price}
                        onChange={(e) =>
                          updateProcItem(idx, "price", e.target.value)
                        }
                        className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      />
                      <button
                        onClick={() => removeProcItem(idx)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {procForm.items.length > 0 && (
                  <p className="text-right text-sm font-semibold text-emerald-700 mt-2">
                    Total: ${liveTotal.toLocaleString("es-CO")}
                  </p>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button
                onClick={closeEditProc}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProc}
                disabled={isSavingProc}
                className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50"
              >
                {isSavingProc ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Factura oculta — solo se usa para generar el PDF */}
      <div className="fixed -left-[9999px] top-0" aria-hidden="true">
        <div
          ref={invoiceRef}
          className="bg-white font-sans"
          style={{ width: "794px", padding: "48px" }}
        >
          {/* Encabezado */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "32px",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#059669",
                  marginBottom: "2px",
                }}
              >
                {evaluation?.user?.brand_name ?? "Coldesthetic"}
              </p>
              <p
                style={{
                  fontSize: "10px",
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Realiza tus sueños de una forma segura
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: "10px",
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  marginBottom: "2px",
                }}
              >
                Factura N°
              </p>
              <p
                style={{ fontSize: "18px", fontWeight: 700, color: "#1f2937" }}
              >
                #{String(evaluationId).padStart(5, "0")}
              </p>
              <p
                style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}
              >
                {(evaluation?.procedures?.[0]?.procedure_date ??
                evaluation?.created_at)
                  ? new Date(
                      evaluation?.procedures?.[0]?.procedure_date ??
                        evaluation.created_at,
                    ).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </p>
            </div>
          </div>

          <div
            style={{ borderTop: "1px solid #e5e7eb", marginBottom: "28px" }}
          />

          {/* Datos de la paciente */}
          <div style={{ marginBottom: "28px" }}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "10px",
              }}
            >
              Datos de la paciente
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
                background: "#f9fafb",
                borderRadius: "10px",
                padding: "16px",
                fontSize: "12px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    marginBottom: "3px",
                  }}
                >
                  Nombre
                </p>
                <p style={{ fontWeight: 600, color: "#1f2937" }}>
                  {evaluation?.patient?.first_name}{" "}
                  {evaluation?.patient?.last_name}
                </p>
              </div>
              <div>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    marginBottom: "3px",
                  }}
                >
                  Cédula
                </p>
                <p style={{ fontWeight: 600, color: "#1f2937" }}>
                  {evaluation?.patient?.cedula}
                </p>
              </div>
              <div>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    marginBottom: "3px",
                  }}
                >
                  Remitente
                </p>
                <p style={{ fontWeight: 600, color: "#1f2937" }}>
                  {evaluation?.referrer_name ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Tabla de procedimientos */}
          <div style={{ marginBottom: "24px" }}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "10px",
              }}
            >
              Procedimientos
            </p>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
              }}
            >
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      color: "#6b7280",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      borderRadius: "6px 0 0 6px",
                    }}
                  >
                    Descripción
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "10px 12px",
                      color: "#6b7280",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      borderRadius: "0 6px 6px 0",
                    }}
                  >
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {evaluation?.procedures?.flatMap((proc: any) =>
                  proc.items.map((item: any) => (
                    <tr
                      key={item.id}
                      style={{ borderBottom: "1px solid #f3f4f6" }}
                    >
                      <td style={{ padding: "10px 12px", color: "#374151" }}>
                        {item.item_name}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: "#1f2937",
                          fontWeight: 600,
                        }}
                      >
                        ${Number(item.price).toLocaleString("es-CO")}
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "36px",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <div
                style={{ borderTop: "2px solid #e5e7eb", paddingTop: "12px" }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "4px",
                  }}
                >
                  Total a pagar
                </p>
                <p
                  style={{
                    fontSize: "32px",
                    fontWeight: 800,
                    color: "#059669",
                  }}
                >
                  $
                  {evaluation?.procedures
                    ?.reduce(
                      (sum: number, proc: any) =>
                        sum + Number(proc.total_amount),
                      0,
                    )
                    .toLocaleString("es-CO")}
                </p>
              </div>
            </div>
          </div>

          {/* Firma */}
          {evaluation?.patient_signature && (
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{ borderTop: "1px solid #e5e7eb", marginBottom: "20px" }}
              />
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "10px",
                }}
              >
                Firma de la paciente
              </p>
              <div
                style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}
              >
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "8px",
                    background: "#f9fafb",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={evaluation.patient_signature}
                    alt="Firma"
                    style={{ height: "80px", objectFit: "contain" }}
                  />
                </div>
                <div style={{ fontSize: "10px", color: "#9ca3af" }}>
                  {evaluation.confirmed_at && (
                    <p>
                      Firmado el{" "}
                      {new Date(evaluation.confirmed_at).toLocaleString(
                        "es-CO",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  )}
                  <p style={{ fontStyle: "italic" }}>
                    La paciente acepta los procedimientos y valores descritos en
                    este documento.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pie de página */}
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "12px",
              textAlign: "center",
              fontSize: "9px",
              color: "#9ca3af",
            }}
          >
            Coldesthetic — Factura © {currentYear} | Documento confidencial
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
