import ValidatedInput from "./ValidatedInput";

type PatientBasicsFieldsProps = {
  firstName: string;
  setFirstName: (v: string) => void;

  lastName: string;
  setLastName: (v: string) => void;

  age: string;
  setAge: (v: string) => void;

  cellphone: string;
  setCellphone: (v: string) => void;

  referrerName: string;
  setReferrerName: (v: string) => void;

  biologicalSex: string;
  setBiologicalSex: (v: string) => void;

  onDirty: () => void;
};

export default function PatientBasicsFields({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  age,
  setAge,
  cellphone,
  setCellphone,
  referrerName,
  setReferrerName,
  biologicalSex,
  setBiologicalSex,
  onDirty,
}: PatientBasicsFieldsProps) {
  return (
    <>
      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="col-span-2 -mb-2">
          <p className="text-[10px] uppercase tracking-wider text-gray-400">
            TODOS LOS CAMPOS SON OBLIGATORIOS **
          </p>
        </div>

        <ValidatedInput
          id="first_name"
          label="Nombre(s)"
          placeholder="Nombre(s) del paciente"
          value={firstName}
          onChange={(val) => {
            setFirstName(val);
            onDirty();
          }}
          required
          maxLength={100}
        />

        <ValidatedInput
          id="last_name"
          label="Apellido(s)"
          placeholder="Apellido(s) del paciente"
          value={lastName}
          onChange={(val) => {
            setLastName(val);
            onDirty();
          }}
          required
          maxLength={100}
        />
      </div>

      {/* Edad y Celular */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <ValidatedInput
          id="age"
          label="Edad"
          type="number"
          placeholder="Edad del paciente"
          value={age}
          onChange={(val) => {
            setAge(val);
            onDirty();
          }}
          required
          min={14}
          max={120}
        />

        <ValidatedInput
          id="cellphone"
          label="Celular"
          type="tel"
          placeholder="Celular del paciente"
          value={cellphone}
          onChange={(val) => {
            let value = val.replace(/\D/g, "");
            if (value.length > 10) value = value.slice(0, 10);

            const formatted = value.replace(
              /(\d{3})(\d{3})(\d{0,4})/,
              (_, g1, g2, g3) => (g3 ? `${g1} ${g2} ${g3}` : `${g1} ${g2}`),
            );

            setCellphone(formatted);
            onDirty();
          }}
          required
          maxLength={15}
        />
      </div>

      {/* Remitente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label
            htmlFor="referrer_name"
            className="block text-sm font-medium text-gray-700"
          >
            Remitente
          </label>

          <div className="relative">
            <select
              id="referrer_name"
              required
              value={referrerName}
              onChange={(e) => {
                setReferrerName(e.target.value);
                onDirty();
              }}
              className="mt-1 w-full appearance-none rounded-xl border border-gray-200 bg-white 
                        px-3 py-2 text-sm text-gray-900 shadow-sm 
                        focus:outline-none focus:ring-0 focus:border-gray-300"
            >
              <option value="">Seleccione un profesional</option>
              <option value="Dra. Adele">Dra. Adele</option>
              <option value="Dra. Fernanda">Dra. Fernanda</option>
              <option value="Dr. Alexander">Dr. Alexander</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              ▼
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            &nbsp;
          </label>
          <div
            className="mt-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 
                          text-sm font-medium text-amber-900"
          >
            Obligatorio para comisión.
          </div>
        </div>
      </div>

      {/* Sexo biológico */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label
            htmlFor="biological_sex"
            className="block text-sm font-medium text-gray-700"
          >
            Sexo biológico
          </label>

          <div className="relative">
            <select
              id="biological_sex"
              required
              value={biologicalSex}
              onChange={(e) => {
                setBiologicalSex(e.target.value);
                onDirty();
              }}
              className="mt-1 w-full appearance-none rounded-xl border border-gray-200 bg-white 
                        px-3 py-2 text-sm text-gray-900 shadow-sm 
                        focus:outline-none focus:ring-0 focus:border-gray-300"
            >
              <option value="">Seleccione una opción</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              ▼
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
