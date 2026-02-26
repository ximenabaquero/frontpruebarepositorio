"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

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
  const [procedureDate, setProcedureDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ProcedureItem[]>([
    { item_name: "", price: "" },
  ]);

  // BMI preview
  const bmiValue =
    parseFloat(weight) > 0 && parseFloat(height) > 0
      ? (parseFloat(weight) / (parseFloat(height) * parseFloat(height))).toFixed(2)
      : null;

  const addItem = () => setItems((prev) => [...prev, { item_name: "", price: "" }]);
  const removeItem = (i: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof ProcedureItem, val: string) =>
    setItems((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)),
    );

  async function handleSubmit() {
    if (
      !notes.trim() ||
      !procedureDate ||
      items.some((it) => !it.item_name.trim() || !it.price)
    ) {
      toast.error("Completa todos los campos del procedimiento");
      return;
    }

    setIsSubmitting(true);
    const token = Cookies.get("XSRF-TOKEN") ?? "";

    try {
      // 1. Crear evaluación médica
      const evalRes = await fetch(`${apiBaseUrl}/api/v1/medical-evaluations`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify({
          patient_id: patientId,
          weight: parseFloat(weight),
          height: parseFloat(height),
          medical_background: medicalBackground,
        }),
      });

      if (!evalRes.ok) {
        const err = await evalRes.json().catch(() => ({}));
        throw new Error(err.message ?? "Error al crear valoración");
      }

      const evalData = await evalRes.json();
      const evaluationId: number = evalData.data.id;

      // 2. Crear procedimiento
      const procRes = await fetch(`${apiBaseUrl}/api/v1/procedures`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify({
          medical_evaluation_id: evaluationId,
          procedure_date: procedureDate,
          notes,
          items: items.map((it) => ({
            item_name: it.item_name.trim(),
            price: parseFloat(it.price.replace(/\./g, "").replace(",", ".")),
          })),
        }),
      });

      if (!procRes.ok) {
        const err = await procRes.json().catch(() => ({}));
        throw new Error(err.message ?? "Error al crear procedimiento");
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

  return (
    /* Backdrop blur */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
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
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {step === 1 ? (
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
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Fecha del procedimiento *
                </label>
                <input
                  type="date"
                  value={procedureDate}
                  onChange={(e) => setProcedureDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Notas clínicas *
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none"
                  placeholder="Describe el procedimiento y observaciones clínicas..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Procedimientos y precios *
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Agregar ítem
                  </button>
                </div>
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={item.item_name}
                        onChange={(e) =>
                          updateItem(i, "item_name", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                        placeholder="Nombre del procedimiento"
                      />
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(i, "price", e.target.value)}
                        className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                        placeholder="$ Precio"
                        min={0}
                      />
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(i)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between gap-3">
          {step === 1 ? (
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
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                ← Atrás
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50"
              >
                {isSubmitting ? "Guardando..." : "Guardar registro"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
