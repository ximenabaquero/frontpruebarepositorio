"use client";

import { useRouter } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";

import RegisterHeaderBar from "../post-login/components/RegisterHeaderBar";
import SummaryStats from "./components/SummaryStats";
import ReferrerStats from "./components/ReferrerStats";
import TopProceduresByIncome from "./components/TopProceduresByIncome";
import TopProceduresByDemand from "./components/TopProceduresByDemand";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function StatsPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="w-full mx-auto">
              <RegisterHeaderBar
                onBackToRegisterClick={() => router.push("/register-patient")}
                onImagesClick={() => router.push("/control-images")}
                onPatientsClick={() => router.push("/patients")}
                onStatsClick={() => router.push("/stats")}
                active="stats"
              />

              <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
                Gestión estadística
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                Visualización y análisis de indicadores clave relacionados con
                pacientes, ingresos, registros clínicos y procedimientos.
              </p>

              <div className="mt-2 inline-flex items-center rounded-lg bg-blue-100 px-4 py-1 text-sm text-blue-900 mb-8">
                <span className="font-semibold mr-1">Periodo:</span>
                {(() => {
                  const date = new Date().toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                  });
                  return date.charAt(0).toUpperCase() + date.slice(1);
                })()}
              </div>

              <SummaryStats />

              <div className="flex gap-6 mt-6">
                <div className="flex flex-col gap-6">
                  <TopProceduresByIncome />
                  <TopProceduresByDemand />
                </div>

                <ReferrerStats />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
