"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { CheckCircleIcon, XCircleIcon, ArrowDownTrayIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

import RegisterHeaderBar from "../../post-login/components/RegisterHeaderBar";
import ExportButton from "../../../components/ExportButton";
import BackButton from "../../../components/BackButton";
import AuthGuard from "@/components/AuthGuard";
import ClinicalRecordView from "./ClinicalRecordView";
import ConfirmacionModal from "./ConfirmacionModal";
import EditarEvaluacionModal from "./EditarEvaluacionModal";
import EditarProcedimientoModal from "./EditarProcedimientoModal";
import SuppliesRegistrationModal from "./SuppliesRegistrationModal";
import InvoicePdf from "./InvoicePdf";
import HistoriaClinicaPdf from "./HistoriaClinicaPdf";
import type { Procedure } from "../types";
import type { InventoryProduct } from "@/features/inventory/types";

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

const STATUS_CONFIG = {
  EN_ESPERA: { label: "En espera", classes: "bg-yellow-100 text-yellow-700" },
  CONFIRMADO: { label: "Confirmado", classes: "bg-emerald-100 text-emerald-700" },
  CANCELADO: { label: "Cancelado", classes: "bg-red-100 text-red-600" },
} as const;

export default function PatientRecordDetail({ patientId, evaluationId }: Props) {
  const [currentYear] = useState(new Date().getFullYear());
  const historiaRef = useRef<HTMLDivElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditEval, setShowEditEval] = useState(false);
  const [editingProc, setEditingProc] = useState<Procedure | null>(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSuppliesModal, setShowSuppliesModal] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    evaluationId
      ? `${apiBaseUrl}/api/v1/patients/${patientId}/clinical-records/${evaluationId}`
      : null,
    fetcher,
  );

  // Fetch de productos de inventario
  const { data: productsData } = useSWR<{ data: InventoryProduct[] }>(
    `${apiBaseUrl}/api/v1/inventory/products`,
    fetcher
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
        throw new Error((err as { message?: string }).message ?? "Error al cambiar estado");
      }
      toast.success(action === "confirmar" ? "Valoracion confirmada" : "Valoracion cancelada");
      mutate();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setIsChangingStatus(false);
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
  const status: keyof typeof STATUS_CONFIG = evaluation.status ?? "EN_ESPERA";
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.EN_ESPERA;
  const isConfirmed = status === "CONFIRMADO";
  const isCanceled = status === "CANCELADO";

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
                onInventoryClick={() => router.push("/inventory")}
                active="patients"
              />

              <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
                Registro clínico del paciente
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Historial médico con procedimientos, notas clínicas y costos asociados.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 mb-6">
                <BackButton />
                <div className="flex flex-wrap items-center gap-2">
                  {/* Segmented status control */}
                  <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm p-1 gap-1">
                    {/* En espera */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      status === "EN_ESPERA"
                        ? "bg-yellow-100 text-yellow-700"
                        : "text-gray-400 opacity-50"
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                      En espera
                    </div>

                    <div className="w-px h-4 bg-gray-200" />

                    {/* Confirmar */}
                    <button
                      onClick={() => !isConfirmed && setShowConfirmModal(true)}
                      disabled={isChangingStatus || isConfirmed}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isConfirmed
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50"
                      }`}
                    >
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                      Confirmar
                    </button>

                    <div className="w-px h-4 bg-gray-200" />

                    {/* Cancelar */}
                    <button
                      onClick={() => !isCanceled && setShowCancelModal(true)}
                      disabled={isChangingStatus || isCanceled}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isCanceled
                          ? "bg-red-100 text-red-600"
                          : "text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                      }`}
                    >
                      <XCircleIcon className="h-3.5 w-3.5" />
                      Cancelar
                    </button>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      Exportar
                      <ChevronDownIcon className="w-3 h-3" />
                    </button>
                    {showExportMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowExportMenu(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                          <ExportButton
                            targetRef={invoiceRef}
                            filename={`factura-paciente-${patientId}.pdf`}
                            label="Imprimir factura"
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 border-b border-gray-100"
                            onExportStart={() => setShowExportMenu(false)}
                          />
                          <ExportButton
                            targetRef={historiaRef}
                            filename={`historia-clinica-paciente-${patientId}.pdf`}
                            label="Exportar historia clínica"
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                            onExportStart={() => setShowExportMenu(false)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <ClinicalRecordView
                evaluation={evaluation}
                currentYear={currentYear}
                isConfirmed={isConfirmed}
                status={status}
                onEditEval={() => setShowEditEval(true)}
                onEditProc={(proc) => setEditingProc(proc)}
                onRegisterSupplies={() => setShowSuppliesModal(true)}
              />
            </div>
          </div>
        </div>
      </MainLayout>

      {showCancelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowCancelModal(false)}
        >
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Cancelar registro</h2>
              <button
                onClick={() => setShowCancelModal(false)}
                className="rounded-full p-1.5 hover:bg-gray-100 transition"
              >
                <XCircleIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600">
                ¿Está seguro que desea cancelar este registro clínico? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Volver
              </button>
              <button
                onClick={() => { setShowCancelModal(false); handleStatusChange("cancelar"); }}
                disabled={isChangingStatus}
                className="flex items-center gap-2 px-5 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
              >
                <XCircleIcon className="h-4 w-4" />
                {isChangingStatus ? "Cancelando..." : "Sí, cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <ConfirmacionModal
          evaluationId={evaluationId}
          onClose={() => setShowConfirmModal(false)}
          onConfirmed={() => mutate()}
        />
      )}

      {showEditEval && (
        <EditarEvaluacionModal
          evaluationId={evaluationId}
          initialData={{
            weight: String(evaluation.weight ?? ""),
            height: String(evaluation.height ?? ""),
            medical_background: evaluation.medical_background ?? "",
          }}
          onClose={() => setShowEditEval(false)}
          onSaved={() => mutate()}
        />
      )}

      {editingProc !== null && (
        <EditarProcedimientoModal
          procedureId={editingProc.id}
          initialData={{
            notes: editingProc.notes ?? "",
            items: editingProc.items.map((i) => ({
              id: i.id,
              item_name: i.item_name,
              price: Math.round(parseFloat(String(i.price))).toLocaleString("es-CO"),
            })),
          }}
          onClose={() => setEditingProc(null)}
          onSaved={() => mutate()}
        />
      )}

      {showSuppliesModal && productsData?.data && (
        <SuppliesRegistrationModal
          evaluationId={evaluationId}
          products={productsData.data}
          onClose={() => setShowSuppliesModal(false)}
          onSaved={() => {
            mutate();
            setShowSuppliesModal(false);
          }}
        />
      )}

      <InvoicePdf
        ref={invoiceRef}
        evaluation={evaluation}
        evaluationId={evaluationId}
        currentYear={currentYear}
      />
      <HistoriaClinicaPdf
        ref={historiaRef}
        evaluation={evaluation}
        evaluationId={evaluationId}
        currentYear={currentYear}
      />
    </AuthGuard>
  );
}
