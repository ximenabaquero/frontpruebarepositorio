import { useState, useEffect, useMemo } from "react";

export function usePagination<T>(items: T[], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  // Resetear a página 1 cuando cambia la lista (ej: nueva búsqueda)
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const paginatedItems = useMemo(
    () =>
      items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [items, currentPage, itemsPerPage],
  );

  const goToNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToPage = (page: number) =>
    setCurrentPage(Math.min(totalPages, Math.max(1, page)));

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToNext,
    goToPrev,
    goToPage,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
}
