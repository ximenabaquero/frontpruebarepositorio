type ClinicalInfoFieldsProps = {
  weightKg: string;
  heightM: string;
  bmiPreview: string;
  bmiStatusPreview: string;
  onWeightChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onDirty: () => void;
};

export default function ClinicalInfoFields({
  weightKg,
  heightM,
  bmiPreview,
  bmiStatusPreview,
  onWeightChange,
  onHeightChange,
  onDirty,
}: ClinicalInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="biological_sex" className="block text-sm font-medium text-gray-700">
            Sexo biológico
          </label>
          <select
            id="biological_sex"
            name="biological_sex"
            defaultValue="Female"
            required
            onChange={onDirty}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="weight_kg" className="block text-sm font-medium text-gray-700">
            Peso (kg)
          </label>
          <input
            id="weight_kg"
            name="weight_kg"
            inputMode="decimal"
            required
            value={weightKg}
            onChange={(e) => {
              onDirty();
              onWeightChange(e.target.value);
            }}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Ej. 68.5"
          />
        </div>

        <div>
          <label htmlFor="height_m" className="block text-sm font-medium text-gray-700">
            Estatura (m)
          </label>
          <input
            id="height_m"
            name="height_m"
            inputMode="decimal"
            required
            value={heightM}
            onChange={(e) => {
              onDirty();
              onHeightChange(e.target.value);
            }}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Ej. 1.65"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="treatment_area" className="block text-sm font-medium text-gray-700">
            Área de tratamiento
          </label>
          <input
            id="treatment_area"
            name="treatment_area"
            required
            onChange={onDirty}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Ej. Abdomen"
          />
        </div>

        <div>
          <label htmlFor="bmi_preview" className="block text-sm font-medium text-gray-700">
            BMI (preview)
          </label>
          <input
            id="bmi_preview"
            value={bmiPreview}
            disabled
            className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
          />
          {bmiStatusPreview ? <div className="mt-1 text-xs text-gray-600">{bmiStatusPreview}</div> : null}
        </div>
      </div>
    </>
  );
}
