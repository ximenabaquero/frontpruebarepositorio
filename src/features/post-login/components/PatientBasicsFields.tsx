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
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-gray-700"
          >
            Primer Nombre
          </label>
          <input
            id="first_name"
            required
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              onDirty();
            }}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Nombre del paciente"
          />
        </div>

        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700"
          >
            Primer Apellido
          </label>
          <input
            id="last_name"
            required
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              onDirty();
            }}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 
                       text-gray-900 shadow-sm placeholder:text-gray-400 
                       focus:outline-none focus:ring-0 focus:border-gray-300"
            placeholder="Apellido del paciente"
          />
        </div>
      </div>

      {/* Edad y Celular */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700"
          >
            Edad
          </label>
          <input
            id="age"
            type="number"
            required
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              onDirty();
            }}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 
                       text-gray-900 shadow-sm placeholder:text-gray-400 
                       focus:outline-none focus:ring-0 focus:border-gray-300"
            placeholder="Edad del paciente"
          />
        </div>

        <div>
          <label
            htmlFor="cellphone"
            className="block text-sm font-medium text-gray-700"
          >
            Celular
          </label>
          <input
            id="cellphone"
            type="tel"
            required
            value={cellphone}
            onChange={(e) => {
              setCellphone(e.target.value);
              onDirty();
            }}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 
                       text-gray-900 shadow-sm placeholder:text-gray-400 
                       focus:outline-none focus:ring-0 focus:border-gray-300"
            placeholder="Número de contacto"
          />
        </div>
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
              <option value="Female">Femenino</option>
              <option value="Male">Masculino</option>
              <option value="Other">Otro</option>
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
