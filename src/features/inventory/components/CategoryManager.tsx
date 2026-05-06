"use client";

import { useState } from "react";
import {
  PencilIcon,
  XMarkIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
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
      setError(
        e instanceof Error ? e.message : "Error al procesar la solicitud",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Botón trigger */}
      <div className="relative group">
        <button
          onClick={() => openForm()}
          className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all duration-200"
          aria-label="Gestionar categorías"
        >
          <SquaresPlusIcon className="w-5 h-5" />
        </button>
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-[9999]">
          Gestionar categorías
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* ── Header ── */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                    Gestión de inventario
                  </p>
                  <h3 className="text-lg font-bold text-gray-900">
                    {editing ? "Editar categoría" : "Nueva categoría"}
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* ── Categorías existentes (solo en modo creación) ── */}
              {!editing && categories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-0.5 h-4 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full" />

                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                      Categorías existentes
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => openForm(c)}
                          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 font-medium hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-150"
                        >
                          {c.name}
                          <PencilIcon className="w-3 h-3 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 pl-0.5">
                    Haz clic en una categoría para editarla.
                  </p>
                </div>
              )}

              {/* ── Divider solo en modo creación con categorías ── */}
              {!editing && categories.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[11px] text-gray-400 font-medium">
                    o crea una nueva
                  </span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
              )}

              {/* ── Input nombre ── */}
              <div>
                <ValidatedInput
                  id="category-name"
                  label="Nombre de la categoría"
                  placeholder="Nombre de la categoría"
                  maxLength={50}
                  required
                  value={name}
                  onChange={setName}
                />
                <p className="text-[11px] text-gray-400 mt-1.5 pl-0.5">
                  Máximo 50 caracteres · {name.length}/50
                </p>
              </div>

              {error && (
                <p className="text-[10px] uppercase font-semibold tracking-wider text-red-500">
                  {error}
                </p>
              )}

              {/* ── Acciones ── */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleClose}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-blue-200 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 transition-all duration-200"
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
