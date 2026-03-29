"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ProceduresSelector from "../../post-login/components/ProceduresSelector";
import NotesField from "../../post-login/components/NotesField";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

interface ProcedureItem {
  item_name: string;
  price: string;
}

interface Props {
  patientId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewRecordModal({ patientId, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 — Evaluación clínica
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [medicalBackground, setMedicalBackground] = useState("");

  // Step 2 — Procedimientos
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ProcedureItem[]>([]);

  // BMI preview
  const bmiValue =
    parseFloat(weight) > 0 && parseFloat(height) > 0
      ? (parseFloat(weight) / (parseFloat(height) * parseFloat(height))).toFixed(2)
      : null;

  const clearSubmitError = () => {};

  async function handleSubmit() {
    // Validar que todos los campos estén completos
    if (!notes.trim()) {
      toast.error("Las notas clínicas son obligatorias");
      return;
    }
    
    if (items.length === 0) {
      toast.error("Debes agregar al menos un procedimiento");
      return;
    }

    if (items.some((it) => !it.item_name.trim() || !it.price)) {
      toast.error("Completa el precio de todos los procedimientos seleccionados");
      return;
    }

    setIsSubmitting(true);
    const token = Cookies.get("XSRF-TOKEN") ?? "";

    try {
      const res = await fetch(
        `${apiBaseUrl}/api/v1/patients/${patientId}/clinical-records`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": token,
          },
          body: JSON.stringify({
            evaluation: {
              weight: parseFloat(weight),
              height: parseFloat(height),
              medical_background: medicalBackground,
            },
            procedure: {
              notes,
              items: items.map((it) => ({
                item_name: it.item_name.trim(),
                price: parseFloat(it.price.replace(/\./g, "").replace(",", ".")) || 0,
              })),
            },
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const errorMsg = err.data?.message || err.message || "Error al crear registro clínico";
        throw new Error(errorMsg);
      }

      toast.success("Registro clínico creado correctamente");
      onSuccess();
      onClose();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  }

  const progressPercent = step === 1 ? "50%" : "100%";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Nuevo registro clínico
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Paso {step} de 2 —{" "}
              {step === 1 ? "Evaluación clínica" : "Procedimiento y precios"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-gray-100 transition"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-emerald-500 transition-all duration-300"
            style={{ width: progressPercent }}
          />
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min={2}
                    max={400}
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    placeholder="Ej. 70.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Estatura (m) *
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min={1.2}
                    max={2.5}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    placeholder="Ej. 1.65"
                  />
                </div>
              </div>

              {bmiValue && (
                <div className="flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
                  <span className="text-xs uppercase font-bold text-blue-500 tracking-wide">
                    IMC calculado:
                  </span>
                  <span className="text-lg font-bold text-blue-700">
                    {bmiValue}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Antecedentes médicos *
                </label>
                <textarea
                  value={medicalBackground}
                  onChange={(e) => setMedicalBackground(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none"
                  placeholder="Describe los antecedentes médicos relevantes..."
                />
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <ProceduresSelector
                procedureItems={items}
                setProcedureItems={setItems}
                procedureNotes={notes}
                setProcedureNotes={setNotes}
                clearSubmitError={clearSubmitError}
              />
              
              <NotesField
                value={notes}
                onChange={setNotes}
                onDirty={clearSubmitError}
              />

              {items.length > 0 && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700">
                      Procedimientos seleccionados:
                    </span>
                    <span className="text-sm font-bold text-emerald-800">
                      {items.length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between gap-3 bg-white">
          {step === 1 && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (
                    !weight ||
                    !height ||
                    !medicalBackground.trim() ||
                    parseFloat(weight) <= 0 ||
                    parseFloat(height) <= 0
                  ) {
                    toast.error("Completa los campos de evaluación clínica");
                    return;
                  }
                  setStep(2);
                }}
                className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
              >
                Siguiente →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                ← Atrás
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50"
              >
                {isSubmitting ? "Guardando..." : "Crear registro"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
