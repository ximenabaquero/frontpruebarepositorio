"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";

import RegisterHeaderBar from "../post-login/components/RegisterHeaderBar";

import SummaryStats from "./components/SummaryStats";
import MonthlyIncomeChart from "./components/MonthlyIncomeChart";

export default function StatsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authChecked, setAuthChecked] = useState(false);

  // Autenticación
  useEffect(() => {
    try {
      const token =
        window.localStorage.getItem("coldesthetic_admin_token") ||
        window.sessionStorage.getItem("coldesthetic_admin_token");
      if (!token) {
        const next = searchParams?.get("next") ?? "/register-patient";
        router.replace(`/login?next=${encodeURIComponent(next)}`);
        return;
      }
    } finally {
      setAuthChecked(true);
    }
  }, [router, searchParams]);

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-5xl mx-auto">
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
              Resumen analítico de pacientes, ingresos y procedimientos.
            </p>

            {!authChecked ? (
              <div className="mt-6 rounded-3xl border border-gray-100 bg-white/95 backdrop-blur-sm p-6 text-sm text-gray-600 shadow-sm">
                Verificando acceso...
              </div>
            ) : (
              <>
                <SummaryStats />
                <MonthlyIncomeChart />
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
