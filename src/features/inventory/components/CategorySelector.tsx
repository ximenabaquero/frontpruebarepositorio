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
    <div className="flex flex-col gap-3">
      {" "}
      {/* Contenedor vertical para separar el título de los botones */}
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
        Categorias
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {" "}
        {/* Contenedor horizontal para los botones */}
        <button
          onClick={() => onSelect(null)}
          className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 border ${
            activeCategoryId === null
              ? "bg-white text-blue-600 border-blue-200 shadow-sm font-bold"
              : "bg-white text-gray-500 border-gray-200 font-medium hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 border ${
              activeCategoryId === cat.id
                ? "bg-white text-blue-600 border-blue-200 shadow-sm font-bold"
                : "bg-white text-gray-500 border-gray-200 font-medium hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
