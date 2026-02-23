"use client";

import useSWR from "swr";
import {
  IdentificationIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
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

  if (!res.ok) {
    throw new Error("Error al cargar paciente");
  }

  return res.json();
};

export default function PatientInfo({ patientId }: Props) {
  const { data, error, isLoading } = useSWR<Patient>(
    patientId ? `${apiBaseUrl}/api/v1/patients/${patientId}` : null,
    fetcher,
  );

  if (isLoading) return <div>Cargando...</div>;
  if (error || !data) return <div>Error al cargar paciente</div>;

  const patient = data;

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      {/* ID */}
      <p className="text-[9px] uppercase text-emerald-600 font-bold mb-1">
        PACIENTE ID: #{patient.id}
      </p>

      {/* Nombre más pequeño */}
      <h1 className="text-2xl font-bold text-gray-900">
        {patient.first_name} {patient.last_name}
      </h1>

      {/* Línea divisoria */}
      <div className="border-t border-gray-200 my-4" />

      {/* Datos */}
      <div className="grid grid-cols-4 gap-4 text-xs">
        {/* Cédula */}
        <div className="flex items-center bg-gray-100 rounded-lg p-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-white mr-3">
            <IdentificationIcon className="h-6 w-6 text-gray-900" />
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-gray-500">
              Cédula
            </p>
            <p className="text-sm font-medium text-gray-900">
              {patient.cedula || "—"}
            </p>
          </div>
        </div>

        {/* Fecha de nacimiento */}
        <div className="flex items-center bg-gray-100 rounded-lg p-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-white mr-3">
            <CalendarIcon className="h-6 w-6 text-gray-900" />
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-gray-500">
              Nacimiento
            </p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(patient.date_of_birth).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>

        {/* Sexo biológico */}
        <div className="flex items-center bg-gray-100 rounded-lg p-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-white mr-3">
            <UserIcon className="h-6 w-6 text-gray-900" />
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-gray-500">
              Sexo biológico
            </p>
            <p className="text-sm font-medium text-gray-900">
              {patient.biological_sex}
            </p>
          </div>
        </div>

        {/* Celular */}
        <div className="flex items-center bg-gray-100 rounded-lg p-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-white mr-3">
            <PhoneIcon className="h-6 w-6 text-gray-900" />
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-gray-500">
              Celular
            </p>
            <p className="text-sm font-medium text-gray-900">
              {patient.cellphone || "—"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
