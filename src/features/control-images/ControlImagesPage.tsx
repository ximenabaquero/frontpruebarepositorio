"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Image from "next/image";
import MainLayout from "@/layouts/MainLayout";
import RegisterHeaderBar from "../post-login/components/RegisterHeaderBar";
import AuthGuard from "@/components/AuthGuard";
import { endpoints } from "./services/ClinicalImagesService";
import type { ClinicalImage } from "./types/ClinicalImage";
import {
  PlusIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

export default function ControlImagesPage() {
  const router = useRouter();
  const {
    data: images,
    error,
    isLoading,
    mutate,
  } = useSWR<ClinicalImage[]>(endpoints.list, fetcher);

  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);

  // Live preview URLs
  const [beforePreviewUrl, setBeforePreviewUrl] = useState<string | null>(null);
  const [afterPreviewUrl, setAfterPreviewUrl] = useState<string | null>(null);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setBeforeImage(null);
    setAfterImage(null);
    setBeforePreviewUrl(null);
    setAfterPreviewUrl(null);
    setEditingId(null);
    setShowModal(false);
  };

  const handleBeforeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBeforeImage(file);
    setBeforePreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAfterImage(file);
    setAfterPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || (!editingId && (!beforeImage || !afterImage))) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsUploading(true);
    const token = Cookies.get("XSRF-TOKEN") ?? "";

    try {
      const formData = new FormData();
      formData.append("title", title);
      if (description) formData.append("description", description);
      if (beforeImage) formData.append("before_image", beforeImage);
      if (afterImage) formData.append("after_image", afterImage);

      const url = editingId ? endpoints.update(editingId) : endpoints.create;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "X-XSRF-TOKEN": token },
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al guardar");

      toast.success(editingId ? "Imagen actualizada" : "Imagen creada");
      mutate();
      resetForm();
    } catch (error) {
      toast.error("Error al procesar la solicitud");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (image: ClinicalImage) => {
    setEditingId(image.id);
    setTitle(image.title);
    setDescription(image.description || "");
    setBeforeImage(null);
    setAfterImage(null);
    setBeforePreviewUrl(getImageUrl(image.before_image));
    setAfterPreviewUrl(getImageUrl(image.after_image));
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta imagen?")) return;
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
  };

  const getImageUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/${path}`;
  };

  const hasPreview = beforePreviewUrl || afterPreviewUrl;

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
                active="images"
              />

              {/* Header */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Gestión de imágenes clínicas
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Imágenes comparativas antes / después de los tratamientos.
                  </p>
                </div>
                <button
                  onClick={() => { setEditingId(null); setShowModal(true); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition shadow-sm shrink-0"
                >
                  <PlusIcon className="h-4 w-4" />
                  Nueva imagen
                </button>
              </div>

              {/* Stats strip */}
              {images && images.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <PhotoIcon className="h-4 w-4" />
                  <span>{images.length} imagen{images.length !== 1 ? "es" : ""} publicada{images.length !== 1 ? "s" : ""}</span>
                </div>
              )}

              {/* Gallery */}
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

                {!isLoading && images && images.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-gray-200 bg-white">
                    <PhotoIcon className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">Aún no hay imágenes</p>
                    <p className="text-sm text-gray-400 mt-1">Crea la primera haciendo clic en "Nueva imagen"</p>
                  </div>
                )}

                {images && images.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group"
                      >
                        {/* Before / After images */}
                        <div className="grid grid-cols-2 gap-0.5 bg-gray-100">
                          <div className="relative aspect-square">
                            <img
                              src={getImageUrl(image.before_image)}
                              alt={`${image.title} - Antes`}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                              ANTES
                            </span>
                          </div>
                          <div className="relative aspect-square">
                            <img
                              src={getImageUrl(image.after_image)}
                              alt={`${image.title} - Después`}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-emerald-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                              DESPUÉS
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 text-sm mb-0.5 truncate">
                            {image.title}
                          </h3>
                          {image.description && (
                            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                              {image.description}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleEdit(image)}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                            >
                              <PencilSquareIcon className="h-3.5 w-3.5" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(image.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>

      {/* ===== MODAL con fondo borroso ===== */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && resetForm()}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? "Editar imagen" : "Nueva imagen clínica"}
              </h2>
              <button
                onClick={resetForm}
                className="rounded-full p-1.5 hover:bg-gray-100 transition"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body (scrollable) */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Título */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    maxLength={100}
                    placeholder="Ej. Liposucción abdominal"
                    required
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Descripción
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none"
                    rows={2}
                    placeholder="Breve descripción del tratamiento..."
                  />
                </div>

                {/* Upload área */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Antes */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                      Imagen Antes {!editingId && "*"}
                    </label>
                    <div
                      onClick={() => beforeInputRef.current?.click()}
                      className="relative cursor-pointer rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-400 transition overflow-hidden aspect-square bg-gray-50 flex items-center justify-center"
                    >
                      {beforePreviewUrl ? (
                        <img
                          src={beforePreviewUrl}
                          alt="Preview antes"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <PhotoIcon className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                          <p className="text-xs text-gray-400">
                            Haz clic para seleccionar
                          </p>
                        </div>
                      )}
                      {beforePreviewUrl && (
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition flex items-center justify-center">
                          <span className="opacity-0 hover:opacity-100 text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">
                            Cambiar
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={beforeInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleBeforeChange}
                      className="hidden"
                    />
                  </div>

                  {/* Después */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                      Imagen Después {!editingId && "*"}
                    </label>
                    <div
                      onClick={() => afterInputRef.current?.click()}
                      className="relative cursor-pointer rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-400 transition overflow-hidden aspect-square bg-gray-50 flex items-center justify-center"
                    >
                      {afterPreviewUrl ? (
                        <img
                          src={afterPreviewUrl}
                          alt="Preview después"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <PhotoIcon className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                          <p className="text-xs text-gray-400">
                            Haz clic para seleccionar
                          </p>
                        </div>
                      )}
                      {afterPreviewUrl && (
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition flex items-center justify-center">
                          <span className="opacity-0 hover:opacity-100 text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">
                            Cambiar
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={afterInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleAfterChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Previsualización de cómo quedará en el inicio */}
                {hasPreview && (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-3">
                      Vista previa — así se verá en la página de inicio
                    </p>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-xs mx-auto">
                      <div className="grid grid-cols-2 gap-0.5 bg-gray-100">
                        <div className="relative aspect-square">
                          {beforePreviewUrl ? (
                            <img
                              src={beforePreviewUrl}
                              alt="Antes"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <PhotoIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            ANTES
                          </span>
                        </div>
                        <div className="relative aspect-square">
                          {afterPreviewUrl ? (
                            <img
                              src={afterPreviewUrl}
                              alt="Después"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <PhotoIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <span className="absolute top-1.5 left-1.5 bg-emerald-600/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            DESPUÉS
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {title || "Título del tratamiento"}
                        </p>
                        {description && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit row is handled in footer */}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isUploading}
                className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50"
              >
                {isUploading ? "Guardando..." : editingId ? "Actualizar imagen" : "Publicar imagen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
