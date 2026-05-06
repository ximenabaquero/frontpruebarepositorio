"use client";

import StockNotificationBell from "./StockNotificationBell";

type TabType =
  | "dashboard"
  | "compras"
  | "consumos"
  | "distribuidores"
  | "reportes";

interface InventoryNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isAdmin?: boolean;
}

const ALL_TABS: { key: TabType; label: string; adminOnly?: boolean }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "compras", label: "Compras" },
  { key: "consumos", label: "Consumos" },
  { key: "distribuidores", label: "Distribuidores" },
  { key: "reportes", label: "Reportes", adminOnly: true },
];

const activeBtn =
  "rounded-xl px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold shrink-0 transition-all duration-200 bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-200";

const inactiveBtn =
  "rounded-xl px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold shrink-0 transition-all duration-200 border border-transparent bg-white text-gray-500 hover:border-emerald-200 hover:text-emerald-700 hover:shadow-md hover:shadow-emerald-100";

export default function InventoryNav({
  activeTab,
  onTabChange,
  isAdmin = false,
}: InventoryNavProps) {
  const TABS = ALL_TABS.filter((t) => !t.adminOnly || isAdmin);

  return (
    <nav className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Columna Izquierda (Espaciador) */}
        <div />

        {/* Columna Central: Tabs centrados */}
        <div className="flex items-center gap-2 sm:gap-5 flex-wrap justify-center">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={activeTab === key ? activeBtn : inactiveBtn}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Columna Derecha: Campana alineada al final */}
        <div className="flex justify-end">
          <StockNotificationBell />
        </div>
      </div>
    </nav>
  );
}
