"use client";

import MainLayout from "@/layouts/MainLayout";
import { useRouter } from "next/navigation";
import RegisterHeaderBar from "../post-login/components/RegisterHeaderBar";
import BackButton from "../../components/BackButton";

import PatientInfo from "./components/PatientInfo";
import PatientRecordsList from "./components/PatientRecordsList";

import AuthGuard from "@/components/AuthGuard";

interface Props {
  patientId: string;
}

export default function PatientMedicalHistoryPage({ patientId }: Props) {
  const router = useRouter();

  return (
    <AuthGuard>
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
                Historial clínico del paciente
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Aquí se muestran todos los registros clínicos asociados al
                paciente, incluyendo fechas, remitentes y estado de cada
                valoración. Este historial permite mantener un seguimiento claro
                y confiable de su evolución médica.
              </p>

              <div className="mt-4 flex justify-between items-center mb-6">
                <BackButton />
              </div>

              <div className="space-y-6">
                <PatientInfo patientId={Number(patientId)} />
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  Registros Médicos
                </h3>
                <PatientRecordsList patientId={Number(patientId)} />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
