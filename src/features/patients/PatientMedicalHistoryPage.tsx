"use client";

import { useState } from "react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import Image from "next/image";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

import RegisterHeaderBar from "../post-login/components/RegisterHeaderBar";
import ExportButton from "./components/ExportButton";
import BackButton from "./components/BackButton";

import ProtectedRoute from "@/components/ProtectedRoute";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include", // manda cookies HttpOnly
    headers: { Accept: "application/json" },
  }).then((res) => res.json());

export default function PatientMedicalHistoryPage() {
  const [currentYear] = useState(new Date().getFullYear());
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    `${apiBaseUrl}/api/v1/medical-evaluation/patient/${id}`,
    fetcher,
  );

  if (isLoading) {
    return (
      <MainLayout>
        <p className="text-center py-10">Cargando historial...</p>
      </MainLayout>
    );
  }

  if (error || !data?.data) {
    return (
      <MainLayout>
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Error al cargar datos del paciente.
        </div>
      </MainLayout>
    );
  }
  const evaluation = data.data;
  const patient = evaluation.patient;
  const procedures = evaluation.procedures || [];
  const brandName = evaluation.user?.brand_name;
  const referrer = patient.referrer_name;

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
                Registro clínico del paciente
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Este formulario recopila información detallada sobre los
                procedimientos realizados, notas clínicas y costos asociados. Su
                propósito es mantener un historial médico claro y confiable para
                cada paciente.
              </p>

              <div className="mt-4 flex justify-between items-center mb-6">
                <BackButton />
                <ExportButton />
              </div>

              <div className="max-w-5xl mx-auto bg-white border border-gray-100 shadow-md rounded-2xl">
                {/* HEADER */}
                <div className="flex justify-between items-start px-8 py-6 bg-white rounded-t-2xl">
                  <div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 p-[2px] shadow-sm">
                        {/* Logo */}
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                          <Image
                            src="/coldestheticlogo.png"
                            alt="Coldesthetic"
                            width={32}
                            height={32}
                            className="h-full w-full object-contain"
                            priority
                          />
                        </div>
                      </div>
                      {/* Brand name */}
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent tracking-tight hover:opacity-90 transition-opacity">
                        {brandName}
                      </h1>
                    </div>
                    <p className="ml-12 text-[10px] uppercase tracking-wider text-gray-400 ">
                      Realiza tus sueños de una forma segura
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-end gap-6 text-[13px] text-gray-700">
                    {/* Remitente */}
                    <div className="flex flex-col items-start">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                        Remitente
                      </p>
                      <div className="flex items-center gap-1">
                        <CheckBadgeIcon className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium">{referrer}</span>
                      </div>
                    </div>

                    <span className="text-gray-300">|</span>

                    {/* Fecha */}
                    <div className="flex flex-col items-start">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                        Fecha
                      </p>
                      <p className="font-medium">
                        {new Date(evaluation.created_at).toLocaleString(
                          "es-ES",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 mt-1 mb-3" />

                {/* CONTENT */}
                <div className="px-8 py-6 space-y-10">
                  {/* DATOS PERSONALES */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="h-5 w-1 bg-emerald-500 rounded-full" />
                      <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
                        Datos personales
                      </h3>
                    </div>

                    <div className="grid grid-cols-4 gap-6 rounded-xl border border-gray-200 bg-white p-4 text-sm">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Nombre completo
                        </p>

                        <p className="font-medium text-gray-800">
                          {patient.first_name} {patient.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Celular
                        </p>
                        <p className="font-medium text-gray-800">
                          {patient.cellphone}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Edad
                        </p>
                        <p className="font-medium text-gray-800">
                          {patient.age} años
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Sexo biológico
                        </p>
                        <p className="font-medium text-gray-800">
                          {patient.biological_sex}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* EVALUACIÓN CLÍNICA */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="h-5 w-1 bg-blue-500 rounded-full" />
                      <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
                        Evaluación clínica
                      </h3>
                    </div>

                    <div className="grid grid-cols-4 gap-6 text-sm mb-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Peso
                        </p>
                        <p className="font-medium">{evaluation.weight} kg</p>
                        <div className="border-t border-gray-100 mt-2" />
                      </div>

                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Estatura
                        </p>
                        <p className="font-medium">{evaluation.height} m</p>
                        <div className="border-t border-gray-100 mt-2" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          IMC
                        </p>
                        <p className="font-semibold text-blue-600">
                          {evaluation.bmi}
                        </p>
                        <div className="border-t border-gray-100 mt-2" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-0.5">
                          Estado IMC
                        </p>
                        <span className="inline-block mt-1 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                          {evaluation.bmi_status}
                        </span>
                        <div className="border-t border-gray-100 mt-2" />
                      </div>
                    </div>

                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                      Antecedentes médicos
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm">
                      <p className="text-gray-700">
                        {evaluation.medical_background}
                      </p>
                    </div>
                  </section>

                  {/* PROCEDIMIENTOS */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="h-5 w-1 bg-emerald-500 rounded-full" />
                      <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
                        Procedimientos y precios
                      </h3>
                    </div>

                    {procedures.map((proc: any) => (
                      <div key={proc.id} className="space-y-4">
                        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                              <th className="text-[10px] uppercase font-bold text-gray-500 tracking-wide text-left py-3 px-3">
                                Procedimiento
                              </th>
                              <th className="text-[10px] uppercase font-bold text-gray-500 tracking-wide text-right py-3 px-3">
                                Precio unitario
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {proc.items.map((item: any) => (
                              <tr
                                key={item.id}
                                className="border-t border-gray-100"
                              >
                                <td className="py-2 px-3 text-gray-700">
                                  {item.item_name}
                                </td>
                                <td className="py-2 px-3 text-right font-medium text-gray-800">
                                  ${Number(item.price).toLocaleString("es-CO")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">
                          Notas clínicas
                        </p>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm italic text-gray-600">
                          {proc.notes}
                        </div>

                        <div className="text-right">
                          <div className="border-t border-gray-100 mt-1 mb-4" />
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">
                            Valor clínico total
                          </p>

                          <p className="text-4xl font-extrabold text-green-500">
                            ${Number(proc.total_amount).toLocaleString("es-CO")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </section>
                </div>

                {/* FOOTER */}
                <div className="border-t border-gray-200 text-center text-[10px] text-gray-400 py-4">
                  Registro clínico del paciente | © {currentYear} Coldesthetic.
                  Todos los derechos reservados.
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
