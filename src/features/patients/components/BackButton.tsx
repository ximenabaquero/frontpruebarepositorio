"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm hover:shadow-lg hover:shadow-blue-200 transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      <ArrowLeftIcon className="h-3 w-3" /> {/* flecha más pequeña */}
      Volver atrás
    </button>
  );
}
