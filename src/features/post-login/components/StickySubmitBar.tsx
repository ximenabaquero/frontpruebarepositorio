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
            Seleccionados:{" "}
            <span className="font-semibold">{selectedCount}</span>
          </div>
          <div>
            Total (COP): <span className="font-semibold">{stickyTotalCop}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
