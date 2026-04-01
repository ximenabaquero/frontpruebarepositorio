"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import ProceduresSelector from "../../post-login/components/ProceduresSelector";
import NotesField from "../../post-login/components/NotesField";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

type ProcedureItem = {
  id?: number;
  item_name: string;
  price: string;
};

type ProcForm = {
  procedure_date: string;
  notes: string;
  items: ProcedureItem[];
};

type Props = {
  procedureId: number;
  initialData: ProcForm;
  onClose: () => void;
  onSaved: () => void;
};

export default function EditarProcedimientoModal({ procedureId, initialData, onClose, onSaved }: Props) {
  const [procedureDate, setProcedureDate] = useState(initialData.procedure_date);
  const [notes, setNotes] = useState(initialData.notes);
  const [items, setItems] = useState<ProcedureItem[]>(initialData.items);
  const [isSaving, setIsSaving] = useState(false);

  const clearSubmitError = () => {};

  const handleSave = async () => {
    if (!procedureDate) {
      toast.error("La fecha del procedimiento es obligatoria");
      return;
    }

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

    setIsSaving(true);
    const token = Cookies.get("XSRF-TOKEN") ?? "";
    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/procedures/${procedureId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify({
          procedure_date: procedureDate,
          notes: notes,
          items: items.map((i) => ({
            item_name: i.item_name.trim(),
            price: parseFloat(i.price.replace(/\./g, "").replace(",", ".")) || 0,
          })),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Error al guardar");
      }
      toast.success("Procedimiento actualizado");
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
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">Editar procedimiento</h3>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
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

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50"
          >
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
