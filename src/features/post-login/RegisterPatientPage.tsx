"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";

import FormAlert from "./components/FormAlert";
import RegisterCard from "./components/RegisterCard";
import RegisterHeaderBar from "./components/RegisterHeaderBar";
import PatientBasicsFields from "./components/PatientBasicsFields";
import ProceduresSelector from "./components/ProceduresSelector";
import ClinicalInfoFields from "./components/ClinicalInfoFields";
import ContraindicationsFields from "./components/ContraindicationsFields";
import NotesField from "./components/NotesField";
import StickySubmitBar from "./components/StickySubmitBar";

import { PROCEDURES } from "./data/procedures";


function parseNumber(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return Number.NaN;

  // Keep only digits and separators.
  const raw = trimmed.replace(/[^0-9.,-]/g, "");
  if (!raw) return Number.NaN;

  const dotCount = (raw.match(/\./g) ?? []).length;
  const commaCount = (raw.match(/,/g) ?? []).length;

  let normalized = raw;

  // If both are present: assume thousands '.' and decimal ',' (es-CO style)
  if (dotCount > 0 && commaCount > 0) {
    normalized = normalized.replace(/\./g, "").replace(/,/g, ".");
  } else if (dotCount > 1 && commaCount === 0) {
    // Many dots: treat as thousands separators
    normalized = normalized.replace(/\./g, "");
  } else if (commaCount > 1 && dotCount === 0) {
    // Many commas: treat as thousands separators
    normalized = normalized.replace(/,/g, "");
  } else if (dotCount === 1 && commaCount === 0) {
    // One dot: decide decimal vs thousands by digits after separator
    const parts = normalized.split(".");
    if (parts.length === 2 && parts[1].length === 3 && parts[0].length >= 1) {
      normalized = parts.join("");
    }
  } else if (commaCount === 1 && dotCount === 0) {
    const parts = normalized.split(",");
    if (parts.length === 2 && parts[1].length === 3 && parts[0].length >= 1) {
      normalized = parts.join("");
    } else {
      normalized = normalized.replace(",", ".");
    }
  }

  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

const COP_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function formatCop(amount: number): string {
  if (!Number.isFinite(amount)) return "";
  return COP_FORMATTER.format(Math.round(amount));
}

function formatCopInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const n = Number(digits);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(n);
}

function digitsCountBeforeCaret(value: string, caret: number): number {
  const before = value.slice(0, Math.max(0, caret));
  return (before.match(/\d/g) ?? []).length;
}

function caretPosForDigitIndex(formattedValue: string, digitIndex: number): number {
  if (digitIndex <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formattedValue.length; i += 1) {
    if (/\d/.test(formattedValue[i])) {
      seen += 1;
      if (seen >= digitIndex) return i + 1;
    }
  }
  return formattedValue.length;
}

