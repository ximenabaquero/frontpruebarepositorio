"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import {
  CameraIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import type { PatientPhoto, PhotoStage } from "../types";
import {
  photosKey,
  uploadPatientPhoto,
  deletePatientPhoto,
} from "../services/patientPhotosService";

// ─── Config ───────────────────────────────────────────────────────────────────
const STAGE_LABELS: Record<PhotoStage, string> = {
  antes:   "Antes",
  despues: "Después",
  mes1:    "Control Mes 1",
  mes2:    "Control Mes 2",
  mes3:    "Control Mes 3",
};

const STAGE_SHORT: Record<PhotoStage, string> = {
  antes:   "Antes",
  despues: "Después",
  mes1:    "Mes 1",
  mes2:    "Mes 2",
  mes3:    "Mes 3",
};

const EVOLUTION_STAGES: PhotoStage[] = ["antes", "mes1", "mes2", "mes3"];
const ALL_STAGES: PhotoStage[] = ["antes", "despues", "mes1", "mes2", "mes3"];

const STAGE_COLORS: Record<PhotoStage, { pill: string; ring: string; dot: string }> = {
  antes:   { pill: "bg-blue-100 text-blue-700",   ring: "ring-blue-300",   dot: "bg-blue-400" },
  despues: { pill: "bg-emerald-100 text-emerald-700", ring: "ring-emerald-300", dot: "bg-emerald-400" },
  mes1:    { pill: "bg-violet-100 text-violet-700", ring: "ring-violet-300", dot: "bg-violet-400" },
  mes2:    { pill: "bg-amber-100 text-amber-700",  ring: "ring-amber-300",  dot: "bg-amber-400" },
  mes3:    { pill: "bg-rose-100 text-rose-700",    ring: "ring-rose-300",   dot: "bg-rose-400" },
};

