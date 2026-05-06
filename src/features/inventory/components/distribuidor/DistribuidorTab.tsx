"use client";

import { useState, useMemo } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  PhoneIcon,
  EnvelopeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import PageHeader from "../PageHeader";
import ValidatedInput from "@/components/ValidatedInput";
import PhoneInputField from "@/components/PhoneInputField";
import InventorySearchBar from "../InventorySearchBar";
import type { Distributor } from "../../types";
import PaginationBar from "@/components/PaginationBar";

const ITEMS_PER_PAGE = 12;

interface DistribuidorTabProps {
  distributors: Distributor[];
  onCreated: (d: Distributor) => void;
  onUpdated: (d: Distributor) => void;
  onCreate: (data: {
    name: string;
    cellphone: string | null;
    email: string | null;
  }) => Promise<Distributor>;
  onUpdate: (
    id: number,
    data: { name: string; cellphone: string | null; email: string | null },
  ) => Promise<Distributor>;
}

interface FormState {
  name: string;
  cellphone: string;
  email: string;
}

const EMPTY_FORM: FormState = { name: "", cellphone: "", email: "" };

// Normaliza tildes para búsqueda sin acento
const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function DistribuidorTab({
  distributors,
  onCreated,
  onUpdated,
  onCreate,
  onUpdate,
}: DistribuidorTabProps) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Distributor | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Búsqueda local — no requiere llamada extra al backend
  const filtered = useMemo(() => {
    const q = normalize(search);
    if (!q) return distributors;
    return distributors.filter(
      (d) =>
        normalize(d.name).includes(q) ||
        (d.cellphone && normalize(d.cellphone).includes(q)),
    );
  }, [distributors, search]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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
    if (!form.name.trim()) return setError("El nombre es obligatorio.");

    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      cellphone: form.cellphone.trim() || null,
      email: form.email.trim() || null,
    };

    try {
      if (editing) {
        onUpdated(await onUpdate(editing.id, payload));
      } else {
        onCreated(await onCreate(payload));
      }
      closeModal();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Gestión de distribuidores"
        title="Distribuidores"
        subtitle="Directorio detallado de distribuidores y aliados comerciales. Mantén toda la información de contacto organizada y accesible para optimizar tus compras y relaciones comerciales."
      />

      {/* Buscador + boton nuevo distribuidor*/}
      <div className="flex items-end gap-3 mb-5">
        <div className="flex-1">
          <InventorySearchBar
            contexto="distribuidores"
            value={search}
            onSearch={handleSearch}
          />
        </div>
        <div className="relative shrink-0">
          <button
            key="new"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold
        text-white
        bg-gradient-to-r from-indigo-600 to-cyan-500
        rounded-xl
        shadow-md shadow-indigo-200
        hover:from-indigo-700 hover:to-cyan-600
        hover:shadow-lg hover:shadow-indigo-200
        active:translate-y-[1px]
        transition-all duration-200"
          >
            <PlusIcon className="w-4 h-4" />
            Nuevo distribuidor
          </button>
        </div>
      </div>

      {/* Grilla */}
      {filtered.length > 0 ? (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white">
            {paginated.map((dist) => (
              <div
                key={dist.id}
                className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg shrink-0">
                    {dist.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {dist.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => openEdit(dist)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
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
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onNext={() => setCurrentPage((p) => p + 1)}
            onPrev={() => setCurrentPage((p) => p - 1)}
            isFirstPage={currentPage === 1}
            isLastPage={currentPage === totalPages}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {search ? "Sin resultados" : "No hay distribuidores"}
          </h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            {search
              ? `No se encontró ningún distribuidor con "${search}".`
              : "Agrega distribuidores para llevar un mejor control de tus compras."}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {editing ? "Editar distribuidor" : "Nuevo distribuidor"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <ValidatedInput
                id="distributor-name"
                label="Nombre del distribuidor"
                placeholder="Nombre del distribuidor"
                maxLength={100}
                required
                value={form.name}
                onChange={(val) => setForm((f) => ({ ...f, name: val }))}
              />

              <PhoneInputField
                label="Celular"
                variant="modal"
                value={form.cellphone}
                onChange={(val) => setForm((f) => ({ ...f, cellphone: val }))}
              />

              <div className="space-y-1">
                <label
                  htmlFor="p-description"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700"
                >
                  Correo electrónico
                  <span className="text-gray-400 font-normal">(opcional)</span>
                </label>

                <ValidatedInput
                  id="distributor-email"
                  label=""
                  placeholder="correo@ejemplo.com"
                  type="email"
                  maxLength={100}
                  value={form.email}
                  onChange={(val) => setForm((f) => ({ ...f, email: val }))}
                />
              </div>

              {error && (
                <p className="text-[10px] uppercase font-semibold tracking-wider text-red-500">
                  {error}
                </p>
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
                  {saving
                    ? "Guardando..."
                    : editing
                      ? "Guardar cambios"
                      : "Crear distribuidor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
