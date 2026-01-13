"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";

type ProcedureOption = {
  id: string;
  label: string;
};

type ProcedureGroup = {
  id: string;
  label: string;
  defaultOpen?: boolean;
  procedureIds: string[];
};

const PROCEDURES: ProcedureOption[] = [
  { id: "abdomen_completo", label: "Abdomen completo" },
  { id: "laterales", label: "Laterales" },
  { id: "cintura", label: "Cintura" },
  { id: "espalda_completa", label: "Espalda completa" },
  { id: "coxis", label: "Coxis" },
  { id: "brazos", label: "Brazos" },
  { id: "papada", label: "Papada" },
  { id: "pierna", label: "Pierna" },
  { id: "criolipolisis", label: "Criolipólisis" },
  { id: "radiofrecuencia", label: "Radiofrecuencia" },
  { id: "cavitacion", label: "Cavitación" },
  { id: "hifu", label: "HIFU" },
  { id: "laser_basico", label: "Láser básico" },
  { id: "laser_infrarrojo", label: "Láser infrarrojo" },
  { id: "laser", label: "Láser" },
  { id: "laser_diodo", label: "Láser diodo" },
  { id: "lipoinyeccion", label: "Lipoinyección" },
  { id: "faja_postoperatoria", label: "Faja postoperatoria" },
  { id: "medicamentos", label: "Medicamentos" },
  { id: "drenaje", label: "Drenaje linfático" },
  { id: "masaje", label: "Masaje postoperatorio" },
  { id: "espuma_reafirmante", label: "Espuma reafirmante" },
  { id: "examenes", label: "Exámenes" },
  { id: "controles", label: "Controles" },
];

