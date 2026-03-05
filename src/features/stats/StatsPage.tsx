"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";

import RegisterHeaderBar from "../post-login/components/RegisterHeaderBar";
import SummaryStats from "./components/SummaryStats";
import ReferrerStats from "./components/ReferrerStats";
import TopProceduresByIncome from "./components/TopProceduresByIncome";
import TopProceduresByDemand from "./components/TopProceduresByDemand";
import MonthlyIncomeChart from "./components/MonthlyIncomeChart";
import WeeklyIncomeChart from "./components/WeeklyIncomeChart";
import IncomeByProcedureType from "./components/IncomeByProcedureType";
import TicketPromedioCard from "./components/TicketPromedioCard";
import ConversionRateCard from "./components/ConversionRateCard";
import PatientsMonthlyChart from "./components/PatientsMonthlyChart";

import AuthGuard from "@/components/AuthGuard";
import RoleGuard from "@/components/RoleGuard";
import { UserGroupIcon, ChartBarIcon, SparklesIcon } from "@heroicons/react/24/outline";

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
                  active="stats"
                />

                <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
                  Gestión estadística
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                  Visualización y análisis de indicadores clave relacionados con
                  pacientes, ingresos, registros clínicos y procedimientos.
                </p>

                <div className="mt-3 flex items-center justify-between flex-wrap gap-3 mb-6">
                  <div className="inline-flex items-center rounded-lg bg-blue-100 px-4 py-1 text-sm text-blue-900">
                    <span className="font-semibold mr-1">Periodo:</span>
                    {(() => {
                      const date = new Date().toLocaleDateString("es-ES", {
                        month: "long",
                        year: "numeric",
                      });
                      return date.charAt(0).toUpperCase() + date.slice(1);
                    })()}
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setActiveTab("general")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === "general"
                          ? "bg-white text-emerald-700 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <ChartBarIcon className="w-4 h-4" />
                      General
                    </button>
                    <button
                      onClick={() => setActiveTab("remitentes")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === "remitentes"
                          ? "bg-white text-emerald-700 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
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

                    {/* Fila: Ticket promedio + Tasa de conversión */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                      <TicketPromedioCard />
                      <ConversionRateCard />
                    </div>

                    {/* Gráficas de ingresos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <MonthlyIncomeChart />
                      <WeeklyIncomeChart />
                    </div>

                    {/* Procedimientos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <TopProceduresByIncome />
                      <TopProceduresByDemand />
                    </div>

                    {/* Pacientes nuevos por mes + Ingresos por tipo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <PatientsMonthlyChart />
                      <IncomeByProcedureType />
                    </div>

                    {/* Predicciones — placeholder */}
                    <div className="mt-8">
                      <div className="flex items-center gap-2 mb-3">
                        <SparklesIcon className="w-5 h-5 text-violet-400" />
                        <h2 className="text-base font-semibold text-gray-900">Predicciones</h2>
                        <span className="ml-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-violet-100 text-violet-600 rounded-full">
                          Próximamente
                        </span>
                      </div>
                      <div className="rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/40 p-8 flex flex-col items-center text-center gap-3">
                        <SparklesIcon className="w-10 h-10 text-violet-300" />
                        <p className="text-sm font-medium text-violet-700">Análisis predictivo basado en tendencias</p>
                        <p className="text-xs text-violet-400 max-w-sm">
                          Pronto podrás ver proyecciones de ingresos, demanda de procedimientos y comportamiento de pacientes basadas en tus datos históricos.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-4">
                      Rendimiento de cada remitente durante el periodo actual.
                    </p>
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
