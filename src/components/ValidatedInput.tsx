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
}: ValidatedInputProps) {
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (maxLength && val.length > maxLength) {
      setError(`Máximo ${maxLength} caracteres.`);
    }

    // Validación numérica (Edad, Peso, Estatura)
    else if (type === "number" && val !== "") {
      // Reemplazamos coma por punto por si el usuario escribe en formato latino
      const normalizedVal = val.replace(",", ".");
      const num = Number(normalizedVal);

      // Verificamos si es un número válido y si está fuera de rango
      const isBelowMin = min !== undefined && num < min;
      const isAboveMax = max !== undefined && num > max;

      if (isBelowMin || isAboveMax) {
        // Mapeo de unidades según el ID
        const unidades: Record<string, string> = {
          age: "años",
          weight: "kg",
          height: "m",
        };

        const unidad = unidades[id] || "";
        setError(`Rango permitido: ${min} a ${max} ${unidad}`.trim() + ".");
      } else {
        setError("");
      }
    }
    // 3. Limpiar error si el campo está vacío o es válido
    else {
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
