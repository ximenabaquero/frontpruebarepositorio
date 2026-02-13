"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";

import RegisterHeaderBar from "@/features/post-login/components/RegisterHeaderBar";
import RegisterCard from "@/features/post-login/components/RegisterCard";
import FormAlert from "@/features/post-login/components/FormAlert";
import { Eye } from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";

type PatientRow = {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  age?: number | null;
  cellphone?: string | null;
  referrer_name?: string | null;
  created_at?: string | null;
};

type ApiListResponse<T> = {
  data: T[];
};

function isApiListResponse<T>(payload: unknown): payload is ApiListResponse<T> {
  if (!payload || typeof payload !== "object") return false;
  if (!("data" in payload)) return false;
  const data = (payload as { data?: unknown }).data;
  return Array.isArray(data);
}

function safeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export default function PatientsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [search, setSearch] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

  const queryString = useMemo(() => {
    const trimmed = search.trim();
    return trimmed ? `?search=${encodeURIComponent(trimmed)}` : "";
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiBaseUrl}/api/v1/patients${queryString}`, {
          credentials: "include", //usamos cookies
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        if (!res.ok) {
          setError("No se pudo cargar el listado de pacientes.");
          return;
        }
        const payload = (await res.json().catch(() => null)) as unknown;
        if (Array.isArray(payload)) {
          setPatients(payload as PatientRow[]);
        } else if (isApiListResponse<PatientRow>(payload)) {
          setPatients(payload.data);
        } else {
          setPatients([]);
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (e instanceof Error && e.name === "AbortError") return;
        setError("Error de red cargando pacientes.");
      } finally {
        setIsLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [apiBaseUrl, queryString]);

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="max-w-5xl mx-auto">
              <RegisterHeaderBar
                onStatsClick={() => router.push("/stats")}
                onImagesClick={() => router.push("/control-images")}
                onPatientsClick={() => router.push("/patients")}
                onBackToRegisterClick={() => router.push("/register-patient")}
                active="patients"
              />

              <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
                Pacientes
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Este listado corresponde al registro central de pacientes del
                sistema clínico. La información se actualiza automáticamente y
                refleja los datos más recientes disponibles.
              </p>

              <RegisterCard
                title="Historial clínico"
                subtitle="Pacientes registrados, ordenados por fecha de ingreso (más recientes primero)."
              >
                {error ? <FormAlert variant="error" message={error} /> : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="w-full sm:max-w-md">
                    <label
                      htmlFor="search"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Buscar paciente
                    </label>
                    <input
                      id="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Ingrese nombre, apellido o número de contacto."
                    />
                  </div>

                  <div className="text-sm text-gray-600">
                    {isLoading
                      ? "Cargando..."
                      : `${patients.length} resultado(s)`}
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50">
                        <tr className="text-left text-xs font-semibold text-gray-600">
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Paciente</th>
                          <th className="px-4 py-3">Edad</th>
                          <th className="px-4 py-3">Celular</th>
                          <th className="px-4 py-3">Remitente</th>
                          <th className="px-4 py-3">Fecha</th>
                          <th className="px-4 py-3 text-center">Ver</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {patients.map((p) => {
                          const fullName =
                            `${safeString(p.first_name)} ${safeString(p.last_name)}`.trim();
                          return (
                            <tr key={p.id} className="text-sm text-gray-800">
                              <td className="px-4 py-3 font-medium text-gray-900">
                                {p.id}
                              </td>
                              <td className="px-4 py-3">
                                {fullName || "(sin nombre)"}
                              </td>
                              <td className="px-4 py-3">{p.age ?? "—"}</td>
                              <td className="px-4 py-3">
                                {p.cellphone || "—"}
                              </td>
                              <td className="px-4 py-3">
                                {p.referrer_name ? (
                                  <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                      p.referrer_name === "Dra. Adele"
                                        ? "bg-pink-100 text-pink-800"
                                        : p.referrer_name === "Dra. Fernanda"
                                          ? "bg-purple-100 text-purple-800"
                                          : p.referrer_name === "Dr. Alexander"
                                            ? "bg-teal-100 text-teal-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {p.referrer_name}
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {p.created_at ? p.created_at.slice(0, 10) : "—"}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() =>
                                    router.push(`/patients/${p.id}`)
                                  }
                                  className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition"
                                  title="Ver registro médico"
                                >
                                  <Eye size={18} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}

                        {patients.length === 0 && !isLoading ? (
                          <tr>
                            <td
                              className="px-4 py-6 text-sm text-gray-500"
                              colSpan={6}
                            >
                              No hay pacientes para mostrar.
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              </RegisterCard>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
