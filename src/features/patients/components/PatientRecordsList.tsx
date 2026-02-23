"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DocumentCheckIcon,
  DocumentIcon,
  DocumentMinusIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

import { UserIcon } from "@heroicons/react/24/solid";

interface MedicalEvaluation {
  id: number;
  created_at: string;
  referrer_name: string;
  status: "CANCELADO" | "CONFIRMADO" | "EN_ESPERA";
}

interface Props {
  patientId: number;
}

export default function PatientRecordsList({ patientId }: Props) {
  const router = useRouter();
  const [records, setRecords] = useState<MedicalEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

  useEffect(() => {
    if (!apiBaseUrl) return;

    const fetchRecords = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("XSRF-TOKEN="))
          ?.split("=")[1];

        const res = await fetch(
          `${apiBaseUrl}/api/v1/medical-evaluation/patient/${patientId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "X-XSRF-TOKEN": token ? decodeURIComponent(token) : "",
            },
          },
        );

        if (res.status === 404) {
          setRecords([]);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error("Error al cargar registros");
        }

        const data = await res.json();
        console.log("Respuesta backend:", data);
        setRecords(data.data ?? []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [patientId, apiBaseUrl]);

  if (loading) {
    return <p className="text-sm text-gray-500">Cargando registros...</p>;
  }

  if (!loading && records.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        Este paciente no tiene registros clínicos.
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return formatted.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      {records.map((record) => {
        const status = record.status;

        const statusConfig = {
          CONFIRMADO: {
            bg: "bg-green-100",
            text: "text-green-600",
            icon: <DocumentCheckIcon className="h-5 w-5 text-green-600" />,
          },
          EN_ESPERA: {
            bg: "bg-yellow-100",
            text: "text-yellow-600",
            icon: <DocumentIcon className="h-5 w-5 text-yellow-600" />,
          },
          CANCELADO: {
            bg: "bg-red-100",
            text: "text-red-600",
            icon: <DocumentMinusIcon className="h-5 w-5 text-red-600" />,
          },
        }[status];

        return (
          <div
            key={record.id}
            className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            {/* Fecha */}
            <span className="absolute top-4 right-4 text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">
              {formatDate(record.created_at)}
            </span>

            {/* Icono */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-xl ${statusConfig.bg} mb-4`}
            >
              {statusConfig.icon}
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Registro Clínico
            </h3>

            <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-500" />
              {record.referrer_name}
            </p>

            {/* Línea divisoria */}
            <div className="border-t border-gray-200 my-4" />

            <div className="flex items-center justify-between">
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text}`}
              >
                {status.replace("_", " ")}
              </span>

              <button
                onClick={() =>
                  router.push(`/patients/${patientId}/records/${record.id}`)
                }
                className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:underline"
              >
                Ver detalles
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
