"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import MainLayout from "@/layouts/MainLayout";
import RegisterHeaderBar from "../post-login/components/RegisterHeaderBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { endpoints } from "./services/ClinicalImagesService";
import type { ClinicalImage } from "./types/ClinicalImage";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

export default function ControlImagesPage() {
  const router = useRouter();
  const { data: images, error, isLoading, mutate } = useSWR<ClinicalImage[]>(
    endpoints.list,
    fetcher
  );

  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setBeforeImage(null);
    setAfterImage(null);
    setEditingId(null);
    setShowForm(false);
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

      const url = editingId 
        ? endpoints.update(editingId) 
        : endpoints.create;
      
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "X-XSRF-TOKEN": token,
        },
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
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta imagen?")) return;

    const token = Cookies.get("XSRF-TOKEN") ?? "";

    try {
      const response = await fetch(endpoints.delete(id), {
        method: "DELETE",
        headers: {
          "X-XSRF-TOKEN": token,
        },
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

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="bg-gradient-to-b from-emerald-50 via-white to-white min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="max-w-6xl mx-auto">
              <RegisterHeaderBar
                onBackToRegisterClick={() => router.push("/register-patient")}
                onImagesClick={() => router.push("/control-images")}
                onPatientsClick={() => router.push("/patients")}
                onStatsClick={() => router.push("/stats")}
                active="images"
              />
              
              {/* Header */}
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Gestión de imágenes clínicas
                  </h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Imágenes comparativas de tratamientos realizados.
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  {showForm ? "Cancelar" : "Nueva Imagen"}
                </button>
              </div>

              {/* Form */}
              {showForm && (
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {editingId ? "Editar Imagen" : "Nueva Imagen"}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        maxLength={100}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Imagen Antes {!editingId && "*"}
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={(e) => setBeforeImage(e.target.files?.[0] || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          required={!editingId}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Imagen Después {!editingId && "*"}
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={(e) => setAfterImage(e.target.files?.[0] || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          required={!editingId}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                      >
                        {isUploading ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Gallery */}
              <div className="mt-8">
                {isLoading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Cargando imágenes...</p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-12">
                    <p className="text-red-500">Error al cargar las imágenes</p>
                  </div>
                )}

                {images && images.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No hay imágenes aún</p>
                  </div>
                )}

                {images && images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                      >
                        <div className="grid grid-cols-2 gap-1">
                          <div className="relative aspect-square">
                            <img
                              src={getImageUrl(image.before_image)}
                              alt={`${image.title} - Antes`}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              Antes
                            </span>
                          </div>
                          <div className="relative aspect-square">
                            <img
                              src={getImageUrl(image.after_image)}
                              alt={`${image.title} - Después`}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              Después
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {image.title}
                          </h3>
                          {image.description && (
                            <p className="text-sm text-gray-600 mb-3">
                              {image.description}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(image)}
                              className="flex-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(image.id)}
                              className="flex-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                            >
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
    </ProtectedRoute>
  );
}