export default function RegisterPatientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authChecked, setAuthChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const [weightKg, setWeightKg] = useState("");
  const [heightM, setHeightM] = useState("");

  const [selectedProcedures, setSelectedProcedures] = useState<Record<string, boolean>>({});
  const [procedurePrices, setProcedurePrices] = useState<Record<string, string>>({});

  const [piernaInterna, setPiernaInterna] = useState(false);
  const [piernaExterna, setPiernaExterna] = useState(false);
  const [fajaTalla, setFajaTalla] = useState("");

  const [submitError, setSubmitError] = useState<string | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "/backend";

  const getStoredToken = (): string | null => {
    try {
      return (
        window.localStorage.getItem("coldesthetic_admin_token") ||
        window.sessionStorage.getItem("coldesthetic_admin_token")
      );
    } catch {
      return null;
    }
  };

  const authedOrRedirect = () => {
    const token = getStoredToken();
    if (!token) {
      const next = searchParams?.get("next") ?? "/register-patient";
      router.replace(`/login?next=${encodeURIComponent(next)}`);
      return null;
    }
    return token;
  };

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
    if (bmi < 16.0) return "Delgadez severa (< 16.0)";
    if (bmi < 17.0) return "Delgadez moderada (16.0–16.9)";
    if (bmi < 18.5) return "Delgadez leve (17.0–18.4)";
    if (bmi < 25.0) return "Peso normal (18.5–24.9)";
    if (bmi < 30.0) return "Sobrepeso (25.0–29.9)";
    if (bmi < 35.0) return "Obesidad grado I (30.0–34.9)";
    if (bmi < 40.0) return "Obesidad grado II (35.0–39.9)";
    return "Obesidad grado III (≥ 40)";
  }, [weightKg, heightM]);

  const proceduresTotalPreview = useMemo(() => {
    let total = 0;
    let anySelected = false;
    for (const { id } of PROCEDURES) {
      if (!selectedProcedures[id]) continue;
      anySelected = true;
      const value = parseNumber(procedurePrices[id] ?? "");
      if (!Number.isFinite(value) || value < 0) continue;
      total += value;
    }
    return { anySelected, total };
  }, [procedurePrices, selectedProcedures]);

  const proceduresTotalCop = useMemo(() => {
    if (!proceduresTotalPreview.anySelected) return "";
    return formatCop(proceduresTotalPreview.total);
  }, [proceduresTotalPreview]);

  const selectedCount = useMemo(() => {
    return Object.values(selectedProcedures).filter(Boolean).length;
  }, [selectedProcedures]);

  const stickyTotalCop = useMemo(() => {
    return formatCop(proceduresTotalPreview.total);
  }, [proceduresTotalPreview.total]);

  const piernaSelected = Boolean(selectedProcedures.pierna);
  const piernaZoneSelected = piernaInterna || piernaExterna;
  const fajaSelected = Boolean(selectedProcedures.faja_postoperatoria);

  useEffect(() => {
    try {
      const token = getStoredToken();
      if (!token) {
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
      window.localStorage.removeItem("coldesthetic_admin_token");
      window.sessionStorage.removeItem("coldesthetic_admin_token");
    } catch {
      // ignore
    }
    router.replace("/login");
  };

  const jsonOrNull = async <T,>(res: Response): Promise<T | null> => {
    try {
      return (await res.json()) as T;
    } catch {
      return null;
    }
  };

  const apiMessageFrom = (payload: unknown, preferredField?: string): string | null => {
    if (!payload || typeof payload !== "object") return null;
    const obj = payload as Record<string, unknown>;

    if (typeof obj.message === "string" && obj.message.trim()) return obj.message;

    const errors = obj.errors;
    if (!errors || typeof errors !== "object") return null;

    const errorsObj = errors as Record<string, unknown>;
    const preferred = preferredField ? errorsObj[preferredField] : undefined;
    const candidate = preferred ?? Object.values(errorsObj)[0];

    if (Array.isArray(candidate) && typeof candidate[0] === "string") {
      return candidate[0];
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const token = authedOrRedirect();
    if (!token) return;

    if (piernaSelected && !piernaZoneSelected) {
      setSubmitError("En 'Pierna' debes seleccionar Interna y/o Externa antes de ingresar el precio.");
      return;
    }

    if (fajaSelected && fajaTalla.trim() === "") {
      setSubmitError("En 'Faja postoperatoria' la talla es obligatoria.");
      return;
    }

    if (selectedCount <= 0) {
      setSubmitError("Debes seleccionar al menos un procedimiento.");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);

    const fullName = String(fd.get("full_name") ?? "").trim();
    const referrerName = String(fd.get("referrer_name") ?? "").trim();

    const age = Number(String(fd.get("age") ?? "").trim());
    const biologicalSex = String(fd.get("biological_sex") ?? "Other");
    const treatmentArea = String(fd.get("treatment_area") ?? "").trim();
    const notes = String(fd.get("notes") ?? "").trim();

    const w = parseNumber(weightKg);
    const h = parseNumber(heightM);

    if (!fullName) {
      setSubmitError("Nombre completo es obligatorio.");
      return;
    }
    if (!referrerName) {
      setSubmitError("Remitente es obligatorio.");
      return;
    }
    if (!Number.isFinite(age) || age < 0 || age > 150) {
      setSubmitError("Edad inválida.");
      return;
    }
    if (!Number.isFinite(w) || w <= 0) {
      setSubmitError("Peso inválido.");
      return;
    }
    if (!Number.isFinite(h) || h <= 0) {
      setSubmitError("Estatura inválida.");
      return;
    }

    const items = PROCEDURES.filter((p) => Boolean(selectedProcedures[p.id])).map((p) => {
      const price = parseNumber(procedurePrices[p.id] ?? "");
      return {
        item_name: p.label,
        price,
        meta: {
          procedure_key: p.id,
          ...(p.id === "pierna"
            ? { pierna: { interna: piernaInterna, externa: piernaExterna } }
            : null),
          ...(p.id === "faja_postoperatoria" ? { faja: { talla: fajaTalla.trim() } } : null),
        },
      };
    });

    const invalidPrice = items.find((i) => !Number.isFinite(i.price) || i.price < 0);
    if (invalidPrice) {
      setSubmitError("Hay procedimientos seleccionados con precio inválido.");
      return;
    }

    const evaluationData = {
      treatment_area: treatmentArea,
      contraindications: {
        diabetes: fd.get("diabetes") === "1",
        hypertension: fd.get("hypertension") === "1",
        pregnancy: fd.get("pregnancy") === "1",
        lactation: fd.get("lactation") === "1",
        implanted_device: fd.get("implanted_device") === "1",
      },
      selected_procedures: items,
      bmi_preview: bmiPreview,
      bmi_status_preview: bmiStatusPreview,
    };

    setIsSubmitting(true);
    try {
      const patientRes = await fetch(`${apiBaseUrl}/api/v1/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: fullName,
          age,
          biological_sex: biologicalSex,
          weight: w,
          height: h,
          referrer_name: referrerName,
        }),
      });

      const patientData = await jsonOrNull<{ data?: { id: number } } & Record<string, unknown>>(
        patientRes
      );
      if (!patientRes.ok || !patientData?.data?.id) {
        const message = apiMessageFrom(patientData, "referrer_name") || "No se pudo guardar el paciente.";
        if (patientRes.status === 401) {
          handleLogout();
          return;
        }
        setSubmitError(String(message));
        return;
      }

      const patientId = patientData.data.id;
      const today = new Date().toISOString().slice(0, 10);

      const procedureRes = await fetch(`${apiBaseUrl}/api/v1/procedures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_id: patientId,
          procedure_date: today,
          items,
        }),
      });

      const procedureData = await jsonOrNull<{ data?: { id: number } } & Record<string, unknown>>(
        procedureRes
      );
      if (!procedureRes.ok || !procedureData?.data?.id) {
        const message = apiMessageFrom(procedureData) || "No se pudo guardar el procedimiento.";
        if (procedureRes.status === 401) {
          handleLogout();
          return;
        }
        setSubmitError(String(message));
        return;
      }

      const procedureId = procedureData.data.id;

      const evalRes = await fetch(`${apiBaseUrl}/api/v1/medical-evaluations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_id: patientId,
          procedure_id: procedureId,
          notes: notes || null,
          evaluation_data: evaluationData,
        }),
      });

      const evalData = await jsonOrNull<Record<string, unknown>>(evalRes);
      if (!evalRes.ok) {
        const message = apiMessageFrom(evalData) || "No se pudo guardar la evaluación médica.";
        if (evalRes.status === 401) {
          handleLogout();
          return;
        }
        setSubmitError(String(message));
        return;
      }

      setSubmitSuccess("Registro guardado correctamente.");
      form.reset();
      setWeightKg("");
      setHeightM("");
      setSelectedProcedures({});
      setProcedurePrices({});
      setPiernaInterna(false);
      setPiernaExterna(false);
      setFajaTalla("");
    } catch {
      setSubmitError("Error de red guardando el registro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const makePriceChangeHandler = (procedureId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const caret = input.selectionStart ?? input.value.length;
    const digitIndex = digitsCountBeforeCaret(input.value, caret);
    const formatted = formatCopInput(input.value);

    setProcedurePrices((prev) => ({
      ...prev,
      [procedureId]: formatted,
    }));

    const nextCaret = caretPosForDigitIndex(formatted, digitIndex);
    requestAnimationFrame(() => {
      try {
        input.setSelectionRange(nextCaret, nextCaret);
      } catch {
        // ignore
      }
    });
  };

  const clearSubmitError = () => setSubmitError(null);

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl mx-auto">
            <RegisterHeaderBar
              onLogout={handleLogout}
              onPatientsClick={() => router.push("/patients")}
              active="register"
            />

          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
            Registro clínico del paciente
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Complete la información durante la consulta. El BMI se calcula en el backend y se guarda automáticamente.
          </p>

          {!authChecked ? (
            <div className="mt-6 rounded-3xl border border-gray-100 bg-white/95 backdrop-blur-sm p-6 text-sm text-gray-600 shadow-sm">
              Verificando acceso...
            </div>
          ) : (
            <RegisterCard>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="text-sm font-semibold text-gray-900">Datos del paciente</div>

                {submitError ? <FormAlert variant="error" message={submitError} /> : null}
                {submitSuccess ? <FormAlert variant="success" message={submitSuccess} /> : null}

                <PatientBasicsFields onDirty={clearSubmitError} />

                <ProceduresSelector
                  selectedProcedures={selectedProcedures}
                  procedurePrices={procedurePrices}
                  setSelectedProcedures={setSelectedProcedures}
                  setProcedurePrices={setProcedurePrices}
                  piernaInterna={piernaInterna}
                  piernaExterna={piernaExterna}
                  setPiernaInterna={setPiernaInterna}
                  setPiernaExterna={setPiernaExterna}
                  fajaTalla={fajaTalla}
                  setFajaTalla={setFajaTalla}
                  selectedCount={selectedCount}
                  proceduresTotalCop={proceduresTotalCop}
                  formatCop={formatCop}
                  clearSubmitError={clearSubmitError}
                  makePriceChangeHandler={makePriceChangeHandler}
                />

                <ClinicalInfoFields
                  weightKg={weightKg}
                  heightM={heightM}
                  bmiPreview={bmiPreview}
                  bmiStatusPreview={bmiStatusPreview}
                  onWeightChange={setWeightKg}
                  onHeightChange={setHeightM}
                  onDirty={clearSubmitError}
                />

                <ContraindicationsFields onDirty={clearSubmitError} />
                <NotesField onDirty={clearSubmitError} />

                <StickySubmitBar
                  selectedCount={selectedCount}
                  stickyTotalCop={stickyTotalCop}
                  isSubmitting={isSubmitting}
                />
              </form>
            </RegisterCard>
          )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
