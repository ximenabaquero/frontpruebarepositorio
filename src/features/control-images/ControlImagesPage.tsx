"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";

import { useAuth } from "@/features/auth/AuthContext";

import RegisterHeaderBar from "../post-login/components/RegisterHeaderBar";

export default function ControlImagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [authChecked, setAuthChecked] = useState(false);

  // Autenticación
  useEffect(() => {
    if (!user) {
      const next = searchParams?.get("next") ?? "/control-images";
      router.replace(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    setAuthChecked(true);
  }, [user, router, searchParams]);

  if (!authChecked) return null;

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
              active="images"
            />
            <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
              Gestión de imágenes clínicas
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Imágenes comparativas de tratamientos realizados.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
