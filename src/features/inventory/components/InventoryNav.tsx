"use client";

type TabType =
  | "dashboard"
  | "distribuidores"
  | "compras"
  | "consumos"
  | "reportes";

interface InventoryNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS: { key: TabType; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "distribuidores", label: "Distribuidores" },
  { key: "compras", label: "Compras" },
  { key: "consumos", label: "Consumos" },
  { key: "reportes", label: "Reportes" },
];

export default function InventoryNav({
  activeTab,
  onTabChange,
}: InventoryNavProps) {
  return (
    <nav className="w-full border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-1 h-12">
        {TABS.map(({ key, label }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`
                relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border
                ${
                  isActive
                    ? "bg-white text-indigo-700 border-indigo-200 shadow-sm"
                    : "bg-transparent text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50"
                }
              `}
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
