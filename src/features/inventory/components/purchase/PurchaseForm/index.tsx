"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import StepIndicator from "./StepIndicator";
import Step1Product from "./Step1Product";
import Step2Distributor from "./Step2Distributor";
import Step3Purchase from "./Step3Purchase";
import { createPurchase } from "../../../services/inventoryService";
import type {
  InventoryCategory,
  InventoryProduct,
  Distributor,
  PurchaseFormValues,
} from "../../../types";

const INITIAL_FORM: PurchaseFormValues = {
  product_id: null,
  name: "",
  category_id: "",
  type: "",
  description: "",
  stock_minimo: "",
  distributor_id: null,
  distributor_name: "",
  distributor_cellphone: "",
  distributor_email: "",
  quantity: "",
  unit_price: "",
  notes: "",
};

interface Props {
  categories: InventoryCategory[];
  products: InventoryProduct[];
  distributors: Distributor[];
  onClose: () => void;
  onSaved: () => void;
}

// ── Validación por paso ───────────────────────────────────────────────────────
function validateStep1(form: PurchaseFormValues): string | null {
  if (form.product_id) return null; // existente — ok
  if (!form.name.trim()) return "El nombre del producto es obligatorio.";
  if (!form.category_id) return "Seleccioná una categoría.";
  if (!form.type) return "Seleccioná el tipo de producto.";
  if (form.type === "insumo" && form.stock_minimo === "")
    return "El stock mínimo es obligatorio para insumos.";
  return null;
}

function validateStep2(_form: PurchaseFormValues): string | null {
  // El distribuidor es completamente opcional — siempre válido
  return null;
}

function validateStep3(form: PurchaseFormValues): string | null {
  if (!form.quantity || Number(form.quantity) < 1)
    return "La cantidad debe ser al menos 1.";
  if (form.unit_price === "" || Number(form.unit_price) < 0)
    return "El precio unitario es obligatorio.";
  return null;
}

const VALIDATORS = [validateStep1, validateStep2, validateStep3];

// Agregar función de validación completa del form
function isFormComplete(form: PurchaseFormValues): boolean {
  // Paso 1 válido
  if (!form.product_id) {
    if (!form.name.trim()) return false;
    if (!form.category_id) return false;
    if (!form.type) return false;
    if (form.type === "insumo" && form.stock_minimo === "") return false;
  }
  // Paso 3 válido (paso 2 siempre es opcional)
  if (!form.quantity || Number(form.quantity) < 1) return false;
  if (form.unit_price === "" || Number(form.unit_price) < 0) return false;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function PurchaseForm({
  categories,
  products,
  distributors,
  onClose,
  onSaved,
}: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<PurchaseFormValues>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const patch = (values: Partial<PurchaseFormValues>) => {
    setForm((prev) => ({ ...prev, ...values }));
    setError(null);
  };

  const handleNext = () => {
    const err = VALIDATORS[step - 1](form);
    if (err) return setError(err);
    setError(null);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    const err = validateStep3(form);
    if (err) return setError(err);

    setSaving(true);
    setError(null);
    try {
      await createPurchase(form);
      toast.success("Compra registrada correctamente");
      onSaved();
      onClose();
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Error al registrar la compra.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Registrar compra
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Paso {step} de 3</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-5 pb-2">
          <StepIndicator currentStep={step} />
        </div>

        {/* Contenido del paso */}
        <div className="px-6 py-5 min-h-[280px]">
          {step === 1 && (
            <Step1Product
              form={form}
              onChange={patch}
              products={products}
              categories={categories}
            />
          )}
          {step === 2 && (
            <Step2Distributor
              form={form}
              onChange={patch}
              distributors={distributors}
            />
          )}
          {step === 3 && <Step3Purchase form={form} onChange={patch} />}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-xs font-semibold text-red-600">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={step === 1 ? onClose : handleBack}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {step === 1 ? "Cancelar" : "Atrás"}
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || !isFormComplete(form)} // ← agregar !isFormComplete(form)
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Registrando..." : "Registrar compra"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
