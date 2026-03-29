"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import MainLayout from "@/layouts/MainLayout";
import RegisterHeaderBar from "../post-login/components/RegisterHeaderBar";
import AuthGuard from "@/components/AuthGuard";
import ConfirmModal from "@/components/ConfirmModal";
import { useAuth } from "@/features/auth/AuthContext";
import { endpoints } from "./services/ClinicalImagesService";
import type { ClinicalImage } from "./types/ClinicalImage";
import { PlusIcon, PhotoIcon } from "@heroicons/react/24/outline";
import ClinicalImageFormModal from "./components/ClinicalImageFormModal";
import ClinicalImageGallery from "./components/ClinicalImageGallery";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" })
    .then((res) => res.json())
    .then((json) => json.data || []);

export default function ControlImagesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { data: images, error, isLoading, mutate } = useSWR<ClinicalImage[]>(endpoints.list, fetcher);

  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<ClinicalImage | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);

  const openCreate = () => { setEditingImage(null); setShowModal(true); };
  const openEdit = (image: ClinicalImage) => { setEditingImage(image); setShowModal(true); };

  const handleDelete = (id: number) => {
    setConfirmModal({
      message: "Esta acción eliminará la imagen permanentemente.",
      onConfirm: async () => {
        setConfirmModal(null);
        const token = Cookies.get("XSRF-TOKEN") ?? "";
        try {
          const response = await fetch(endpoints.delete(id), {
            method: "DELETE",
            headers: { "X-XSRF-TOKEN": token },
            credentials: "include",
          });
          if (!response.ok) throw new Error("Error al eliminar");
          toast.success("Imagen eliminada");
          mutate();
        } catch (error) {
          toast.error("Error al eliminar");
          console.error(error);
        }
      },
    });
  };

  const list = images ?? [];
  const atLimit = list.length >= 10;

  return (
    <AuthGuard>
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
                active="images"
              />

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {isAdmin ? "Gestión de imágenes clínicas" : "Imágenes clínicas"}
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Imágenes comparativas antes / después de los tratamientos.
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={openCreate}
                    disabled={atLimit}
                    title={atLimit ? "Límite de 10 imágenes alcanzado" : undefined}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition shadow-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Nueva imagen
                  </button>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                {list.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <PhotoIcon className="h-4 w-4" />
                    <span>{list.length} imagen{list.length !== 1 ? "es" : ""} publicada{list.length !== 1 ? "s" : ""}</span>
                  </div>
                )}
                {isAdmin && atLimit && (
                  <p className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                    Límite máximo alcanzado (10/10). Elimina una imagen para agregar otra.
                  </p>
                )}
              </div>

              <div className="mt-8">
                {isLoading && (
                  <div className="text-center py-16">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                    <p className="mt-3 text-sm text-gray-400">Cargando imágenes...</p>
                  </div>
                )}
                {error && (
                  <div className="text-center py-12">
                    <p className="text-red-500">Error al cargar las imágenes</p>
                  </div>
                )}
                {!isLoading && !error && (
                  <ClinicalImageGallery
                    images={list}
                    isAdmin={isAdmin}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>

      {showModal && (
        <ClinicalImageFormModal
          image={editingImage}
          onClose={() => setShowModal(false)}
          onSaved={() => mutate()}
        />
      )}

      <ConfirmModal
        isOpen={!!confirmModal}
        title="¿Seguro que deseas eliminar esta imagen?"
        message={confirmModal?.message ?? ""}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={() => confirmModal?.onConfirm()}
        onCancel={() => setConfirmModal(null)}
      />
    </AuthGuard>
  );
}
