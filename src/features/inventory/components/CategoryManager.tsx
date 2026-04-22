"use client";

import { useState } from "react";
import { PlusIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  createCategory,
  updateCategory,
} from "../services/inventoryService";
import type { InventoryCategory } from "../types";

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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openNew() {
    setEditing(null);
    setName("");
    setError(null);
    setOpen(true);
  }

  function openEdit(cat: InventoryCategory) {
    setEditing(cat);
    setName(cat.name);
    setError(null);
    setOpen(true);
  }

  async function handleSave() {
    if (!name.trim()) { setError("El nombre es requerido."); return; }
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await updateCategory(editing.id, { name: name.trim() });
      } else {
        await createCategory({ name: name.trim() });
      }
      setOpen(false);
      onRefresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const modal = open && (
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
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Ej: Fajas, Anestesias, Consumibles..."
          />
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
  );

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
        {modal}
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
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm"
          >
            <span className="text-gray-700 font-medium">{cat.name}</span>
            <button onClick={() => openEdit(cat)} className="text-gray-400 hover:text-indigo-600 transition-colors">
              <PencilIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-gray-400 italic">Sin categorías aún. Crea una para continuar.</p>
        )}
      </div>

      {modal}
    </div>
  );
}
