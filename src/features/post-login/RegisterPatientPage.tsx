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
import ConfirmModal from "@/components/ConfirmModal";
import { toast } from "react-hot-toast";

import AuthGuard from "@/components/AuthGuard";

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

  // Modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Estados
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Datos paciente
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [cedula, setCedula] = useState("");
  const [cellphone, setCellphone] = useState("");
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
    const p1 =
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      dateOfBirth.trim() !== "" &&
      documentType.trim() !== "" &&
      cedula.trim() !== "" &&
      cellphone.trim() !== "" &&
      biologicalSex.trim() !== "";

    const w = parseFloat(weightKg) > 0;
    const h = parseFloat(heightM) > 0;
    const p2 = w && h && medicalBackground.trim() !== "";
    const p3 = procedureItems.length > 0 && procedureNotes.trim().length > 0;

    setStepCompleted([Boolean(p1), Boolean(p2), Boolean(p3)]);
  }, [
    firstName,
    lastName,
    dateOfBirth,
    documentType,
    cedula,
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

  const handleDirty = () => setSubmitError(null);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  const handleSaveClick = () => {
    setHasTriedSubmit(true);
    const step3Valid =
      procedureItems.length > 0 && procedureNotes.trim().length > 0;
    if (!step3Valid) {
      setValidationError(
        "⚠️​ Complete todos los pasos antes de guardar el registro.",
      );
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      const token = Cookies.get("XSRF-TOKEN") ?? "";

      // Crear paciente
      const patientRes = await fetch(`${apiBaseUrl}/api/v1/patients`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          document_type: documentType,
          cedula,
          cellphone,
          biological_sex: biologicalSex,
        }),
      });

      console.log("CREATE PATIENT status:", patientRes.status);

      if (!patientRes.ok) {
        const errBody = await patientRes.json().catch(() => null);
        console.log("CREATE PATIENT failed", patientRes.status, errBody);
        const detail =
          errBody?.message ||
          (errBody?.errors
            ? Object.values(errBody.errors as Record<string, string[]>)
                .flat()
                .join(" ")
            : null) ||
          errBody?.error ||
          "Error al crear paciente";
        throw new Error(detail);
      }

      const patientJson = await patientRes.json();
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

      if (evalRes.status === 401)
        throw new Error("Sesión expirada. Inicia sesión nuevamente.");
      if (evalRes.status === 403) {
        const errJson = await evalRes.json();
        throw new Error(errJson.message || "Cuenta no activa.");
      }
      if (!evalRes.ok) {
        const errBody = await evalRes.json().catch(() => null);
        const detail =
          errBody?.message ||
          (errBody?.errors
            ? Object.values(errBody.errors as Record<string, string[]>)
                .flat()
                .join(" ")
            : null) ||
          errBody?.error ||
          "Error al crear evaluación médica";
        throw new Error(detail);
      }

      const evalJson = await evalRes.json();
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
            price: Number((item.price || "").replace(/\D/g, "")),
          })),
        }),
      });

      if (!procRes.ok) {
        const errBody = await procRes.json().catch(() => null);
        const detail =
          errBody?.message ||
          (errBody?.errors
            ? Object.values(errBody.errors as Record<string, string[]>)
                .flat()
                .join(" ")
            : null) ||
          errBody?.error ||
          "Error al crear procedimientos";
        throw new Error(detail);
      }

      // Todo OK → redirigir al historial del paciente
      toast.success("Registro guardado correctamente");
      router.push(`/patients/${patient_id}/records/${medical_evaluation_id}`);
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      setSubmitError(
        err instanceof Error ? err.message : "No se pudo guardar el registro.",
      );
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

  const allStepsCompleted =
    stepCompleted[0] && stepCompleted[1] && stepCompleted[2];

  return (
    <AuthGuard>
      <MainLayout>
        <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
                    onBackToRegisterClick={() =>
                      router.push("/register-patient")
                    }
                    onRemitentesClick={() => router.push("/admin/remitentes")}
                    onInventoryClick={() => router.push("/inventory")}
                    active="register"
                  />

                  <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
                    Registro clínico del paciente
                  </h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Complete y verifique la información antes de guardarla. El
                    índice de masa corporal (IMC) se registrará automáticamente.
                  </p>

                  <form
                    className="space-y-5 mt-6"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    {validationError && (
                      <FormAlert variant="warning" message={validationError} />
                    )}
                    {submitError && (
                      <FormAlert variant="error" message={submitError} />
                    )}
                    {submitSuccess && (
                      <FormAlert variant="success" message={submitSuccess} />
                    )}

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
                          dateOfBirth={dateOfBirth}
                          setDateOfBirth={setDateOfBirth}
                          documentType={documentType}
                          setDocumentType={setDocumentType}
                          cedula={cedula}
                          setCedula={setCedula}
                          cellphone={cellphone}
                          setCellphone={setCellphone}
                          biologicalSex={biologicalSex}
                          setBiologicalSex={setBiologicalSex}
                          onDirty={handleDirty}
                        />
                      </RegisterCard>
                    )}

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
                        <div className="mt-6">
                          <NotesField
                            value={procedureNotes}
                            onChange={setProcedureNotes}
                            onDirty={handleDirty}
                          />
                        </div>
                        <StickySubmitBar
                          selectedCount={selectedCount}
                          stickyTotalCop={stickyTotalCop}
                          isSubmitting={false}
                        />
                      </RegisterCard>
                    )}

                    {/* Navegación */}
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
                          type="button"
                          disabled={isSubmitting || !allStepsCompleted}
                          onClick={handleSaveClick}
                          className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-200
                            ${
                              allStepsCompleted
                                ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-sm cursor-pointer"
                                : "bg-emerald-200 cursor-not-allowed"
                            }`}
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
      {/* Modal de confirmación*/}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="¿Guardar registro clínico?"
        message="Estás a punto de guardar el registro del paciente con todos sus datos clínicos y procedimientos. Una vez guardado, serás redirigido al historial del paciente."
        confirmLabel="Sí, guardar"
        variant="default"
        onConfirm={handleConfirmedSubmit}
        onCancel={() => setShowConfirmModal(false)}
      />
    </AuthGuard>
  );
}
