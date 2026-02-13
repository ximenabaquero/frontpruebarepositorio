import ValidatedInput from "./ValidatedInput";

type ClinicalInfoFieldsProps = {
  weightKg: string;
  heightM: string;
  bmiPreview: string;
  bmiStatusPreview: string;

  medicalBackground: string;
  onMedicalBackgroundChange: (value: string) => void;

  onWeightChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onDirty: () => void;
};

export default function ClinicalInfoFields({
  weightKg,
  heightM,
  bmiPreview,
  bmiStatusPreview,
  medicalBackground,
  onWeightChange,
  onHeightChange,
  onMedicalBackgroundChange,
  onDirty,
}: ClinicalInfoFieldsProps) {
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
          value={weightKg}
          onChange={(val) => {
            onWeightChange(val);
            onDirty();
          }}
          required
          min={2}
          max={400}
        />

        <ValidatedInput
          id="height"
          label="Estatura (m)"
          type="number"
          placeholder="Estatura del paciente"
          value={heightM}
          onChange={(val) => {
            onHeightChange(val);
            onDirty();
          }}
          required
          min={1.2}
          max={2.5}
        />
      </div>

      {/* BMI y Estado del BMI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {/* BMI */}
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

        {/* BMI Status como tarjeta */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estado del IMC
          </label>

          <div className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm text-sm text-gray-900 flex items-center">
            {bmiStatusPreview || "—"}
          </div>
        </div>
      </div>

      {/* Antecedentes médicos al final */}
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
          value={medicalBackground}
          onChange={(e) => {
            onMedicalBackgroundChange(e.target.value);
            onDirty();
          }}
          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          placeholder="Patologías previas, intervenciones quirúrgicas, alergias, medicación actual, condiciones relevantes para el procedimiento."
        />
      </div>
    </>
  );
}
