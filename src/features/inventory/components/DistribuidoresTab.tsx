"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "./PageHeader";
import type { Distributor } from "../types";

interface DistribuidoresTabProps {
  distributors: Distributor[];
}

export default function DistribuidoresTab({
  distributors,
}: DistribuidoresTabProps) {
  return (
    <>
      <PageHeader
        eyebrow="Configuración"
        title="Distribuidores"
        subtitle="Proveedores con los que trabajas."
        actions={[
          <button
            key="new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Nuevo distribuidor
          </button>,
        ]}
      />

      {distributors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {distributors.map((dist) => (
            <div
              key={dist.id}
              className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
                  {dist.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {dist.name}
                  </h4>
                  <p className="text-xs text-gray-500">ID: {dist.id}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-1">
                  Total período actual
                </div>
                <div className="text-lg font-bold text-gray-900 font-mono">
                  —
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay distribuidores
          </h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
            Agrega distribuidores para llevar un mejor control de tus compras y
            proveedores.
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            <PlusIcon className="w-4 h-4" />
            Crear primer distribuidor
          </button>
        </div>
      )}
    </>
  );
}
