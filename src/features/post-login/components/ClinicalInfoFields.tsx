import ValidatedInput from "../../../components/ValidatedInput";

export type ClinicalData = {
  weightKg: string;
  heightM: string;
  medicalBackground: string;
};

type ClinicalInfoFieldsProps = {
  data: ClinicalData;
  onChange: (field: keyof ClinicalData, value: string) => void;
  onDirty: () => void;
};

function getBmiStatus(bmi: number): string {
  if (bmi < 16.0) return "Delgadez severa (< 16.0)";
  if (bmi < 17.0) return "Delgadez moderada (16.0–16.9)";
  if (bmi < 18.5) return "Delgadez leve (17.0–18.4)";
  if (bmi < 25.0) return "Peso normal (18.5–24.9)";
  if (bmi < 30.0) return "Sobrepeso (25.0–29.9)";
  if (bmi < 35.0) return "Obesidad grado I (30.0–34.9)";
  if (bmi < 40.0) return "Obesidad grado II (35.0–39.9)";
  return "Obesidad grado III (≥ 40)";
}

export default function ClinicalInfoFields({
  data,
  onChange,
  onDirty,
}: ClinicalInfoFieldsProps) {
  const set = (field: keyof ClinicalData) => (value: string) => {
    onChange(field, value);
    onDirty();
  };

  const weight = parseFloat(data.weightKg);
  const height = parseFloat(data.heightM);
  const bmi =
    weight > 0 && height > 0 ? +(weight / (height * height)).toFixed(2) : null;
  const bmiPreview = bmi !== null ? bmi.toString() : "";
  const bmiStatusPreview = bmi !== null ? getBmiStatus(bmi) : "";

  return (
    <>
      {/* Peso y Estatura */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="col-span-2 -mb-2">
          <p className="text-[10px] uppercase tracking-wider text-gray-400">
            TODOS LOS CAMPOS SON OBLIGATORIOS **
          </p>
        </div>

        <ValidatedInput
          id="weight"
          label="Peso (kg)"
          type="number"
          placeholder="Peso del paciente"
          value={data.weightKg}
          onChange={set("weightKg")}
          required
          min={2}
          max={400}
        />

        <ValidatedInput
          id="height"
          label="Estatura (m)"
          type="number"
          placeholder="Estatura del paciente"
          value={data.heightM}
          onChange={set("heightM")}
          required
          min={1.2}
          max={2.5}
        />
      </div>

      {/* BMI y Estado del BMI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label
            htmlFor="bmi_preview"
            className="block text-sm font-medium text-gray-700"
          >
            IMC
          </label>
          <input
            id="bmi_preview"
            value={bmiPreview}
            disabled
            className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estado del IMC
          </label>
          <div className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm text-sm text-gray-900 flex items-center">
            {bmiStatusPreview || "—"}
          </div>
        </div>
      </div>

      {/* Antecedentes médicos */}
      <div className="mt-6">
        <label
          htmlFor="medical_background"
          className="block text-sm font-medium text-gray-700"
        >
          Antecedentes médicos relevantes
        </label>
        <textarea
          id="medical_background"
          name="medical_background"
          rows={4}
          required
          value={data.medicalBackground}
          onChange={(e) => {
            onChange("medicalBackground", e.target.value);
            onDirty();
          }}
          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          placeholder="Patologías previas, intervenciones quirúrgicas, alergias, medicación actual, condiciones relevantes para el procedimiento."
        />
      </div>
    </>
  );
}
