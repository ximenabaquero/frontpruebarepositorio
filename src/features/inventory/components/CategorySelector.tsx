"use client";

import type { InventoryCategory } from "../types";

type Props = {
  categories: InventoryCategory[];
  activeCategoryId: number | null;
  onSelect: (id: number | null) => void;
};

export default function CategorySelector({
  categories,
  activeCategoryId,
  onSelect,
}: Props) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {/* Botón para "Todas" */}
      <button
        onClick={() => onSelect(null)}
        className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${
          activeCategoryId === null
            ? "bg-white text-indigo-600 ring-2 ring-indigo-100"
            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
        }`}
      >
        Todas
      </button>

      {/* Mapeo de categorías */}
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${
            activeCategoryId === cat.id
              ? "bg-white text-indigo-600 ring-2 ring-indigo-100"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
