"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck,
  Users,
  MapPin,
  ClipboardList,
  Bell,
  LogOut,
  ChevronRight,
} from "lucide-react";
import DoctorGuide from "@/components/DoctorGuide";
import DemoTour from "@/components/DemoTour";
import PageTransition from "@/components/PageTransition";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { href: "/autorizaciones", label: "Solicitudes de autorización", icon: FileCheck, id: "autorizaciones" },
  { href: "/pacientes", label: "Pacientes", icon: Users, id: "pacientes" },
  { href: "/evidencia/1", label: "Evidencia de servicio", icon: MapPin, id: "evidencia" },
  { href: "/auditoria", label: "Auditoría y reportes", icon: ClipboardList, id: "auditoria" },
];

export default function PagadorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href.startsWith("/evidencia")) return pathname.startsWith("/evidencia");
    if (href.startsWith("/pacientes")) return pathname.startsWith("/pacientes");
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .olga-logo-font {
          font-family: 'DM Sans', sans-serif;
          font-weight: 800;
          letter-spacing: -1.5px;
          line-height: 1;
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5 mb-3">
            <Image src="/a-Olga.png" alt="Olga" width={28} height={28} className="object-contain" />
            <span className="olga-logo-font text-gray-900 text-lg">olga</span> 
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full leading-none">
              EPS Sura
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Plan Salud Complementario</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
            Navegación
          </p>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`w-4 h-4 flex-shrink-0 ${active ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"}`}
                />
                <span className="flex-1 leading-tight">{item.label}</span>
                {active && <ChevronRight className="w-3 h-3 text-emerald-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer del sidebar */}
        <div className="px-5 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              AS
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">Ana Sofía Vargas</p>
              <p className="text-[10px] text-gray-400 truncate">Auditora médica</p>
            </div>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-sm font-bold text-gray-900">
              {NAV_ITEMS.find((n) => isActive(n.href))?.label ?? "Dashboard"}
            </h1>
            <p className="text-[10px] text-gray-400">
              OLGA Healthtech · {new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DemoTour />
            <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                5
              </span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      {/* Doctor guía — flotante en todas las pantallas del pagador */}
      <DoctorGuide />
    </div>
  );
}