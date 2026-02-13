"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import Cookies from "js-cookie";

import RegisterCard from "./components/RegisterCard";
import RegisterHeaderBar from "./components/RegisterHeaderBar";
import PatientBasicsFields from "./components/PatientBasicsFields";
import ClinicalInfoFields from "./components/ClinicalInfoFields";
import ProceduresSelector from "./components/ProceduresSelector";
import NotesField from "./components/NotesField";
import StickySubmitBar from "./components/StickySubmitBar";
import FormAlert from "./components/FormAlert";
import SidebarSteps from "./components/SideBarSteps";
import { toast } from "react-hot-toast";

import ProtectedRoute from "@/components/ProtectedRoute";

type ProcedureItem = {
  item_name: string;
  price: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

export default function RegisterPatientPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [stepCompleted, setStepCompleted] = useState<
    [boolean, boolean, boolean]
  >([false, false, false]);

  // Estados
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Datos paciente
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [referrerName, setReferrerName] = useState("");
  const [biologicalSex, setBiologicalSex] = useState("");

  // Evaluación clínica
  const [weightKg, setWeightKg] = useState("");
  const [heightM, setHeightM] = useState("");
  const [medicalBackground, setMedicalBackground] = useState("");
  const [bmiPreview, setBmiPreview] = useState("");
  const [bmiStatusPreview, setBmiStatusPreview] = useState("");

  // Procedimientos
  const [procedureItems, setProcedureItems] = useState<ProcedureItem[]>([]);
  const [procedureNotes, setProcedureNotes] = useState("");

  const [procedurePrices, setProcedurePrices] = useState<
    Record<string, string>
  >({});

  const handlePriceChange =
    (itemName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      //eliminar todo lo que no sea número
      value = value.replace(/[^\d]/g, "");

      if (!value) {
        setProcedureItems((prev) =>
          prev.map((item) =>
            item.item_name === itemName ? { ...item, price: "" } : item,
          ),
        );
        return;
      }

      const numeric = Number(value);

      if (numeric < 0) return;

      const formatted = numeric.toLocaleString("es-CO");

      setProcedureItems((prev) =>
        prev.map((item) =>
          item.item_name === itemName ? { ...item, price: formatted } : item,
        ),
      );
    };

  useEffect(() => {
    // Paso 1: datos básicos
    const p1 =
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      age.trim() !== "" &&
      cellphone.trim() !== "" &&
      biologicalSex.trim() !== "";

    // Paso 2: evaluación clínica mínima
    const w = parseFloat(weightKg) > 0;
    const h = parseFloat(heightM) > 0;
    const p2 = w && h && medicalBackground.trim() !== "";

    // Paso 3: solo se valida tras intentar guardar
    const p3 = procedureItems.length > 0 && procedureNotes.trim().length > 0;

    setStepCompleted([Boolean(p1), Boolean(p2), Boolean(p3)]);
  }, [
    firstName,
    lastName,
    age,
    cellphone,
    biologicalSex,
    weightKg,
    heightM,
    medicalBackground,
    procedureItems,
    procedureNotes,
  ]);

  useEffect(() => {
    if (currentStep === 2) {
      const step3Valid =
        procedureItems.length > 0 && procedureNotes.trim().length > 0;

      if (!step3Valid) {
        setValidationError(
          "⚠️​ Complete todos los pasos antes de guardar el registro.",
        );
      } else {
        setValidationError(null);
      }
    } else {
      setValidationError(null);
    }
  }, [currentStep, procedureItems, procedureNotes]);

  // BMI en tiempo real
  useEffect(() => {
    const weight = parseFloat(weightKg);
    const height = parseFloat(heightM);
    if (weight > 0 && height > 0) {
      const bmi = +(weight / (height * height)).toFixed(2);
      setBmiPreview(bmi.toString());

      const status =
        bmi < 16.0
          ? "Delgadez severa (< 16.0)"
          : bmi < 17.0
            ? "Delgadez moderada (16.0–16.9)"
            : bmi < 18.5
              ? "Delgadez leve (17.0–18.4)"
              : bmi < 25.0
                ? "Peso normal (18.5–24.9)"
                : bmi < 30.0
                  ? "Sobrepeso (25.0–29.9)"
                  : bmi < 35.0
                    ? "Obesidad grado I (30.0–34.9)"
                    : bmi < 40.0
                      ? "Obesidad grado II (35.0–39.9)"
                      : "Obesidad grado III (≥ 40)";

      setBmiStatusPreview(status);
    } else {
      setBmiPreview("");
      setBmiStatusPreview("");
    }
  }, [weightKg, heightM]);

  const handleDirty = () => {
    setSubmitError(null);
  };

  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== 2) return;
    setHasTriedSubmit(true);
    const step3Valid =
      procedureItems.length > 0 && procedureNotes.trim().length > 0;

    if (!step3Valid) {
      setValidationError(
        "⚠️​ Complete todos los pasos antes de guardar el registro.",
      );
      return;
    }
    setIsSubmitting(true);

    try {
      // Crear paciente
      const token = Cookies.get("XSRF-TOKEN") ?? "";

      const patientRes = await fetch(`${apiBaseUrl}/api/v1/patients`, {
        method: "POST",
        credentials: "include", //esto es lo que manda la cookie
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          age: parseInt(age),
          cellphone,
          referrer_name: referrerName,
          biological_sex: biologicalSex,
        }),
      });

      console.log("CREATE PATIENT status:", patientRes.status);

      if (!patientRes.ok) {
        console.log("CREATE PATIENT failed");
        throw new Error("Error al crear paciente");
      }

      const patientJson = await patientRes.json();
      console.log("CREATE PATIENT response:", patientJson);

      const patient_id = patientJson.data.id;

      // Crear evaluación médica
      const evalRes = await fetch(`${apiBaseUrl}/api/v1/medical-evaluations`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify({
          patient_id,
          weight: parseFloat(weightKg),
          height: parseFloat(heightM),
          medical_background: medicalBackground,
        }),
      });

      console.log("CREATE EVAL status:", evalRes.status);

      if (!evalRes.ok) {
        console.log("CREATE EVAL failed");
        throw new Error("Error al crear evaluación médica");
      }

      const evalJson = await evalRes.json();
      console.log("CREATE EVAL response:", evalJson);

      const medical_evaluation_id = evalJson.data.id;

      // Crear procedimientos
      const procRes = await fetch(`${apiBaseUrl}/api/v1/procedures`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify({
          medical_evaluation_id,
          procedure_date: new Date().toISOString().slice(0, 10),
          notes: procedureNotes,
          items: procedureItems.map((item) => ({
            item_name: item.item_name,
            price: Number(
              (procedurePrices[item.item_name] || "").replace(/\D/g, ""),
            ),
          })),
        }),
      });

      console.log("CREATE PROCEDURES status:", procRes.status);

      if (!procRes.ok) {
        console.log("CREATE PROCEDURES failed");
        throw new Error("Error al crear procedimientos");
      }

      setSubmitError(null);
      setSubmitSuccess("Registro guardado correctamente");
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      setSubmitError("No se pudo guardar el registro.");
      toast.error("Hubo un error al guardar el registro");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCount = procedureItems.length;

  const stickyTotalCop = procedureItems
    .reduce((total, item) => {
      const numeric = Number(item.price?.replace(/\D/g, "")) || 0;
      return total + numeric;
    }, 0)
    .toLocaleString("es-CO");

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
          {/* CONTAINER GENERAL */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* GRID PRINCIPAL */}
            <div className="grid grid-cols-12 gap-6">
              {/* SIDEBAR */}
              <aside className="col-span-12 lg:col-span-4">
                <SidebarSteps
                  steps={[
                    {
                      label: "Datos del paciente",
                      completed: stepCompleted[0],
                    },
                    {
                      label: "Evaluación clínica",
                      completed: stepCompleted[1],
                    },
                    { label: "Procedimientos", completed: stepCompleted[2] },
                  ]}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </aside>

              <main className="col-span-12 lg:col-span-8">
                <div className="w-full">
                  <RegisterHeaderBar
                    onStatsClick={() => router.push("/stats")}
                    onImagesClick={() => router.push("/control-images")}
                    onPatientsClick={() => router.push("/patients")}
                    active="register"
                  />

                  <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
                    Registro clínico del paciente
                  </h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Complete y verifique la información antes de guardarla. El
                    índice de masa corporal (IMC) se registrará automáticamente.
                  </p>

                  <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
                    {validationError && (
                      <FormAlert variant="warning" message={validationError} />
                    )}

                    {submitError && (
                      <FormAlert variant="error" message={submitError} />
                    )}

                    {submitSuccess && (
                      <FormAlert variant="success" message={submitSuccess} />
                    )}

                    {/* Paso 1 */}
                    {currentStep === 0 && (
                      <RegisterCard
                        title="Datos del paciente"
                        subtitle="Información básica del paciente para registro clínico."
                      >
                        <PatientBasicsFields
                          firstName={firstName}
                          setFirstName={setFirstName}
                          lastName={lastName}
                          setLastName={setLastName}
                          age={age}
                          setAge={setAge}
                          cellphone={cellphone}
                          setCellphone={setCellphone}
                          referrerName={referrerName}
                          setReferrerName={setReferrerName}
                          biologicalSex={biologicalSex}
                          setBiologicalSex={setBiologicalSex}
                          onDirty={handleDirty}
                        />
                      </RegisterCard>
                    )}

                    {/* Paso 2 */}
                    {currentStep === 1 && (
                      <RegisterCard
                        title="Evaluación clínica"
                        subtitle="Peso, estatura, índice de masa corporal (IMC) y antecedentes médicos relevantes."
                      >
                        <ClinicalInfoFields
                          weightKg={weightKg}
                          heightM={heightM}
                          bmiPreview={bmiPreview}
                          bmiStatusPreview={bmiStatusPreview}
                          medicalBackground={medicalBackground}
                          onMedicalBackgroundChange={setMedicalBackground}
                          onWeightChange={setWeightKg}
                          onHeightChange={setHeightM}
                          onDirty={handleDirty}
                        />
                      </RegisterCard>
                    )}

                    {/* Paso 3 */}
                    {currentStep === 2 && (
                      <RegisterCard
                        title="Procedimientos"
                        subtitle="Selecciona los procedimientos y asigna un precio en COP."
                      >
                        <ProceduresSelector
                          procedureItems={procedureItems}
                          setProcedureItems={setProcedureItems}
                          procedureNotes={procedureNotes}
                          setProcedureNotes={setProcedureNotes}
                          clearSubmitError={handleDirty}
                          procedurePrices={procedurePrices}
                          handlePriceChange={handlePriceChange}
                        />

                        {/* Notas del procedimiento */}
                        <div className="mt-6">
                          <NotesField
                            value={procedureNotes}
                            onChange={setProcedureNotes}
                            onDirty={handleDirty}
                          />
                        </div>

                        {/* Total COP y procedimientos Seleccionados */}
                        <StickySubmitBar
                          selectedCount={selectedCount}
                          stickyTotalCop={stickyTotalCop}
                          isSubmitting={false}
                        />
                      </RegisterCard>
                    )}

                    {/* Navegación de pasos */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentStep((s) => Math.max(0, s - 1))
                        }
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
                        disabled={currentStep === 0 || isSubmitting}
                      >
                        Anterior
                      </button>

                      {currentStep < 2 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentStep((s) => Math.min(2, s + 1))
                          }
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-60"
                          disabled={isSubmitting}
                        >
                          Siguiente
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          onClick={() => setHasTriedSubmit(true)}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                          {isSubmitting ? "Guardando..." : "Guardar registro"}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </main>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
