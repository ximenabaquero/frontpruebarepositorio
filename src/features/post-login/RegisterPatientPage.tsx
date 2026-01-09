"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";

function parseNumber(value: string): number {
  const normalized = value.replace(",", ".").trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

export default function RegisterPatientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authChecked, setAuthChecked] = useState(false);

  const [weightKg, setWeightKg] = useState("");
  const [heightM, setHeightM] = useState("");

  const bmiPreview = useMemo(() => {
    const w = parseNumber(weightKg);
    const h = parseNumber(heightM);
    if (!Number.isFinite(w) || !Number.isFinite(h) || h <= 0) return "";
    return (w / (h * h)).toFixed(2);
  }, [weightKg, heightM]);

  const bmiStatusPreview = useMemo(() => {
    const w = parseNumber(weightKg);
    const h = parseNumber(heightM);
    if (!Number.isFinite(w) || !Number.isFinite(h) || h <= 0) return "";
    const bmi = w / (h * h);
    if (bmi < 18.5) return "Bajo peso (< 18.5)";
    if (bmi < 25) return "Peso normal (18.5–24.9)";
    if (bmi < 30) return "Sobrepeso (25–29.9)";
    return "Obesidad (≥ 30)";
  }, [weightKg, heightM]);

  // When PHP is served from the same domain, "/php/register_patient.php" is a sensible default.
  // You can override it for dev/hosting via NEXT_PUBLIC_PATIENT_REGISTER_URL.
  const registerUrl =
    process.env.NEXT_PUBLIC_PATIENT_REGISTER_URL ?? "/php/register_patient.php";

  useEffect(() => {
    // Minimal UX guard (NOT real security). Replace with real auth when backend is ready.
    try {
      const authed = window.localStorage.getItem("coldesthetic_admin_authed") === "1";
      if (!authed) {
        const next = searchParams?.get("next") ?? "/register-patient";
        router.replace(`/login?next=${encodeURIComponent(next)}`);
        return;
      }
    } finally {
      setAuthChecked(true);
    }
  }, [router, searchParams]);

  const handleLogout = () => {
    try {
      window.localStorage.removeItem("coldesthetic_admin_authed");
    } catch {
      // ignore
    }
    router.replace("/login");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Uso interno (doctor)
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cerrar sesión
            </button>
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
            Registro clínico del paciente
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Complete la información durante la consulta. El BMI se calcula en el backend y se guarda automáticamente.
          </p>

          {!authChecked ? (
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-sm p-6 text-sm text-gray-600">
              Verificando acceso...
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-sm p-6">
              <form method="post" action={registerUrl} className="space-y-5">
                <div className="text-sm font-semibold text-gray-900">Datos del paciente</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre completo
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-900"
                    placeholder="Ej. María Pérez"
                  />
                </div>

                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Edad
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min={0}
                    max={150}
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-900"
                    placeholder="Ej. 34"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="biological_sex"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sexo biológico
                  </label>
                  <select
                    id="biological_sex"
                    name="biological_sex"
                    defaultValue="Female"
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-900"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="weight_kg"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Peso (kg)
                  </label>
                  <input
                    id="weight_kg"
                    name="weight_kg"
                    inputMode="decimal"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-900"
                    placeholder="Ej. 68.5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="height_m"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Estatura (m)
                  </label>
                  <input
                    id="height_m"
                    name="height_m"
                    inputMode="decimal"
                    required
                    value={heightM}
                    onChange={(e) => setHeightM(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-900"
                    placeholder="Ej. 1.65"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="treatment_area"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Área de tratamiento
                  </label>
                  <input
                    id="treatment_area"
                    name="treatment_area"
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-900"
                    placeholder="Ej. Abdomen"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bmi_preview"
                    className="block text-sm font-medium text-gray-700"
                  >
                    BMI (preview)
                  </label>
                  <input
                    id="bmi_preview"
                    value={bmiPreview}
                    disabled
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
                  />
                  {bmiStatusPreview ? (
                    <div className="mt-1 text-xs text-gray-600">{bmiStatusPreview}</div>
                  ) : null}
                </div>
              </div>

              <fieldset className="rounded-2xl border border-gray-100 p-4">
                <legend className="px-2 text-sm font-medium text-gray-700">
                  Antecedentes / contraindicaciones
                </legend>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="diabetes"
                      value="1"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Diabetes
                  </label>
                  <label className="flex items-center gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="hypertension"
                      value="1"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Hipertensión
                  </label>
                  <label className="flex items-center gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="pregnancy"
                      value="1"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Embarazo
                  </label>
                  <label className="flex items-center gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="lactation"
                      value="1"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Lactancia
                  </label>
                  <label className="flex items-center gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="implanted_device"
                      value="1"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Dispositivo implantado
                  </label>
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Notas clínicas
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-900"
                  placeholder="Hallazgos, objetivos del tratamiento, observaciones..."
                />
              </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Guardar registro
                  </button>
                  <span className="text-xs text-gray-500">
                    El backend define elegibilidad y BMI.
                  </span>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
