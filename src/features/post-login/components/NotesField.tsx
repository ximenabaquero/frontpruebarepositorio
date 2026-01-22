type NotesFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onDirty: () => void;
};

export default function NotesField({
  value,
  onChange,
  onDirty,
}: NotesFieldProps) {
  return (
    <div>
      <label
        htmlFor="procedure_notes"
        className="block text-sm font-medium text-gray-700"
      >
        Notas clínicas
      </label>
      <textarea
        id="procedure_notes"
        name="procedure_notes"
        rows={4}
        value={value}
        onChange={(e) => {
          onDirty();
          onChange(e.target.value);
        }}
        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        placeholder="Hallazgos relevantes, indicaciones específicas, observaciones clínicas importantes..."
      />
    </div>
  );
}
