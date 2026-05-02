"use client";
//patien profile-> vista 1
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
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import PhoneInputField from "../../../components/PhoneInputField";

interface Props {
  patientId: number;
}

interface Patient {
  id: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  cedula: string;
  document_type?: string;
  date_of_birth: string;
  biological_sex: string;
  cellphone: string;
}

const DOCUMENT_TYPES = [
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "Pasaporte",
  "Tarjeta de Identidad",
];

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

function capitalize(str: string) {
  return str.trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

function DocumentTypeBadge({ type }: { type?: string | null }) {
  const styles: Record<string, string> = {
    "Cédula de Ciudadanía":
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    "Cédula de Extranjería": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    Pasaporte: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    "Tarjeta de Identidad": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  };
  const short: Record<string, string> = {
    "Cédula de Ciudadanía": "C.C.",
    "Cédula de Extranjería": "C.E.",
    Pasaporte: "PAS.",
    "Tarjeta de Identidad": "T.I.",
  };
  const label = type ?? "—";
  const cls = styles[label] ?? "bg-gray-50 text-gray-600 ring-1 ring-gray-200";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${cls}`}
    >
      {short[label] ?? label}
    </span>
  );
}

export default function PatientInfo({ patientId }: Props) {
  const [showEdit, setShowEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<Partial<Patient>>({});

  const { data, error, isLoading, mutate } = useSWR<any>(
    patientId
      ? `${apiBaseUrl}/api/v1/patients/${patientId}/clinical-records`
      : null,
    fetcher,
  );

  const patient = data?.data?.patient as Patient | undefined;

  const openEdit = () => {
    if (patient) setForm({ ...patient });
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
          document_type: form.document_type,
          cedula: form.cedula,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { message?: string }).message ?? "Error al actualizar",
        );
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

  if (isLoading)
    return (
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 animate-pulse">
        <div className="h-3 w-24 bg-gray-100 rounded mb-3" />
        <div className="h-7 w-48 bg-gray-100 rounded mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );

  if (error || !patient)
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        Error al cargar los datos del paciente.
      </div>
    );

  const fullName =
    patient.full_name ||
    capitalize(
      `${patient.first_name || ""} ${patient.last_name || ""}`,
    ).trim() ||
    "Sin nombre";

  const infoItems = [
    {
      icon: <CalendarIcon className="h-5 w-5 text-emerald-600" />,
      label: "Nacimiento",
      value: new Date(patient.date_of_birth).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    },
    {
      icon: <UserIcon className="h-5 w-5 text-emerald-600" />,
      label: "Sexo biológico",
      value: patient.biological_sex,
    },
    {
      icon: <PhoneIcon className="h-5 w-5 text-emerald-600" />,
      label: "Celular",
      value: patient.cellphone || "—",
    },
  ];

  return (
    <>
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {/* Header con gradiente */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-1">
                Paciente · ID #{patient.id}
              </p>
              <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
            </div>
            <button
              onClick={openEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all shrink-0"
            >
              <PencilSquareIcon className="h-4 w-4" />
              Editar
            </button>
          </div>

          {/* línea decorativa */}
          <div className="mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
        </div>

        {/* Datos */}
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Documento */}
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-white border border-gray-100 shrink-0">
                <IdentificationIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  N° Documento
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {patient.cedula || "—"}
                  </p>
                  <DocumentTypeBadge type={patient.document_type} />
                </div>
              </div>
            </div>

            {/* Resto */}
            {infoItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3"
              >
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-white border border-gray-100 shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de edición */}
      {showEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowEdit(false)}
        >
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-white">
                Editar datos del paciente
              </h2>
              <button
                onClick={() => setShowEdit(false)}
                className="rounded-full p-1.5 hover:bg-white/20 transition"
              >
                <XMarkIcon className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                    Nombre(s)
                  </label>
                  <input
                    type="text"
                    value={form.first_name ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, first_name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                    Apellido(s)
                  </label>
                  <input
                    type="text"
                    value={form.last_name ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, last_name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                    Tipo de documento
                  </label>
                  <select
                    value={form.document_type ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, document_type: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white"
                  >
                    <option value="">Seleccionar</option>
                    {DOCUMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                    N° de documento
                  </label>
                  <input
                    type="text"
                    value={form.cedula ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cedula: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <PhoneInputField
                    label="Celular"
                    variant="modal"
                    value={form.cellphone ?? ""}
                    onChange={(val) =>
                      setForm((f) => ({ ...f, cellphone: val }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    value={form.date_of_birth ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date_of_birth: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                    Sexo biológico
                  </label>
                  <select
                    value={form.biological_sex ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, biological_sex: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white"
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
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition disabled:opacity-50 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-sm shadow-emerald-200"
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
