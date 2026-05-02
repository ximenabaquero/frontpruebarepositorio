"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Definimos los contextos posibles para tu aplicación
export type SearchContext =
  | "dashboard"
  | "compras"
  | "distribuidores"
  | "consumos";

interface Props {
  contexto: SearchContext;
  onSearch: (query: string) => void;
  value: string;
}

export default function InventorySearchBar({
  contexto,
  onSearch,
  value,
}: Props) {
  /**
   * Configuración dinámica del buscador.
   * Centralizamos aquí los textos para que el componente sea "inteligente".
   */
  const config = {
    dashboard: {
      placeholder: "Buscar por nombre de producto",
      label: "Inventario General",
    },
    compras: {
      placeholder: "Buscar por producto, distribuidor o regsitrado por...",
      label: "Historial de Compras",
    },
    distribuidores: {
      placeholder: "Buscar por nombre o celular",
      label: "Directorio de Proveedores",
    },
    consumos: {
      placeholder: "Buscar por cliente o número de pedido...",
      label: "Historial de Consumos",
    },
  };

  const currentConfig = config[contexto];

  return (
    <div className="w-full space-y-2">
      {/* Etiqueta sutil que indica qué estamos buscando */}
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
        Búsqueda en {currentConfig.label}
      </span>

      <div className="relative group">
        {/* Icono de Lupa */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>

        {/* Input adaptativo */}
        <input
          type="text"
          value={value}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={currentConfig.placeholder}
          className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl 
                     text-sm placeholder-gray-400 shadow-sm transition-all
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                     hover:border-gray-300"
        />
      </div>
    </div>
  );
}
