import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ValidatedInput from "./ValidatedInput";
import PhoneInputField from "./PhoneInputField";
import "react-phone-input-2/lib/style.css";

const MONTHS = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1919 }, (_, i) => CURRENT_YEAR - i);

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
  const [dobDay,   setDobDay]   = useState(() => dateOfBirth?.split("-")[2] ?? "");
  const [dobMonth, setDobMonth] = useState(() => dateOfBirth?.split("-")[1] ?? "");
  const [dobYear,  setDobYear]  = useState(() => dateOfBirth?.split("-")[0] ?? "");

  const handleDobChange = (day: string, month: string, year: string) => {
    if (day && month && year) {
      setDateOfBirth(`${year}-${month}-${day}`);
    } else {
      setDateOfBirth("");
    }
    onDirty();
  };

  const daysInMonth = dobMonth && dobYear
    ? new Date(Number(dobYear), Number(dobMonth), 0).getDate()
    : 31;
  const DAYS = Array.from({ length: daysInMonth }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const selectCls = "w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300";

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
          <label className="block text-sm font-medium text-gray-700">
            Fecha de nacimiento
          </label>
          <div className="mt-1 grid grid-cols-3 gap-2">
            {/* Día */}
            <div className="relative">
              <select
                value={dobDay}
                onChange={(e) => {
                  setDobDay(e.target.value);
                  handleDobChange(e.target.value, dobMonth, dobYear);
                }}
                className={selectCls}
              >
                <option value="">Día</option>
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {/* Mes */}
            <div className="relative">
              <select
                value={dobMonth}
                onChange={(e) => {
                  setDobMonth(e.target.value);
                  handleDobChange(dobDay, e.target.value, dobYear);
                }}
                className={selectCls}
              >
                <option value="">Mes</option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {/* Año */}
            <div className="relative">
              <select
                value={dobYear}
                onChange={(e) => {
                  setDobYear(e.target.value);
                  handleDobChange(dobDay, dobMonth, e.target.value);
                }}
                className={selectCls}
              >
                <option value="">Año</option>
                {YEARS.map((y) => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
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
