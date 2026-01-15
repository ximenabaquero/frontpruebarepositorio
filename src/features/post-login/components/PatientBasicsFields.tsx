type PatientBasicsFieldsProps = {
  onDirty: () => void;
};

export default function PatientBasicsFields({ onDirty }: PatientBasicsFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
            Nombre completo
          </label>
          <input
            id="full_name"
            name="full_name"
            required
            onChange={onDirty}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Ej. María Pérez"
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Edad
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min={0}
            max={150}
            required
            onChange={onDirty}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Ej. 34"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="referrer_name" className="block text-sm font-medium text-gray-700">
            Remitente
          </label>
          <input
            id="referrer_name"
            name="referrer_name"
            required
            onChange={onDirty}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Ej. Dr. Juan Pérez / Instagram / Amiga / etc"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
          <div className="mt-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
            Obligatorio para comisión.
          </div>
        </div>
      </div>
    </>
  );
}
