"use client";

import { useState, useRef } from "react";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { endpoints, getImageUrl } from "../services/ClinicalImagesService";
import type { ClinicalImage } from "../types/ClinicalImage";

type Props = {
  image: ClinicalImage | null; // null = creating
  onClose: () => void;
  onSaved: () => void;
};

export default function ClinicalImageFormModal({ image, onClose, onSaved }: Props) {
  const editingId = image?.id ?? null;

  const [title, setTitle] = useState(image?.title ?? "");
  const [description, setDescription] = useState(image?.description ?? "");
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [beforePreviewUrl, setBeforePreviewUrl] = useState<string | null>(
    image ? getImageUrl(image.before_image) : null,
  );
  const [afterPreviewUrl, setAfterPreviewUrl] = useState<string | null>(
    image ? getImageUrl(image.after_image) : null,
  );
  const [isUploading, setIsUploading] = useState(false);
  
  // Estados para errores de validación
  const [errors, setErrors] = useState({
    title: "",
    beforeImage: "",
    afterImage: "",
  });

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleBeforeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setBeforeImage(file);
    setBeforePreviewUrl(file ? URL.createObjectURL(file) : null);
    if (errors.beforeImage) setErrors({ ...errors, beforeImage: "" });
  };

  const handleAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAfterImage(file);
    setAfterPreviewUrl(file ? URL.createObjectURL(file) : null);
    if (errors.afterImage) setErrors({ ...errors, afterImage: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiar errores previos
    setErrors({ title: "", beforeImage: "", afterImage: "" });

    // Validar campos
    const newErrors = {
      title: "",
      beforeImage: "",
      afterImage: "",
    };

    if (!title.trim()) {
      newErrors.title = "Faltó rellenar el campo del título";
    }

    if (!editingId && !beforeImage && !beforePreviewUrl) {
      newErrors.beforeImage = "Faltó rellenar el campo de imagen Antes";
    }

    if (!editingId && !afterImage && !afterPreviewUrl) {
      newErrors.afterImage = "Faltó rellenar el campo de imagen Después";
    }

    // Si hay errores, mostrarlos y detener
    if (newErrors.title || newErrors.beforeImage || newErrors.afterImage) {
      setErrors(newErrors);
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

      const response = await fetch(
        editingId ? endpoints.update(editingId) : endpoints.create,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "X-XSRF-TOKEN": token },
          body: formData,
          credentials: "include",
        },
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({})) as { message?: string };
        throw new Error(err.message ?? "Error al guardar");
      }

      toast.success(editingId ? "Imagen actualizada" : "Imagen creada");
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al procesar la solicitud");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const hasPreview = beforePreviewUrl || afterPreviewUrl;

  const imagePickerCls =
    "relative cursor-pointer rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-400 transition overflow-hidden aspect-square bg-gray-50 flex items-center justify-center";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            {editingId ? "Editar imagen" : "Nueva imagen clínica"}
          </h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100 transition">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Título *
                </label>
                <span className={`text-xs ${title.length >= 100 ? "text-red-500 font-semibold" : "text-gray-400"}`}>
                  {title.length}/100
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:outline-none ${
                  errors.title
                    ? "border-red-300 focus:ring-red-400"
                    : "border-gray-200 focus:ring-emerald-400"
                }`}
                maxLength={100}
                placeholder="Ej. Liposucción abdominal"
              />
              {errors.title && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.title}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Descripción <span className="normal-case font-normal text-gray-400">(opcional)</span>
                </label>
                <span className={`text-xs ${description.length >= 300 ? "text-red-500 font-semibold" : "text-gray-400"}`}>
                  {description.length}/300
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none"
                rows={2}
                maxLength={300}
                placeholder="Breve descripción del tratamiento..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Antes */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Imagen Antes {!editingId && "*"}
                </label>
                <div 
                  onClick={() => {
                    beforeInputRef.current?.click();
                    if (errors.beforeImage) setErrors({ ...errors, beforeImage: "" });
                  }} 
                  className={`${imagePickerCls} ${errors.beforeImage ? "border-red-300" : ""}`}
                >
                  {beforePreviewUrl ? (
                    <>
                      <img src={beforePreviewUrl} alt="Preview antes" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition flex items-center justify-center">
                        <span className="opacity-0 hover:opacity-100 text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">Cambiar</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <PhotoIcon className={`h-8 w-8 mx-auto mb-1 ${errors.beforeImage ? "text-red-300" : "text-gray-300"}`} />
                      <p className={`text-xs ${errors.beforeImage ? "text-red-400" : "text-gray-400"}`}>Haz clic para seleccionar</p>
                    </div>
                  )}
                </div>
                <input ref={beforeInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleBeforeChange} className="hidden" />
                {errors.beforeImage && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.beforeImage}</p>
                )}
              </div>

              {/* Después */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Imagen Después {!editingId && "*"}
                </label>
                <div 
                  onClick={() => {
                    afterInputRef.current?.click();
                    if (errors.afterImage) setErrors({ ...errors, afterImage: "" });
                  }} 
                  className={`${imagePickerCls} ${errors.afterImage ? "border-red-300" : ""}`}
                >
                  {afterPreviewUrl ? (
                    <>
                      <img src={afterPreviewUrl} alt="Preview después" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition flex items-center justify-center">
                        <span className="opacity-0 hover:opacity-100 text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">Cambiar</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <PhotoIcon className={`h-8 w-8 mx-auto mb-1 ${errors.afterImage ? "text-red-300" : "text-gray-300"}`} />
                      <p className={`text-xs ${errors.afterImage ? "text-red-400" : "text-gray-400"}`}>Haz clic para seleccionar</p>
                    </div>
                  )}
                </div>
                <input ref={afterInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleAfterChange} className="hidden" />
                {errors.afterImage && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.afterImage}</p>
                )}
              </div>
            </div>

            {hasPreview && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-3">
                  Vista previa — así se verá en la página de inicio
                </p>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-xs mx-auto">
                  <div className="grid grid-cols-2 gap-0.5 bg-gray-100">
                    <div className="relative aspect-square">
                      {beforePreviewUrl ? (
                        <img src={beforePreviewUrl} alt="Antes" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <PhotoIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">ANTES</span>
                    </div>
                    <div className="relative aspect-square">
                      {afterPreviewUrl ? (
                        <img src={afterPreviewUrl} alt="Después" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <PhotoIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <span className="absolute top-1.5 left-1.5 bg-emerald-600/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">DESPUÉS</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-gray-900 text-sm truncate">{title || "Título del tratamiento"}</p>
                    {description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{description}</p>}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
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
  );
}
