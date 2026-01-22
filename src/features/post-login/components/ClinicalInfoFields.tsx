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
        <div>
          <label
            htmlFor="weight"
            className="block text-sm font-medium text-gray-700"
          >
            Peso (kg)
          </label>
          <input
            id="weight"
            name="weight"
            inputMode="decimal"
            required
            value={weightKg}
            onChange={(e) => {
              onDirty();
              onWeightChange(e.target.value);
            }}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Peso del paciente"
          />
        </div>

        <div>
          <label
            htmlFor="height"
            className="block text-sm font-medium text-gray-700"
          >
            Estatura (m)
          </label>
          <input
            id="height"
            name="height"
            inputMode="decimal"
            required
            value={heightM}
            onChange={(e) => {
              onDirty();
              onHeightChange(e.target.value);
            }}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Estatura del paciente"
          />
        </div>
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
