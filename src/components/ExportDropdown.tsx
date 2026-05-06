"use client";

import { useState } from "react";
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface ExportItem {
  label: string;
  onClick: () => void;
}

interface Props {
  items: ExportItem[];
  label?: string;
}

export default function ExportDropdown({ items, label = "Exportar" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl shadow-md shadow-emerald-200 hover:from-emerald-700 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-200 active:translate-y-[1px] transition-all duration-200"
      >
        <ArrowDownTrayIcon className="w-4 h-4 text-white/80" />
        {label}
        <ChevronDownIcon className="w-3 h-3 text-white/70" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
                className={`w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors ${i > 0 ? "border-t border-gray-100" : ""}`}
              >
                <ArrowDownTrayIcon className="w-4 h-4 text-gray-400" />
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
