"use client";

import { useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/inventoryService";
import type { InventoryCategory } from "../types";

const PRESET_COLORS = [
  "#6366f1", "#10b981", "#f59e0b", "#ef4444",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];

type Props = {
  categories: InventoryCategory[];
  onRefresh: () => void;
  /** Modo compacto: solo muestra el botón de crear + modal (sin lista ni título) */
  compact?: boolean;
};

export default function CategoryManager({ categories, onRefresh, compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryCategory | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<InventoryCategory | null>(null);

  function openNew() {
    setEditing(null);
    setName("");
    setColor(PRESET_COLORS[0]);
    setError(null);
    setOpen(true);
  }

  function openEdit(cat: InventoryCategory) {
    setEditing(cat);
    setName(cat.name);
    setColor(cat.color);
    setError(null);
    setOpen(true);
  }

  async function handleSave() {
    if (!name.trim()) { setError("El nombre es requerido."); return; }
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await updateCategory(editing.id, { name: name.trim(), color });
      } else {
        await createCategory({ name: name.trim(), color });
      }
      setOpen(false);
      onRefresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    try {
      await deleteCategory(confirmTarget.id);
      toast.success(`Categoría "${confirmTarget.name}" eliminada`);
      onRefresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setConfirmTarget(null);
    }
  }

  // Modo compacto: solo botón + modal, sin lista completa
  if (compact) {
    return (
      <>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Crear Categoría
        </button>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Nueva categoría</h3>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Ej: Fajas, Anestesias..."
                />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-600 mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${color === c ? "scale-125 border-gray-800" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              {error && <p className="text-xs text-rose-500 mb-3">{error}</p>}
              <div className="flex justify-end gap-2">
                <button onClick={() => setOpen(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Categorías
        </h2>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Nueva categoría
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm shadow-sm"
            style={{ borderColor: cat.color }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
            <span className="text-gray-700 font-medium">{cat.name}</span>
            <button onClick={() => openEdit(cat)} className="text-gray-400 hover:text-indigo-600 transition-colors">
              <PencilIcon className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setConfirmTarget(cat)} className="text-gray-400 hover:text-rose-500 transition-colors">
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-gray-400 italic">Sin categorías aún. Crea una para continuar.</p>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmTarget !== null}
        title="Eliminar categoría"
        message={`¿Eliminar la categoría "${confirmTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmTarget(null)}
      />

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                {editing ? "Editar categoría" : "Nueva categoría"}
              </h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Ej: Fajas, Anestesias, Consumibles..."
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-600 mb-2">Color</label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${color === c ? "scale-125 border-gray-800" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-xs text-rose-500 mb-3">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
