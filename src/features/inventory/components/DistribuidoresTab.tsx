"use client";

import { useState } from "react";
import { PlusIcon, PencilSquareIcon, TrashIcon, PhoneIcon, EnvelopeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import PageHeader from "./PageHeader";
import type { Distributor } from "../types";

interface DistribuidoresTabProps {
  distributors: Distributor[];
  onCreated: (d: Distributor) => void;
  onUpdated: (d: Distributor) => void;
  onDeleted: (id: number) => void;
  onCreate: (data: { name: string; cellphone: string | null; email: string | null }) => Promise<Distributor>;
  onUpdate: (id: number, data: { name: string; cellphone: string | null; email: string | null }) => Promise<Distributor>;
  onDelete: (id: number) => Promise<void>;
}

interface FormState {
  name: string;
  cellphone: string;
  email: string;
}

const EMPTY_FORM: FormState = { name: "", cellphone: "", email: "" };

export default function DistribuidoresTab({
  distributors,
  onCreated,
  onUpdated,
  onDeleted,
  onCreate,
  onUpdate,
  onDelete,
}: DistribuidoresTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Distributor | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  }

  function openEdit(dist: Distributor) {
    setEditing(dist);
    setForm({
      name: dist.name,
      cellphone: dist.cellphone ?? "",
      email: dist.email ?? "",
    });
    setError(null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name.trim(),
      cellphone: form.cellphone.trim() || null,
      email: form.email.trim() || null,
    };
    try {
      if (editing) {
        const updated = await onUpdate(editing.id, payload);
        onUpdated(updated);
      } else {
        const created = await onCreate(payload);
        onCreated(created);
      }
      closeModal();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(dist: Distributor) {
    if (!confirm(`¿Eliminar a "${dist.name}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(dist.id);
    try {
      await onDelete(dist.id);
      onDeleted(dist.id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "No se pudo eliminar el distribuidor");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Configuración"
        title="Distribuidores"
        subtitle="Proveedores con los que trabajas."
        actions={[
          <button
            key="new"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Nuevo distribuidor
          </button>,
        ]}
      />

      {distributors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {distributors.map((dist) => (
            <div
              key={dist.id}
              className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg shrink-0">
                  {dist.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{dist.name}</h4>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(dist)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(dist)}
                    disabled={deletingId === dist.id}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                {dist.cellphone ? (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <PhoneIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{dist.cellphone}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                    <PhoneIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Sin teléfono</span>
                  </div>
                )}
                {dist.email ? (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <EnvelopeIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{dist.email}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                    <EnvelopeIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Sin correo</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay distribuidores</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
            Agrega distribuidores para llevar un mejor control de tus compras y proveedores.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Crear primer distribuidor
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {editing ? "Editar distribuidor" : "Nuevo distribuidor"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  maxLength={100}
                  placeholder="Nombre del distribuidor"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Teléfono / Celular
                </label>
                <input
                  type="tel"
                  value={form.cellphone}
                  onChange={(e) => setForm((f) => ({ ...f, cellphone: e.target.value }))}
                  maxLength={25}
                  placeholder="Ej: 3001234567"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  maxLength={100}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 font-medium">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || !form.name.trim()}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear distribuidor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
