import { useState } from "react";

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
  // ── Props nuevas, opcionales — no rompen ningún uso existente ──
  maxErrorMessage?: string; // mensaje custom cuando se supera el max
  clampToMin?: boolean; // fuerza el valor a min en vez de mostrar error
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
}: ValidatedInputProps) {
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (maxLength && val.length > maxLength) {
      setError(`Máximo ${maxLength} caracteres.`);
    } else if (type === "number" && val !== "") {
      const normalizedVal = val.replace(",", ".");
      const num = Number(normalizedVal);

      const isBelowMin = min !== undefined && num < min;
      const isAboveMax = max !== undefined && num > max;

      if (isBelowMin) {
        if (clampToMin && min !== undefined) {
          // Bloquea silenciosamente: fuerza el valor al mínimo
          setError("");
          onChange(String(min));
          return;
        }
        // Comportamiento original: muestra el rango (edad, peso, altura)
        const unidades: Record<string, string> = {
          age: "años",
          weight: "kg",
          height: "m",
        };
        const unidad = unidades[id] || "";
        setError(`Rango permitido: ${min} a ${max} ${unidad}`.trim() + ".");
      } else if (isAboveMax) {
        // Usa mensaje custom si se provee, si no el mensaje original
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

    onChange(val);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        required={required}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-500/20"
        }`}
      />
      {error && (
        <p className="text-[10px] uppercase font-semibold tracking-wider text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
