"use client";

import { useState } from "react";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import NotesField from "../../post-login/components/NotesField";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

type ProcedureItem = {
  id?: number;
  item_name: string;
  price: string;
};

type ProcForm = {
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
  const [notes, setNotes] = useState(initialData.notes);
  const [items, setItems] = useState<ProcedureItem[]>(initialData.items);
  const [isSaving, setIsSaving] = useState(false);

  const updateItemName = (index: number, value: string) => {
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, item_name: value } : item));
  };

  const updatePrice = (index: number, value: string) => {
    const digits = value.replace(/[^\d]/g, "");
    const formatted = digits ? Number(digits).toLocaleString("es-CO") : "";
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, price: formatted } : item));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { item_name: "", price: "" }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!notes.trim()) {
      toast.error("Las notas clínicas son obligatorias");
      return;
    }
    if (items.length === 0) {
      toast.error("Debes agregar al menos un procedimiento");
      return;
    }
    if (items.some((it) => !it.item_name.trim() || !it.price)) {
      toast.error("Completa el nombre y precio de todos los procedimientos");
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
          notes,
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

  const total = items.reduce(
    (sum, i) => sum + (parseFloat(i.price.replace(/\./g, "").replace(",", ".")) || 0),
    0,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
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
          {/* Lista de items */}
          <div>
            <div className="hidden sm:grid sm:grid-cols-[1fr_160px_36px] gap-3 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
              <div>Procedimiento</div>
              <div>Precio (COP)</div>
              <div />
            </div>
            <div className="space-y-3 mt-3">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_160px_36px] gap-2 items-center">
                  <input
                    type="text"
                    value={item.item_name}
                    onChange={(e) => updateItemName(idx, e.target.value)}
                    placeholder="Nombre del procedimiento"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.price}
                    onChange={(e) => updatePrice(idx, e.target.value)}
                    placeholder="Precio en COP"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                  <button
                    onClick={() => removeItem(idx)}
                    disabled={items.length === 1}
                    className="flex items-center justify-center w-9 h-9 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addItem}
              className="mt-4 flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              Agregar procedimiento
            </button>
          </div>

          {/* Total */}
          {items.length > 0 && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700">Total estimado:</span>
              <span className="text-sm font-bold text-emerald-800">
                {total.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
              </span>
            </div>
          )}

          <NotesField value={notes} onChange={setNotes} onDirty={() => {}} />
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
