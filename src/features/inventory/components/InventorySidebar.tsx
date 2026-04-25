"use client";

import {
  CubeIcon,
  ShoppingCartIcon,
  TruckIcon,
  ChartBarIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

type TabType = "stock" | "consumos" | "compras" | "reportes" | "catalogo" | "distribuidores";

interface InventorySidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  productsCount: number;
  distributorsCount: number;
  criticalCount: number;
  lowCount: number;
  consumosToday?: number;
  comprasThisMonth?: number;
}

interface SidebarItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub?: string;
  badge?: number;
  badgeColor?: string;
}

function SidebarItem({
  active,
  onClick,
  icon: Icon,
  label,
  sub,
  badge,
  badgeColor = "bg-purple-600",
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg border-none cursor-pointer font-inherit text-left w-full
        transition-all duration-150
        ${
          active
            ? "bg-teal-50 text-teal-700"
            : "bg-transparent text-gray-700 hover:bg-gray-50"
        }
      `}
    >
      <Icon
        className={`w-4 h-4 flex-shrink-0 ${
          active ? "text-teal-600" : "text-gray-400"
        }`}
      />
      <div className="flex-1 min-w-0">
        <div className={`text-sm ${active ? "font-semibold" : "font-medium"}`}>
          {label}
        </div>
        {sub && (
          <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
        )}
      </div>
      {badge != null && badge > 0 && (
        <span
          className={`
            min-w-[20px] h-[18px] px-1.5 rounded-full text-white text-xs font-bold
            inline-flex items-center justify-center font-mono
            ${badgeColor}
          `}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export default function InventorySidebar({
  activeTab,
  onTabChange,
  productsCount,
  distributorsCount,
  criticalCount,
  lowCount,
  consumosToday = 0,
  comprasThisMonth = 0,
}: InventorySidebarProps) {
  const alertCount = criticalCount + lowCount;

  return (
    <aside className="bg-white border-r border-gray-200 py-6 px-4 flex flex-col gap-0.5 min-h-[calc(100vh-60px)]">
      <div className="px-3 pb-4 text-xs text-gray-500 uppercase tracking-wider font-semibold">
        Inventario
      </div>

      <SidebarItem
        active={activeTab === "stock"}
        onClick={() => onTabChange("stock")}
        icon={CubeIcon}
        label="Stock"
        badge={alertCount}
        badgeColor="bg-red-600"
      />

      <SidebarItem
        active={activeTab === "consumos"}
        onClick={() => onTabChange("consumos")}
        icon={ClipboardDocumentListIcon}
        label="Consumos"
        sub={consumosToday > 0 ? `Hoy · ${consumosToday} registros` : undefined}
      />

      <SidebarItem
        active={activeTab === "compras"}
        onClick={() => onTabChange("compras")}
        icon={ShoppingCartIcon}
        label="Compras"
        sub={comprasThisMonth > 0 ? `Este mes · ${comprasThisMonth}` : undefined}
      />

      <SidebarItem
        active={activeTab === "reportes"}
        onClick={() => onTabChange("reportes")}
        icon={ChartBarIcon}
        label="Reportes"
      />

      <SidebarItem
        active={activeTab === "catalogo"}
        onClick={() => onTabChange("catalogo")}
        icon={TagIcon}
        label="Catálogo"
        sub={`${productsCount} productos`}
      />

      <SidebarItem
        active={activeTab === "distribuidores"}
        onClick={() => onTabChange("distribuidores")}
        icon={TruckIcon}
        label="Distribuidores"
        sub={`${distributorsCount}`}
      />

      <div className="flex-1" />

      {/* Alert card */}
      {criticalCount > 0 && (
        <div className="mt-4 p-3.5 bg-red-50 border border-red-200 border-dashed rounded-lg">
          <div className="flex items-center gap-1.5 text-red-600 text-xs font-semibold mb-1.5">
            <ExclamationTriangleIcon className="w-3 h-3" />
            ATENCIÓN
          </div>
          <div className="text-sm text-gray-900 font-semibold mb-1">
            {criticalCount} {criticalCount === 1 ? "producto crítico" : "productos críticos"}
          </div>
          <div className="text-xs text-gray-600 mb-2.5">
            Stock muy bajo o agotado
          </div>
          <button
            onClick={() => onTabChange("stock")}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <ShoppingCartIcon className="w-3.5 h-3.5" />
            Ver stock
          </button>
        </div>
      )}
    </aside>
  );
}
