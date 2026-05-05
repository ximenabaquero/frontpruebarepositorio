"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";

import RegisterHeaderBar from "../post-login/components/RegisterHeaderBar";
import SummaryStats from "./components/SummaryStats";
import ReferrerStats from "./components/ReferrerStats";
import TopProceduresByIncome from "./components/TopProceduresByIncome";
import TopProceduresByDemand from "./components/TopProceduresByDemand";
import ConversionRateCard from "./components/ConversionRateCard";
import AnnualComparisonChart from "./components/AnnualComparisonChart";
import MonthComparisonChart from "./components/MonthComparisonChart";
import RevenueForecastCard from "./components/RevenueForecastCard";

import AuthGuard from "@/components/AuthGuard";
import RoleGuard from "@/components/RoleGuard";
import {
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

type Tab = "general" | "remitentes";

export default function StatsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("general");

  return (
    <AuthGuard>
      <RoleGuard allow={["ADMIN"]}>
        <MainLayout>
          <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="w-full mx-auto">
                <RegisterHeaderBar
                  onBackToRegisterClick={() => router.push("/register-patient")}
                  onImagesClick={() => router.push("/control-images")}
                  onPatientsClick={() => router.push("/patients")}
                  onStatsClick={() => router.push("/stats")}
                  onRemitentesClick={() => router.push("/admin/remitentes")}
                  onInventoryClick={() => router.push("/inventory")}
                  active="stats"
                />

                <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
                  Gestión estadística
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                  Visualización y análisis de indicadores clave relacionados con
                  pacientes, ingresos, registros clínicos y procedimientos.
                </p>

                {/* Periodo + Tabs */}
                <div className="mt-3 flex items-center justify-between flex-wrap gap-3 mb-6">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 shadow-sm px-4 py-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-50">
                      <CalendarDaysIcon className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-gray-400 font-normal">
                      Periodo actual
                    </span>
                    <span className="w-px h-4 bg-gray-200" />
                    <span className="text-gray-800 font-semibold">
                      {(() => {
                        const date = new Date().toLocaleDateString("es-ES", {
                          month: "long",
                          year: "numeric",
                        });
                        return date.charAt(0).toUpperCase() + date.slice(1);
                      })()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
                    <button
                      onClick={() => setActiveTab("general")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === "general"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      <ChartBarIcon className="w-4 h-4" />
                      General
                    </button>
                    <button
                      onClick={() => setActiveTab("remitentes")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === "remitentes"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      <UserGroupIcon className="w-4 h-4" />
                      Remitentes
                    </button>
                  </div>
                </div>

                {activeTab === "general" ? (
                  <>
                    <SummaryStats />
                    {/* Top por Ingresos — ancho completo */}

                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mt-6">
                      <div className="md:col-span-2">
                        <TopProceduresByIncome />
                      </div>
                      <div className="md:col-span-3">
                        <MonthComparisonChart />
                      </div>
                      <div className="md:col-span-2">
                        <ConversionRateCard />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mt-6">
                      <div className="md:col-span-2">
                        <TopProceduresByDemand />
                      </div>

                      <div className="md:col-span-5">
                        <AnnualComparisonChart />
                      </div>
                    </div>

                    {/* Predicciones */}
                    <div className="mt-8">
                      <div className="flex items-center gap-2 mb-3">
                        <SparklesIcon className="w-5 h-5 text-violet-400" />
                        <h2 className="text-base font-semibold text-gray-900">
                          Predicciones
                        </h2>
                      </div>
                      <RevenueForecastCard />
                    </div>
                  </>
                ) : (
                  <div className="mt-4">
                    {/* Header de sección */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <UserGroupIcon className="w-5 h-5 text-emerald-600" />
                          <h2 className="text-lg font-semibold text-gray-900">
                            Rendimiento por remitente
                          </h2>
                        </div>
                        <p className="text-sm text-gray-500">
                          Seguimiento de registros clínicos y facturación por
                          especialista durante el periodo actual.
                        </p>
                      </div>
                      <div className="inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-xs text-emerald-700 font-medium shrink-0"></div>
                    </div>
                    <ReferrerStats />
                  </div>
                )}
              </div>
            </div>
          </div>
        </MainLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
