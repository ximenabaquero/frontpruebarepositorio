import { ChevronDownIcon } from "@heroicons/react/24/outline";

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  children: React.ReactNode;
};

export default function SelectField({
  id,
  label,
  value,
  onChange,
  required,
  children,
}: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <select
          id={id}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white
                     px-3 py-2 pr-8 text-sm text-gray-900 shadow-sm
                     focus:outline-none focus:ring-0 focus:border-gray-300"
        >
          {children}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}