const PROCEDURE_GROUPS: ProcedureGroup[] = [
  {
    id: "zonas",
    label: "Zonas",
    defaultOpen: true,
    procedureIds: [
      "abdomen_completo",
      "laterales",
      "cintura",
      "espalda_completa",
      "coxis",
      "brazos",
      "papada",
      "pierna",
    ],
  },
  {
    id: "laser",
    label: "Láser",
    defaultOpen: true,
    procedureIds: ["laser_basico", "laser_infrarrojo", "laser", "laser_diodo"],
  },
  {
    id: "postop",
    label: "Post-operatorio",
    defaultOpen: true,
    procedureIds: [
      "faja_postoperatoria",
      "drenaje",
      "masaje",
      "espuma_reafirmante",
    ],
  },
  {
    id: "otros",
    label: "Otros",
    defaultOpen: false,
    procedureIds: [
      "criolipolisis",
      "radiofrecuencia",
      "cavitacion",
      "hifu",
      "lipoinyeccion",
      "medicamentos",
      "examenes",
      "controles",
    ],
  },
];

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

  const [weightKg, setWeightKg] = useState("");
  const [heightM, setHeightM] = useState("");

  const [selectedProcedures, setSelectedProcedures] = useState<Record<string, boolean>>({});
  const [procedurePrices, setProcedurePrices] = useState<Record<string, string>>({});

  const [piernaInterna, setPiernaInterna] = useState(false);
  const [piernaExterna, setPiernaExterna] = useState(false);
  const [fajaTalla, setFajaTalla] = useState("");

  const [submitError, setSubmitError] = useState<string | null>(null);

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
              <form
                method="post"
                action={registerUrl}
                className="space-y-5"
                onSubmit={(e) => {
                  setSubmitError(null);

                  if (piernaSelected && !piernaZoneSelected) {
                    e.preventDefault();
                    setSubmitError("En 'Pierna' debes seleccionar Interna y/o Externa antes de ingresar el precio.");
                    return;
                  }

                  if (fajaSelected && fajaTalla.trim() === "") {
                    e.preventDefault();
                    setSubmitError("En 'Faja postoperatoria' la talla es obligatoria.");
                    return;
                  }
                }}
              >
                <div className="text-sm font-semibold text-gray-900">Datos del paciente</div>

                {submitError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {submitError}
                  </div>
                ) : null}

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

              <fieldset className="rounded-2xl border border-gray-100 p-4">
                <legend className="px-2 text-sm font-medium text-gray-700">Procedimientos</legend>
                <p className="mt-1 text-xs text-gray-500">
                  Marca el procedimiento y se habilitarán los campos necesarios. Precio en COP.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4">
                  {PROCEDURE_GROUPS.map((group) => {
                    const groupSelectedCount = group.procedureIds.filter(
                      (id) => Boolean(selectedProcedures[id])
                    ).length;

                    return (
                      <details
                        key={group.id}
                        open={group.defaultOpen}
                        className="rounded-2xl border border-gray-100 bg-white"
                      >
                        <summary className="cursor-pointer list-none px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-semibold text-gray-900">{group.label}</div>
                            <div className="text-xs text-gray-500">
                              {groupSelectedCount > 0
                                ? `${groupSelectedCount} seleccionado(s)`
                                : "Ninguno"}
                            </div>
                          </div>
                        </summary>

                        <div className="px-4 pb-4">
                          <div className="hidden sm:grid sm:grid-cols-[28px_1fr_260px_220px] gap-3 border-y border-gray-100 py-2 text-xs font-semibold text-gray-500">
                            <div />
                            <div>Procedimiento</div>
                            <div>Detalles</div>
                            <div>Precio (COP)</div>
                          </div>

                          <div className="divide-y divide-gray-100">
                            {group.procedureIds.map((procedureId) => {
                              const procedure = PROCEDURES.find((p) => p.id === procedureId);
                              if (!procedure) return null;

                              const checked = Boolean(selectedProcedures[procedure.id]);
                              const priceValue = procedurePrices[procedure.id] ?? "";

                              const isPierna = procedure.id === "pierna";
                              const isFaja = procedure.id === "faja_postoperatoria";
                              const piernaPriceDisabled = isPierna && checked && !piernaZoneSelected;

                              return (
                                <div
                                  key={procedure.id}
                                  className="grid grid-cols-1 sm:grid-cols-[28px_1fr_260px_220px] gap-3 py-3"
                                >
                                  <div className="pt-1">
                                    <input
                                      id={`proc_${procedure.id}`}
                                      type="checkbox"
                                      name="procedures[]"
                                      value={procedure.id}
                                      checked={checked}
                                      onChange={(e) => {
                                        setSubmitError(null);
                                        const nextChecked = e.target.checked;
                                        setSelectedProcedures((prev) => ({
                                          ...prev,
                                          [procedure.id]: nextChecked,
                                        }));

                                        if (!nextChecked) {
                                          setProcedurePrices((prev) => ({
                                            ...prev,
                                            [procedure.id]: "",
                                          }));

                                          if (procedure.id === "pierna") {
                                            setPiernaInterna(false);
                                            setPiernaExterna(false);
                                          }
                                          if (procedure.id === "faja_postoperatoria") {
                                            setFajaTalla("");
                                          }
                                        }
                                      }}
                                      className="h-4 w-4 rounded border-gray-300"
                                    />
                                  </div>

                                  <label
                                    htmlFor={`proc_${procedure.id}`}
                                    className={`text-sm font-medium ${
                                      checked ? "text-gray-900" : "text-gray-700"
                                    }`}
                                  >
                                    {procedure.label}
                                  </label>

                                  <div>
                                    {!checked ? (
                                      <div className="text-sm text-gray-400">—</div>
                                    ) : isPierna ? (
                                      <div className="flex flex-wrap items-center gap-4">
                                        <label className="flex items-center gap-2 text-sm text-gray-700">
                                          <input
                                            type="checkbox"
                                            checked={piernaInterna}
                                            onChange={(e) => {
                                              setSubmitError(null);
                                              setPiernaInterna(e.target.checked);
                                              if (!e.target.checked && !piernaExterna) {
                                                setProcedurePrices((prev) => ({
                                                  ...prev,
                                                  pierna: "",
                                                }));
                                              }
                                            }}
                                            name="procedure_meta[pierna][interna]"
                                            value="1"
                                            className="h-4 w-4 rounded border-gray-300"
                                          />
                                          Interna
                                        </label>

                                        <label className="flex items-center gap-2 text-sm text-gray-700">
                                          <input
                                            type="checkbox"
                                            checked={piernaExterna}
                                            onChange={(e) => {
                                              setSubmitError(null);
                                              setPiernaExterna(e.target.checked);
                                              if (!e.target.checked && !piernaInterna) {
                                                setProcedurePrices((prev) => ({
                                                  ...prev,
                                                  pierna: "",
                                                }));
                                              }
                                            }}
                                            name="procedure_meta[pierna][externa]"
                                            value="1"
                                            className="h-4 w-4 rounded border-gray-300"
                                          />
                                          Externa
                                        </label>

                                        <input
                                          type="hidden"
                                          name="procedure_label[pierna]"
                                          value={procedure.label}
                                        />
                                      </div>
                                    ) : isFaja ? (
                                      <div>
                                        <label
                                          htmlFor="procedure_talla_faja_postoperatoria"
                                          className="block text-xs font-medium text-gray-600"
                                        >
                                          Talla
                                        </label>
                                        <input
                                          id="procedure_talla_faja_postoperatoria"
                                          name="procedure_meta[faja_postoperatoria][talla]"
                                          required={checked}
                                          value={fajaTalla}
                                          onChange={(e) => {
                                            setSubmitError(null);
                                            setFajaTalla(e.target.value);
                                          }}
                                          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
                                          placeholder="Ej. S / M / L / XL"
                                        />

                                        <input
                                          type="hidden"
                                          name="procedure_label[faja_postoperatoria]"
                                          value={procedure.label}
                                        />
                                      </div>
                                    ) : (
                                      <div className="text-sm text-gray-400">—</div>
                                    )}
                                  </div>

                                  <div>
                                    {!checked ? (
                                      <div className="text-sm text-gray-400">—</div>
                                    ) : isPierna ? (
                                      <div>
                                        <input
                                          id="procedure_price_pierna"
                                          name="procedure_price[pierna]"
                                          inputMode="decimal"
                                          disabled={piernaPriceDisabled}
                                          required={checked && piernaZoneSelected}
                                          value={priceValue}
                                          onChange={makePriceChangeHandler("pierna")}
                                          className={`w-full rounded-xl border px-3 py-2 text-sm text-gray-900 ${
                                            piernaPriceDisabled
                                              ? "border-gray-100 bg-gray-50 text-gray-400"
                                              : "border-gray-200 bg-white"
                                          }`}
                                          placeholder={
                                            piernaPriceDisabled
                                              ? "Selecciona Interna/Externa"
                                              : "Ej. 150.000"
                                          }
                                        />
                                        {!piernaZoneSelected ? (
                                          <div className="mt-1 text-xs text-gray-500">
                                            Selecciona Interna y/o Externa.
                                          </div>
                                        ) : null}
                                      </div>
                                    ) : isFaja ? (
                                      <input
                                        id="procedure_price_faja_postoperatoria"
                                        name="procedure_price[faja_postoperatoria]"
                                        inputMode="decimal"
                                        required={checked}
                                        value={priceValue}
                                        onChange={makePriceChangeHandler("faja_postoperatoria")}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
                                        placeholder="Ej. 150.000"
                                      />
                                    ) : (
                                      <div>
                                        <input
                                          id={`procedure_price_${procedure.id}`}
                                          name={`procedure_price[${procedure.id}]`}
                                          inputMode="decimal"
                                          required={checked}
                                          value={priceValue}
                                          onChange={makePriceChangeHandler(procedure.id)}
                                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
                                          placeholder="Ej. 150.000"
                                        />

                                        <input
                                          type="hidden"
                                          name={`procedure_label[${procedure.id}]`}
                                          value={procedure.label}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </details>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      Seleccionados: <span className="font-semibold">{selectedCount}</span>
                    </div>
                    <div>
                      Total (COP): <span className="font-semibold">{proceduresTotalCop || formatCop(0)}</span>
                    </div>
                  </div>
                </div>
              </fieldset>

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

                <div className="sticky bottom-0 z-20 -mx-6 mt-6 border-t border-gray-100 bg-white/95 px-6 py-3 backdrop-blur">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-gray-700">
                      <div>
                        Seleccionados: <span className="font-semibold">{selectedCount}</span>
                      </div>
                      <div>
                        Total (COP): <span className="font-semibold">{stickyTotalCop}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Guardar registro
                      </button>
                      <span className="hidden text-xs text-gray-500 sm:inline">
                        El backend define elegibilidad y BMI.
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
