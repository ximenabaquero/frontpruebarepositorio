import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationBarProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onNext: () => void;
  onPrev: () => void;
  isFirstPage: boolean;
  isLastPage: boolean;
};

export default function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onNext,
  onPrev,
  isFirstPage,
  isLastPage,
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3">
      {/* Rango visible */}
      <span className="text-xs text-gray-500">
        Mostrando{" "}
        <span className="font-semibold text-gray-700">
          {from}–{to}
        </span>{" "}
        de <span className="font-semibold text-gray-700">{totalItems}</span>
      </span>

      {/* Controles */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={isFirstPage}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
          Anterior
        </button>

        <span className="min-w-[60px] text-center text-xs text-gray-500">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={onNext}
          disabled={isLastPage}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Página siguiente"
        >
          Siguiente
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
