"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import MainLayout from "@/layouts/MainLayout";
import RegisterHeaderBar from "../post-login/components/RegisterHeaderBar";
import AuthGuard from "@/components/AuthGuard";
import RoleGuard from "@/components/RoleGuard";
import {
  PlusIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckCircleIcon,
  PauseCircleIcon,
  NoSymbolIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

interface Remitente {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: string;
  role: string;
  status: "active" | "inactive" | "fired";
  created_at: string;
}

const fetcher = (url: string) => {
  const token = Cookies.get("XSRF-TOKEN") ?? "";
  return fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
  }).then((r) => r.json());
};

const STATUS_CONFIG = {
  active: {
    label: "Activo",
    classes: "bg-emerald-100 text-emerald-700",
  },
  inactive: {
    label: "Inactivo",
    classes: "bg-yellow-100 text-yellow-700",
  },
  fired: {
    label: "Despedido",
    classes: "bg-red-100 text-red-600",
  },
} as const;

interface FormData {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: string;
  password: string;
}

const emptyForm: FormData = {
  name: "",
  first_name: "",
  last_name: "",
  email: "",
  cellphone: "",
  password: "",
};

export default function RemitentesPage() {
  const router = useRouter();
  const { data: remitentes, isLoading, error, mutate } = useSWR<Remitente[]>(
    `${apiBaseUrl}/api/v1/remitentes`,
    fetcher,
  );

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (r: Remitente) => {
    setEditingId(r.id);
    setForm({
      name: r.name,
      first_name: r.first_name,
      last_name: r.last_name,
      email: r.email,
      cellphone: r.cellphone,
      password: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name || !form.first_name || !form.last_name || !form.email || !form.cellphone) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    if (!editingId && !form.password) {
      toast.error("La contraseña es obligatoria para nuevos remitentes");
      return;
    }

    setIsSaving(true);
    const token = Cookies.get("XSRF-TOKEN") ?? "";

    const body: Partial<FormData> = { ...form };
    if (!body.password) delete body.password;

    try {
      const url = editingId
        ? `${apiBaseUrl}/api/v1/remitentes/${editingId}`
        : `${apiBaseUrl}/api/v1/remitentes`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { message?: string }).message ??
            Object.values(
              (err as { errors?: Record<string, string[]> }).errors ?? {},
            )
              .flat()
              .join(" ") ??
            "Error al guardar",
        );
      }

      toast.success(editingId ? "Remitente actualizado" : "Remitente creado");
      mutate();
      closeModal();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setIsSaving(false);
    }
  };

  const changeStatus = async (
    id: number,
    action: "activar" | "inactivar" | "despedir",
    label: string,
  ) => {
    if (
      !confirm(
        `¿Seguro que deseas ${label.toLowerCase()} a este remitente?`,
      )
    )
      return;

    const token = Cookies.get("XSRF-TOKEN") ?? "";
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/v1/remitentes/${id}/${action}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": token,
          },
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { message?: string }).message ?? "Error al cambiar estado",
        );
      }

      toast.success(`Remitente ${label.toLowerCase()} correctamente`);
      mutate();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error inesperado");
    }
  };

  return (
    <AuthGuard>
      <RoleGuard allow={["ADMIN"]}>
        <MainLayout>
          <div className="bg-gradient-to-b from-emerald-50 via-white to-white min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="max-w-6xl mx-auto">
                <RegisterHeaderBar
                  onBackToRegisterClick={() => router.push("/register-patient")}
                  onImagesClick={() => router.push("/control-images")}
                  onPatientsClick={() => router.push("/patients")}
                  onStatsClick={() => router.push("/stats")}
                  active="register"
                />

                {/* Header */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      Gestión de Remitentes
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                      Crea, modifica o desactiva los remitentes del sistema.
                    </p>
                  </div>
                  <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition shadow-sm shrink-0"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Nuevo remitente
                  </button>
                </div>

                {/* Stats strip */}
                {Array.isArray(remitentes) && (
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      {remitentes.filter((r) => r.status === "active").length} activos
                    </div>
                    <div className="flex items-center gap-1.5 text-yellow-700">
                      <span className="h-2 w-2 rounded-full bg-yellow-400" />
                      {remitentes.filter((r) => r.status === "inactive").length} inactivos
                    </div>
                    <div className="flex items-center gap-1.5 text-red-600">
                      <span className="h-2 w-2 rounded-full bg-red-400" />
                      {remitentes.filter((r) => r.status === "fired").length} despedidos
                    </div>
                  </div>
                )}

                {/* Table / List */}
                <div className="mt-6">
                  {isLoading && (
                    <div className="flex justify-center py-16">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                    </div>
                  )}

                  {error && (
                    <p className="text-center text-red-500 py-8">
                      Error al cargar los remitentes.
                    </p>
                  )}

                  {!isLoading && Array.isArray(remitentes) && remitentes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-gray-200 bg-white">
                      <UserGroupIcon className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">
                        Aún no hay remitentes
                      </p>
                    </div>
                  )}

                  {Array.isArray(remitentes) && remitentes.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                          <thead className="bg-gray-50">
                            <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              <th className="px-5 py-3">Nombre</th>
                              <th className="px-5 py-3 hidden md:table-cell">Usuario</th>
                              <th className="px-5 py-3 hidden sm:table-cell">Celular</th>
                              <th className="px-5 py-3">Estado</th>
                              <th className="px-5 py-3 text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {remitentes.map((r) => {
                              const sc = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.inactive;
                              return (
                                <tr key={r.id} className="hover:bg-gray-50 transition">
                                  <td className="px-5 py-4">
                                    <p className="font-medium text-gray-900 text-sm">
                                      {r.first_name} {r.last_name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {r.email}
                                    </p>
                                  </td>
                                  <td className="px-5 py-4 hidden md:table-cell">
                                    <span className="text-sm text-gray-600">
                                      @{r.name}
                                    </span>
                                  </td>
                                  <td className="px-5 py-4 hidden sm:table-cell">
                                    <span className="text-sm text-gray-600">
                                      {r.cellphone}
                                    </span>
                                  </td>
                                  <td className="px-5 py-4">
                                    <span
                                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${sc.classes}`}
                                    >
                                      {sc.label}
                                    </span>
                                  </td>
                                  <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {/* Editar */}
                                      <button
                                        title="Editar"
                                        onClick={() => openEdit(r)}
                                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition"
                                      >
                                        <PencilSquareIcon className="h-4 w-4" />
                                      </button>

                                      {/* Activar */}
                                      {r.status !== "active" && (
                                        <button
                                          title="Activar"
                                          onClick={() =>
                                            changeStatus(r.id, "activar", "Activar")
                                          }
                                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                                        >
                                          <CheckCircleIcon className="h-4 w-4" />
                                        </button>
                                      )}

                                      {/* Inactivar */}
                                      {r.status === "active" && (
                                        <button
                                          title="Inactivar"
                                          onClick={() =>
                                            changeStatus(r.id, "inactivar", "Inactivar")
                                          }
                                          className="p-1.5 rounded-lg text-yellow-500 hover:bg-yellow-50 transition"
                                        >
                                          <PauseCircleIcon className="h-4 w-4" />
                                        </button>
                                      )}

                                      {/* Despedir */}
                                      {r.status !== "fired" && (
                                        <button
                                          title="Despedir"
                                          onClick={() =>
                                            changeStatus(r.id, "despedir", "Despedir")
                                          }
                                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                                        >
                                          <NoSymbolIcon className="h-4 w-4" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </MainLayout>

        {/* ===== MODAL ===== */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId ? "Editar remitente" : "Nuevo remitente"}
                </h2>
                <button
                  onClick={closeModal}
                  className="rounded-full p-1.5 hover:bg-gray-100 transition"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={form.first_name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, first_name: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      placeholder="Nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={form.last_name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, last_name: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      placeholder="Apellido"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Nombre de usuario *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    placeholder="usuario_unico"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                      Celular *
                    </label>
                    <input
                      type="text"
                      value={form.cellphone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, cellphone: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      placeholder="3001234567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Contraseña {editingId ? "(dejar vacío para no cambiar)" : "*"}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50"
                >
                  {isSaving
                    ? "Guardando..."
                    : editingId
                      ? "Guardar cambios"
                      : "Crear remitente"}
                </button>
              </div>
            </div>
          </div>
        )}
      </RoleGuard>
    </AuthGuard>
  );
}
