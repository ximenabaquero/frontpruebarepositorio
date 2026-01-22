"use client";

import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";

export default function PatientMedicalHistoryPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  // Datos simulados por ahora
  const loading = false;
  const error: string | null = null;
  const evaluations: any[] = []; // vacío para mostrar el estado visual

  return (
    <MainLayout>
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-emerald-600 hover:underline flex items-center"
      >
        ← Volver a pacientes
      </button>

      <h1 className="text-2xl font-bold mb-6">
        Historial médico del paciente #{id}
      </h1>

      {loading ? (
        <p className="text-center py-10">Cargando historial...</p>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      ) : evaluations.length === 0 ? (
        <p className="text-gray-500 italic">
          Este paciente no tiene valoraciones registradas.
        </p>
      ) : (
        <div className="space-y-4">
          {/* Aquí podrías poner un mock visual de evaluaciones */}
          <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="font-semibold">Evaluación simulada</h2>
            <p className="text-sm text-gray-600">
              Aquí iría la información básica de la evaluación.
            </p>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
