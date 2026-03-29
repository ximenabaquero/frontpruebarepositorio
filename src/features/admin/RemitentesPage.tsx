"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import MainLayout from "@/layouts/MainLayout";
import RegisterHeaderBar from "../post-login/components/RegisterHeaderBar";
import AuthGuard from "@/components/AuthGuard";
import RoleGuard from "@/components/RoleGuard";
import ConfirmModal from "@/components/ConfirmModal";
import { PlusIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import RemitenteFormModal from "./components/RemitenteFormModal";
import RemitentesTable from "./components/RemitentesTable";
import type { Remitente } from "./types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

const fetcher = (url: string) => {
  const token = Cookies.get("XSRF-TOKEN") ?? "";
  return fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json", "X-XSRF-TOKEN": token },
  })
    .then((r) => r.json())
    .then((json) => json.data || []);
};

export default function RemitentesPage() {
  const router = useRouter();
  const { data: remitentes, isLoading, error, mutate } = useSWR<Remitente[]>(
    `${apiBaseUrl}/api/v1/remitentes`,
    fetcher,
  );

  const [showModal, setShowModal] = useState(false);
  const [editingRemitente, setEditingRemitente] = useState<Remitente | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    message: string;
    variant: "danger" | "warning" | "default";
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);

  const openCreate = () => { setEditingRemitente(null); setShowModal(true); };
  const openEdit = (r: Remitente) => { setEditingRemitente(r); setShowModal(true); };

  const changeStatus = (id: number, action: "activar" | "inactivar" | "despedir", label: string) => {
    const variant = action === "despedir" ? "danger" : action === "inactivar" ? "warning" : "default";
    setConfirmModal({
      message: `¿Seguro que deseas ${label.toLowerCase()} a este remitente?`,
      variant,
      confirmLabel: label,
      onConfirm: async () => {
        setConfirmModal(null);
        const token = Cookies.get("XSRF-TOKEN") ?? "";
        try {
          const res = await fetch(`${apiBaseUrl}/api/v1/remitentes/${id}/${action}`, {
            method: "PATCH",
            credentials: "include",
            headers: { Accept: "application/json", "X-XSRF-TOKEN": token },
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error((err as { message?: string }).message ?? "Error al cambiar estado");
          }
          toast.success(`Remitente ${label.toLowerCase()} correctamente`);
          mutate();
        } catch (e: unknown) {
          toast.error(e instanceof Error ? e.message : "Error inesperado");
        }
      },
    });
  };

  const list = Array.isArray(remitentes) ? remitentes : [];
  const stats = list.reduce(
    (acc, r) => { acc[r.status]++; return acc; },
    { active: 0, inactive: 0, fired: 0 },
  );

  return (
    <AuthGuard>
      <RoleGuard allow={["ADMIN"]}>
        <MainLayout>
          <div className="bg-gradient-to-b from-emerald-50 via-white to-white min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="max-w-6xl mx-auto">
                <RegisterHeaderBar
                  onBackToRegisterClick={() => router.push("/register-patient")}
                  onImagesClick={() => router.push("/control-images")}
                  onPatientsClick={() => router.push("/patients")}
                  onStatsClick={() => router.push("/stats")}
                  onRemitentesClick={() => router.push("/admin/remitentes")}
                  onInventoryClick={() => router.push("/inventory")}
                  active="remitentes"
                />

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Remitentes</h1>
                    <p className="mt-1 text-sm text-gray-500">Crea, modifica o desactiva los remitentes del sistema.</p>
                  </div>
                  <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition shadow-sm shrink-0"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Nuevo remitente
                  </button>
                </div>

                {list.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="font-semibold">{stats.active} Activos</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-yellow-700">
                      <span className="h-2 w-2 rounded-full border-2 border-yellow-500 shrink-0" />
                      <span className="font-semibold">{stats.inactive} Inactivos</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-600">
                      <NoSymbolIcon className="h-3 w-3 text-red-500 shrink-0" />
                      <span className="font-semibold">{stats.fired} Despedidos</span>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  {isLoading && (
                    <div className="flex justify-center py-16">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                    </div>
                  )}
                  {error && <p className="text-center text-red-500 py-8">Error al cargar los remitentes.</p>}
                  {!isLoading && !error && (
                    <RemitentesTable
                      remitentes={list}
                      onEdit={openEdit}
                      onChangeStatus={changeStatus}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </MainLayout>

        {showModal && (
          <RemitenteFormModal
            remitente={editingRemitente}
            onClose={() => setShowModal(false)}
            onSaved={() => mutate()}
          />
        )}

        <ConfirmModal
          isOpen={!!confirmModal}
          message={confirmModal?.message ?? ""}
          variant={confirmModal?.variant ?? "default"}
          confirmLabel={confirmModal?.confirmLabel ?? "Confirmar"}
          onConfirm={() => confirmModal?.onConfirm()}
          onCancel={() => setConfirmModal(null)}
        />
      </RoleGuard>
    </AuthGuard>
  );
}
