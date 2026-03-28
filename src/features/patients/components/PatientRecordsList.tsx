"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DocumentCheckIcon,
  DocumentIcon,
  DocumentMinusIcon,
  ArrowRightIcon,
  UserIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

interface MedicalEvaluation {
  id: number;
  patient_id: number;
  user_id: number;
  referrer_name: string;
  status: "CANCELADO" | "CONFIRMADO" | "EN_ESPERA";
  procedure_date: string | null;
}

interface Props {
  patientId: number;
}

const STATUS_CONFIG = {
  CONFIRMADO: {
    label: "Confirmado",
    icon: DocumentCheckIcon,
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    accent: "border-l-emerald-500",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  EN_ESPERA: {
    label: "En espera",
    icon: DocumentIcon,
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border border-amber-100",
    accent: "border-l-amber-400",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  CANCELADO: {
    label: "Cancelado",
    icon: DocumentMinusIcon,
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-600 border border-red-100",
    accent: "border-l-red-400",
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
  },
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    day: date.toLocaleDateString("es-ES", { day: "2-digit" }),
    month: date
      .toLocaleDateString("es-ES", { month: "short" })
      .replace(".", "")
      .toUpperCase(),
    year: date.toLocaleDateString("es-ES", { year: "numeric" }),
  };
};

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
          `${apiBaseUrl}/api/v1/patients/${patientId}/clinical-records`,
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
        if (!res.ok) throw new Error("Error al cargar registros");

        const data = await res.json();
        setRecords(data.data?.evaluations ?? []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [patientId, apiBaseUrl]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!loading && records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
          <DocumentIcon className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-400">
          Sin registros clínicos
        </p>
        <p className="text-xs text-gray-300 mt-1">
          Este paciente no tiene registros aún.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      {records.map((record, idx) => {
        const cfg = STATUS_CONFIG[record.status];
        const Icon = cfg.icon;
        const dateStr = record.procedure_date || new Date().toISOString();
        const { day, month, year } = formatDate(dateStr);

        return (
          <div
            key={record.id}
            className={`group relative bg-white rounded-2xl border border-gray-100 border-l-4 ${cfg.accent} shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between px-5 pt-5 pb-3">
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.iconBg}`}
              >
                <Icon
                  className={`w-4.5 h-4.5 ${cfg.iconColor}`}
                  strokeWidth={1.8}
                />
              </div>

              {/* Date block */}
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end text-gray-400 mb-0.5">
                  <CalendarDaysIcon className="w-3 h-3" />
                  <span className="text-[10px] uppercase tracking-wider">
                    {month} {year}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800 leading-none">
                  {day}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-5 border-t border-gray-50" />

            {/* Content */}
            <div className="px-5 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                Registro clínico
              </p>
              <div className="flex items-center gap-1.5">
                <UserIcon className="w-3 h-3 text-gray-400 shrink-0" />
                <p className="text-xs text-gray-500 truncate">
                  {record.referrer_name}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 pb-4">
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>

              <button
                onClick={() =>
                  router.push(`/patients/${patientId}/records/${record.id}`)
                }
                className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-emerald-600 transition-colors duration-200 group-hover:text-emerald-600"
              >
                Ver detalles
                <ArrowRightIcon className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
