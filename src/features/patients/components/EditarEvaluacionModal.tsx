"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

type EvalForm = {
  weight: string;
  height: string;
  medical_background: string;
};

type Props = {
  evaluationId: number;
  initialData: EvalForm;
  onClose: () => void;
  onSaved: () => void;
};

export default function EditarEvaluacionModal({ evaluationId, initialData, onClose, onSaved }: Props) {
  const [form, setForm] = useState<EvalForm>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!form.weight || !form.height || !form.medical_background) {
      toast.error("Completa todos los campos");
      return;
    }
    setIsSaving(true);
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
            weight: parseFloat(form.weight),
            height: parseFloat(form.height),
            medical_background: form.medical_background,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Error al guardar");
      }
      toast.success("Evaluacion actualizada");
      onClose();
      onSaved();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Editar evaluacion clinica</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100 transition">
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
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
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
                value={form.height}
                onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {form.weight && form.height && (
            <p className="text-xs text-blue-600 font-semibold">
              IMC estimado:{" "}
              {(parseFloat(form.weight) / Math.pow(parseFloat(form.height), 2)).toFixed(2)}
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Antecedentes medicos *
            </label>
            <textarea
              value={form.medical_background}
              onChange={(e) => setForm((f) => ({ ...f, medical_background: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              rows={4}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
