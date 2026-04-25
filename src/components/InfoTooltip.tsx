"use client";

import { useState, useEffect, useRef } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

type Props = {
  text: string;
  position?: "top" | "bottom";
};

export default function InfoTooltip({ text, position = "top" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const bubbleClass =
    position === "bottom"
      ? "top-full mt-1.5 bottom-auto"
      : "bottom-full mb-1.5 top-auto";

  const arrowClass =
    position === "bottom"
      ? "bottom-full border-b-gray-800 border-t-transparent top-auto"
      : "top-full border-t-gray-800 border-b-transparent bottom-auto";

  return (
    <span ref={ref} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center focus:outline-none"
      >
        <InformationCircleIcon
          className={`w-3.5 h-3.5 transition-colors ${open ? "text-gray-600" : "text-gray-400 hover:text-gray-600"}`}
        />
      </button>
      {open && (
        <span
          className={`absolute left-1/2 -translate-x-1/2 ${bubbleClass} w-52 rounded-lg bg-gray-800 px-3 py-2 text-xs text-white leading-snug z-50 shadow-lg normal-case tracking-normal font-normal`}
        >
          {text.charAt(0).toUpperCase() + text.slice(1)}
          <span
            className={`absolute left-1/2 -translate-x-1/2 ${arrowClass} border-4 border-transparent`}
          />
        </span>
      )}
    </span>
  );
}
