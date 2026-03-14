import ValidatedInput from "./ValidatedInput";
import PhoneInputField from "./PhoneInputField";
import "react-phone-input-2/lib/style.css";

const DOCUMENT_TYPES = [
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "Pasaporte",
  "Tarjeta de Identidad",
];

type PatientBasicsFieldsProps = {
  firstName: string;
  setFirstName: (v: string) => void;

  lastName: string;
  setLastName: (v: string) => void;

  documentType: string;
  setDocumentType: (v: string) => void;

  cedula: string;
  setCedula: (v: string) => void;

  dateOfBirth: string;
  setDateOfBirth: (v: string) => void;

  cellphone: string;
  setCellphone: (v: string) => void;

  biologicalSex: string;
  setBiologicalSex: (v: string) => void;

  onDirty: () => void;
};

export default function PatientBasicsFields({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  documentType,
  setDocumentType,
  dateOfBirth,
  setDateOfBirth,
  cedula,
  setCedula,
  cellphone,
  setCellphone,
  biologicalSex,
  setBiologicalSex,
  onDirty,
}: PatientBasicsFieldsProps) {
  const calculatedAge = (() => {
    if (!dateOfBirth) return "";
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 0 ? age : "";
  })();

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

      {/* Fecha de nacimiento y Edad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label
            htmlFor="date_of_birth"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha de nacimiento
          </label>
          <input
            id="date_of_birth"
            type="date"
            required
            max={new Date().toISOString().split("T")[0]}
            value={dateOfBirth}
            onChange={(e) => {
              setDateOfBirth(e.target.value);
              onDirty();
            }}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white 
                       px-3 py-2 text-sm text-gray-900 shadow-sm 
                       focus:outline-none focus:ring-0 focus:border-gray-300"
          />
        </div>

        <div>
          <label
            htmlFor="calculated_age"
            className="block text-sm font-medium text-gray-700"
          >
            Edad
          </label>
          <input
            id="calculated_age"
            type="text"
            value={calculatedAge !== "" ? `${calculatedAge} años` : ""}
            readOnly
            className={`mt-1 w-full rounded-xl border 
              ${
                calculatedAge !== "" &&
                (calculatedAge < 14 || calculatedAge > 120)
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }
              px-3 py-2 text-sm text-gray-900 shadow-sm`}
          />
          {calculatedAge !== "" &&
            (calculatedAge < 14 || calculatedAge > 120) && (
              <p className="text-[10px] uppercase font-semibold tracking-wider text-red-500 mt-1">
                Rango permitido: 14 a 120 años.
              </p>
            )}
        </div>
      </div>

      {/* Tipo de documento y Cédula */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label
            htmlFor="document_type"
            className="block text-sm font-medium text-gray-700"
          >
            Tipo de documento
          </label>
          <div className="relative">
            <select
              id="document_type"
              required
              value={documentType}
              onChange={(e) => {
                setDocumentType(e.target.value);
                onDirty();
              }}
              className="mt-1 w-full appearance-none rounded-xl border border-gray-200 bg-white 
                         px-3 py-2 text-sm text-gray-900 shadow-sm 
                         focus:outline-none focus:ring-0 focus:border-gray-300"
            >
              <option value="">Seleccione un tipo</option>
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <ValidatedInput
          id="cedula"
          label="Número de documento"
          placeholder="Número de documento"
          value={cedula}
          onChange={(val) => {
            setCedula(val);
            onDirty();
          }}
          required
          maxLength={15}
        />
      </div>

      {/* Celular y Sexo biológico */}
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
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <PhoneInputField
          value={cellphone}
          onChange={setCellphone}
          onDirty={onDirty}
        />
      </div>

    </>
  );
}
