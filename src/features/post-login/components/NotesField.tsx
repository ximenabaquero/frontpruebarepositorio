type NotesFieldProps = {
  onDirty: () => void;
};

export default function NotesField({ onDirty }: NotesFieldProps) {
  return (
    <div>
      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
        Notas clínicas
      </label>
      <textarea
        id="notes"
        name="notes"
        rows={4}
        onChange={onDirty}
        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        placeholder="Hallazgos, objetivos del tratamiento, observaciones..."
      />
    </div>
  );
}
