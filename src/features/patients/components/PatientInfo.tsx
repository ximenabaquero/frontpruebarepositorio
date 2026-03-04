"use client";

import { useState } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
  IdentificationIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface Props {
  patientId: number;
}

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  cedula: string;
  date_of_birth: string;
  biological_sex: string;
  cellphone: string;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

const fetcher = async (url: string) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": token ? decodeURIComponent(token) : "",
    },
  });

  if (!res.ok) throw new Error("Error al cargar paciente");
  return res.json();
};

export default function PatientInfo({ patientId }: Props) {
  const [showEdit, setShowEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<Partial<Patient>>({});

  const { data, error, isLoading, mutate } = useSWR<Patient>(
    patientId ? `${apiBaseUrl}/api/v1/patients/${patientId}` : null,
    fetcher,
  );

  const openEdit = () => {
    if (data) setForm({ ...data });
    setShowEdit(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const token = Cookies.get("XSRF-TOKEN") ?? "";
    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/patients/${patientId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          cellphone: form.cellphone,
          date_of_birth: form.date_of_birth,
          biological_sex: form.biological_sex,
          cedula: form.cedula,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Error al actualizar");
      }
      toast.success("Paciente actualizado correctamente");
      mutate();
      setShowEdit(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error || !data) return <div>Error al cargar paciente</div>;

  const patient = data;

  const infoItems = [
    {
      icon: <IdentificationIcon className="h-6 w-6 text-gray-900" />,
      label: "Cédula",
      value: patient.cedula || "—",
    },
    {
      icon: <CalendarIcon className="h-6 w-6 text-gray-900" />,
      label: "Nacimiento",
      value: new Date(patient.date_of_birth).toLocaleDateString("es-ES"),
    },
    {
      icon: <UserIcon className="h-6 w-6 text-gray-900" />,
      label: "Sexo biológico",
      value: patient.biological_sex,
    },
    {
      icon: <PhoneIcon className="h-6 w-6 text-gray-900" />,
      label: "Celular",
      value: patient.cellphone || "—",
    },
  ];

  return (
    <>
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
        {/* ID */}
        <p className="text-[9px] uppercase text-emerald-600 font-bold mb-1">
          PACIENTE ID: #{patient.id}
        </p>

        {/* Nombre + botón de edición */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {patient.first_name} {patient.last_name}
          </h1>
          <button
            onClick={openEdit}
            title="Editar datos del paciente"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Editar
          </button>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-200 my-4" />

        {/* Datos — responsive: 2 cols en móvil, 4 en desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center bg-gray-100 rounded-lg p-3"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-white mr-3 shrink-0">
                {item.icon}
              </div>
              <div className="text-left min-w-0">
                <p className="text-[10px] uppercase font-bold text-gray-500 truncate">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Edit Modal */}
      {showEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowEdit(false)}
        >
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                Editar datos del paciente
              </h2>
              <button
                onClick={() => setShowEdit(false)}
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
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={form.first_name ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, first_name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={form.last_name ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, last_name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Cédula
                  </label>
                  <input
                    type="text"
                    value={form.cedula ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cedula: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Celular
                  </label>
                  <input
                    type="text"
                    value={form.cellphone ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cellphone: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    value={form.date_of_birth ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date_of_birth: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Sexo biológico
                  </label>
                  <select
                    value={form.biological_sex ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, biological_sex: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowEdit(false)}
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
      )}
    </>
  );
}
