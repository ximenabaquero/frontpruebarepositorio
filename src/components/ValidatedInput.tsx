import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type ValidatedInputProps = {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  required?: boolean;
  value: string | number;
  onChange: (val: string) => void;
  // ── Props opcionales — no rompen ningún uso existente ──
  maxErrorMessage?: string; // mensaje custom cuando se supera el max
  clampToMin?: boolean; // fuerza el valor a min en vez de mostrar error
  as?: "input" | "textarea"; // renderiza textarea en lugar de input
  rows?: number; // filas para textarea
  showToggle?: boolean; // botón ojo para inputs de tipo password
  autoFocus?: boolean; // enfoca el input automáticamente al montar
};

export default function ValidatedInput({
  id,
  label,
  placeholder,
  type = "text",
  maxLength,
  min,
  max,
  required = false,
  value,
  onChange,
  maxErrorMessage,
  clampToMin = false,
  as = "input",
  rows = 3,
  showToggle = false,
  autoFocus = false,
}: ValidatedInputProps) {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const effectiveType =
    showToggle && type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  const baseClassName = `mt-1 w-full rounded-xl border bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
    error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-500/20"
  }`;

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    validate(val);
    onChange(val);
  };

  const handleChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    validate(val);
    onChange(val);
  };

  const validate = (val: string) => {
    if (maxLength && val.length > maxLength) {
      setError(`Máximo ${maxLength} caracteres.`);
    } else if (type === "number" && val !== "") {
      const normalizedVal = val.replace(",", ".");
      const num = Number(normalizedVal);

      const isBelowMin = min !== undefined && num < min;
      const isAboveMax = max !== undefined && num > max;

      if (isBelowMin) {
        if (clampToMin && min !== undefined) {
          setError("");
          onChange(String(min));
          return;
        }
        const unidades: Record<string, string> = {
          age: "años",
          weight: "kg",
          height: "m",
        };
        const unidad = unidades[id] || "";
        setError(`Rango permitido: ${min} a ${max} ${unidad}`.trim() + ".");
      } else if (isAboveMax) {
        const unidades: Record<string, string> = {
          age: "años",
          weight: "kg",
          height: "m",
        };
        const unidad = unidades[id] || "";
        setError(
          maxErrorMessage ??
            `Rango permitido: ${min} a ${max} ${unidad}`.trim() + ".",
        );
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          required={required}
          value={value}
          onChange={handleChangeTextarea}
          placeholder={placeholder}
          rows={rows}
          autoFocus={autoFocus}
          className={`${baseClassName} resize-none`}
        />
      ) : showToggle ? (
        <div className="relative">
          <input
            id={id}
            required={required}
            type={effectiveType}
            value={value}
            onChange={handleChangeInput}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={`${baseClassName} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      ) : (
        <input
          id={id}
          required={required}
          type={type}
          value={value}
          onChange={handleChangeInput}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={baseClassName}
        />
      )}
      {error && (
        <p className="text-[10px] uppercase font-semibold tracking-wider text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
