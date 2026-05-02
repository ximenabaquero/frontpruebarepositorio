"use client";

import { useState } from "react";
import { PlusIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { createCategory, updateCategory } from "../services/inventoryService";
import ValidatedInput from "@/components/ValidatedInput";
import type { InventoryCategory } from "../types";

type Props = {
  categories: InventoryCategory[];
  onRefresh: () => void;
  onRefreshProducts?: () => void;
};

export default function CategoryManager({
  categories,
  onRefresh,
  onRefreshProducts,
}: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryCategory | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openForm = (cat?: InventoryCategory) => {
    setEditing(cat ?? null);
    setName(cat?.name ?? "");
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  async function handleSave() {
    if (!name.trim()) return setError("El nombre es requerido.");
    if (name.trim().length > 50) return setError("Máximo 50 caracteres.");

    setSaving(true);
    setError(null);

    try {
      editing
        ? await updateCategory(editing.id, { name: name.trim() })
        : await createCategory({ name: name.trim() });

      handleClose();
      onRefresh();
      onRefreshProducts?.();
    } catch (e: unknown) {
      // e.message ya trae el error del backend procesado en el service
      setError(
        e instanceof Error ? e.message : "Error al procesar la solicitud",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={() => openForm()}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        Gestionar Categorías
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  {editing ? "Editar Categoría" : "Nueva Categoría"}
                </h3>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Listado para editar existentes — solo en modo creación */}
              {!editing && categories.length > 0 && (
                <div className="mb-6 max-h-40 overflow-y-auto border-b pb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                    Existentes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => openForm(c)}
                        className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        {c.name} <PencilIcon className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input validado — max 50 */}
              <ValidatedInput
                id="category-name"
                label="Nombre de la categoría"
                placeholder="Ej: Insumos médicos"
                maxLength={50}
                required
                value={name}
                onChange={setName}
              />

              {/* Error del backend (validación server-side o error genérico) */}
              {error && (
                <p className="text-[10px] uppercase font-semibold tracking-wider text-red-500 mt-2">
                  {error}
                </p>
              )}

              {/* Acciones */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Guardando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
