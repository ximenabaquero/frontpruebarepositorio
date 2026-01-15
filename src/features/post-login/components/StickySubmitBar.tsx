type StickySubmitBarProps = {
  selectedCount: number;
  stickyTotalCop: string;
  isSubmitting: boolean;
};

export default function StickySubmitBar({
  selectedCount,
  stickyTotalCop,
  isSubmitting,
}: StickySubmitBarProps) {
  return (
    <div className="sticky bottom-0 z-20 -mx-6 mt-6 border-t border-emerald-100 bg-white/95 px-6 py-3 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-700">
          <div>
            Seleccionados: <span className="font-semibold">{selectedCount}</span>
          </div>
          <div>
            Total (COP): <span className="font-semibold">{stickyTotalCop}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Guardando..." : "Guardar registro"}
          </button>
          <span className="hidden text-xs text-gray-500 sm:inline">El backend define elegibilidad y BMI.</span>
        </div>
      </div>
    </div>
  );
}
