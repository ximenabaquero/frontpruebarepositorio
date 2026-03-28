import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

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

type DateOfBirthPickerProps = {
  value: string;       // "YYYY-MM-DD" | ""
  onChange: (date: string) => void;
  onDirty: () => void;
};

export default function DateOfBirthPicker({ value, onChange, onDirty }: DateOfBirthPickerProps) {
  const [dobDay,   setDobDay]   = useState(() => value?.split("-")[2] ?? "");
  const [dobMonth, setDobMonth] = useState(() => value?.split("-")[1] ?? "");
  const [dobYear,  setDobYear]  = useState(() => value?.split("-")[0] ?? "");

  const handleChange = (day: string, month: string, year: string) => {
    if (day && month && year) {
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange("");
    }
    onDirty();
  };

  const daysInMonth = dobMonth && dobYear
    ? new Date(Number(dobYear), Number(dobMonth), 0).getDate()
    : 31;
  const DAYS = Array.from({ length: daysInMonth }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const selectCls =
    "w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300";

  const calculatedAge = (() => {
    if (!value) return "";
    const today = new Date();
    const birth = new Date(value);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 0 ? age : "";
  })();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Fecha */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fecha de nacimiento
        </label>
        <div className="mt-1 grid grid-cols-3 gap-2">
          <div className="relative">
            <select
              value={dobDay}
              onChange={(e) => { setDobDay(e.target.value); handleChange(e.target.value, dobMonth, dobYear); }}
              className={selectCls}
            >
              <option value="">Día</option>
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={dobMonth}
              onChange={(e) => { setDobMonth(e.target.value); handleChange(dobDay, e.target.value, dobYear); }}
              className={selectCls}
            >
              <option value="">Mes</option>
              {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={dobYear}
              onChange={(e) => { setDobYear(e.target.value); handleChange(dobDay, dobMonth, e.target.value); }}
              className={selectCls}
            >
              <option value="">Año</option>
              {YEARS.map((y) => <option key={y} value={String(y)}>{y}</option>)}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Edad calculada */}
      <div>
        <label htmlFor="calculated_age" className="block text-sm font-medium text-gray-700">
          Edad
        </label>
        <input
          id="calculated_age"
          type="text"
          value={calculatedAge !== "" ? `${calculatedAge} años` : ""}
          readOnly
          className={`mt-1 w-full rounded-xl border
            ${calculatedAge !== "" && (calculatedAge < 14 || calculatedAge > 120)
              ? "border-red-300 bg-red-50"
              : "border-gray-200 bg-gray-50"}
            px-3 py-2 text-sm text-gray-900 shadow-sm`}
        />
        {calculatedAge !== "" && (calculatedAge < 14 || calculatedAge > 120) && (
          <p className="text-[10px] uppercase font-semibold tracking-wider text-red-500 mt-1">
            Rango permitido: 14 a 120 años.
          </p>
        )}
      </div>
    </div>
  );
}