const fetcher = (url: string) =>
  fetch(url, { credentials: "include", headers: { Accept: "application/json" } })
    .then((r) => r.json());

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  evaluationId: number;
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function PatientPhotosSection({ evaluationId }: Props) {
  const { data, mutate, isLoading } = useSWR<{ data: PatientPhoto[] }>(
    photosKey(evaluationId),
    fetcher,
  );
  const photos: PatientPhoto[] = data?.data ?? [];

  const [activeStage, setActiveStage] = useState<PhotoStage>("antes");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotes, setUploadNotes] = useState("");
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<PhotoStage>("antes");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const byStage = (stage: PhotoStage) => photos.filter((p) => p.stage === stage);
  const latestOf = (stage: PhotoStage) => byStage(stage).at(-1) ?? null;

  const openUpload = (stage: PhotoStage) => {
    setUploadTarget(stage);
    setActiveStage(stage);
    setUploadNotes("");
    setShowUploadPanel(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      await uploadPatientPhoto(evaluationId, uploadTarget, file, uploadNotes || undefined);
      await mutate();
      setUploadNotes("");
      setShowUploadPanel(false);
      toast.success(`Foto "${STAGE_LABELS[uploadTarget]}" guardada`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (photo: PatientPhoto) => {
    try {
      await deletePatientPhoto(evaluationId, photo.id);
      await mutate();
      toast.success("Foto eliminada");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const activePhotos = byStage(activeStage);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
        <CameraIcon className="w-5 h-5 text-teal-500" />
        <h3 className="text-base font-bold text-gray-900">Registro fotográfico</h3>
        {photos.length > 0 && (
          <span className="ml-1 text-xs text-gray-400 font-medium">
            {photos.length} foto{photos.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Banda de evolución ────────────────────────────────────────────── */}
      <div className="px-6 pt-5 pb-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Evolución del procedimiento
        </p>
        <div className="flex items-stretch gap-0">
          {EVOLUTION_STAGES.map((stage, idx) => {
            const photo = latestOf(stage);
            const colors = STAGE_COLORS[stage];
            const isLast = idx === EVOLUTION_STAGES.length - 1;
            return (
              <div key={stage} className="flex items-center flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => { setActiveStage(stage); setShowUploadPanel(false); }}
                    className={`w-full text-left group transition-all`}
                  >
                    {/* Foto o placeholder */}
                    <div
                      className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        activeStage === stage
                          ? `${colors.ring} ring-2 ring-offset-1`
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      {photo ? (
                        <Image
                          src={photo.image_url}
                          alt={STAGE_SHORT[stage]}
                          fill
                          className="object-cover"
                          sizes="25vw"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => { e.stopPropagation(); openUpload(stage); }}
                            onKeyDown={(e) => e.key === "Enter" && openUpload(stage)}
                            className="flex flex-col items-center gap-1 text-gray-400 hover:text-teal-500 transition-colors cursor-pointer"
                          >
                            <PlusIcon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">Subir</span>
                          </div>
                        </div>
                      )}
                      {/* Badge etapa */}
                      <div className="absolute bottom-1 left-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${colors.pill}`}>
                          {STAGE_SHORT[stage]}
                        </span>
                      </div>
                    </div>
                    {/* Fecha */}
                    <p className="mt-1 text-[10px] text-gray-400 text-center truncate">
                      {photo
                        ? new Date(photo.taken_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })
                        : "Sin foto"}
                    </p>
                  </button>
                </div>
                {!isLast && (
                  <ChevronRightIcon className="w-4 h-4 text-gray-300 mx-1 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Tabs de etapa ────────────────────────────────────────────────── */}
      <div className="flex gap-1 px-6 py-3 border-b border-gray-100 overflow-x-auto mt-2">
        {ALL_STAGES.map((stage) => {
          const count = byStage(stage).length;
          const colors = STAGE_COLORS[stage];
          return (
            <button
              key={stage}
              onClick={() => { setActiveStage(stage); setShowUploadPanel(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                activeStage === stage
                  ? `${colors.pill} border-current`
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
              {STAGE_SHORT[stage]}
              {count > 0 && (
                <span className="px-1 py-0.5 rounded-full bg-white/60 text-[10px] font-bold">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Galería de la etapa activa ─────────────────────────────────── */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
            Cargando...
          </div>
        ) : activePhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <CameraIcon className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Sin fotos en {STAGE_LABELS[activeStage]}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {activePhotos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Panel de upload */}
        {showUploadPanel && uploadTarget === activeStage ? (
          <div className="border border-teal-200 rounded-xl p-4 bg-teal-50 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-teal-700">
                Subir foto — {STAGE_LABELS[activeStage]}
              </p>
              <button onClick={() => setShowUploadPanel(false)} className="p-1 rounded-full hover:bg-teal-100">
                <XMarkIcon className="w-4 h-4 text-teal-600" />
              </button>
            </div>
            <input
              type="text"
              value={uploadNotes}
              onChange={(e) => setUploadNotes(e.target.value)}
              placeholder="Notas opcionales..."
              maxLength={300}
              className="w-full text-sm px-3 py-2 rounded-lg border border-teal-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400/30"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
            >
              <CameraIcon className="w-4 h-4" />
              {isUploading ? "Subiendo..." : "Seleccionar foto"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <button
            onClick={() => openUpload(activeStage)}
            className="flex items-center gap-2 w-full justify-center px-4 py-2.5 border-2 border-dashed border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:border-teal-300 hover:text-teal-600 transition"
          >
            <PlusIcon className="w-4 h-4" />
            Subir foto de {STAGE_LABELS[activeStage]}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── PhotoCard ────────────────────────────────────────────────────────────────
function PhotoCard({
  photo,
  onDelete,
}: {
  photo: PatientPhoto;
  onDelete: (p: PatientPhoto) => void;
}) {
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="relative group rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-square">
      <Image
        src={photo.image_url}
        alt={STAGE_LABELS[photo.stage]}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, 33vw"
        unoptimized
      />
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-white/80">
          {new Date(photo.taken_at).toLocaleDateString("es-CO", {
            day: "2-digit", month: "short", year: "numeric",
          })}
        </p>
        {photo.notes && <p className="text-[10px] text-white/70 truncate">{photo.notes}</p>}
      </div>
      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      ) : (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 p-2">
          <p className="text-white text-xs font-semibold">¿Eliminar?</p>
          <div className="flex gap-2">
            <button onClick={() => { onDelete(photo); setConfirm(false); }} className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg">Sí</button>
            <button onClick={() => setConfirm(false)} className="px-2 py-1 bg-white/20 text-white text-xs font-semibold rounded-lg">No</button>
          </div>
        </div>
      )}
    </div>
  );
}
