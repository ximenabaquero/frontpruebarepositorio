"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ChevronDown, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  CheckCircle2,
  AlertTriangle,
  AlertCircle
} from "lucide-react";
import { usePagination } from "@/utils/usePagination";
import PaginationBar from "@/components/PaginationBar";
import { pacientesPagador, type Riesgo, type Tendencia } from "@/data/mock/pacientes";

const RIESGO_STYLES: Record<Riesgo, { bg: string; text: string; dot: string; label: string }> = {
  alto:  { bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-500",     label: "Alto"  },
  medio: { bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500",  label: "Medio" },
  bajo:  { bg: "bg-emerald-100",text: "text-emerald-700",dot: "bg-emerald-500",label: "Bajo"  },
};

function AdherenciaBadge({ pct }: { pct: number }) {
  let Icon = AlertCircle;
  let color = "text-red-700";

  if (pct >= 90) {
    Icon = CheckCircle2;
    color = "text-emerald-700";
  } else if (pct >= 70) {
    Icon = AlertTriangle;
    color = "text-amber-700";
  }

  return (
    <span className={`text-xs font-bold ${color} flex items-center gap-1.5`}>
      <Icon className="w-4 h-4" />
      <span>{pct}%</span>
    </span>
  );
}

function TendenciaBadge({ t }: { t: Tendencia }) {
  if (t === "mejorando") return (
    <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
      <TrendingUp className="w-3.5 h-3.5" /> Mejorando
    </span>
  );
  if (t === "deteriorando") return (
    <span className="flex items-center gap-1 text-red-600 text-xs font-semibold">
      <TrendingDown className="w-3.5 h-3.5" /> Deteriorando
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-gray-500 text-xs font-semibold">
      <Minus className="w-3.5 h-3.5" /> Estable
    </span>
  );
}

export default function PacientesListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterRiesgo, setFilterRiesgo] = useState<"todos" | Riesgo>("todos");

  const filtered = useMemo(() => {
    return pacientesPagador.filter((p) => {
      const matchSearch =
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.cedula.includes(search) ||
        p.diagnostico.toLowerCase().includes(search.toLowerCase());
      const matchRiesgo = filterRiesgo === "todos" || p.riesgo === filterRiesgo;
      return matchSearch && matchRiesgo;
    });
  }, [search, filterRiesgo]);

  const { paginatedItems, currentPage, totalPages, goToNext, goToPrev, isFirstPage, isLastPage } =
    usePagination(filtered, 10);

  const counts = useMemo(() => ({
    alto: pacientesPagador.filter((p) => p.riesgo === "alto").length,
    medio: pacientesPagador.filter((p) => p.riesgo === "medio").length,
    bajo: pacientesPagador.filter((p) => p.riesgo === "bajo").length,
  }), []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes Monitoreados</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pacientesPagador.length} pacientes activos · EPS Sura · Mayo 2026
          </p>
        </div>
        {/* Mini resumen de riesgo */}
        <div className="flex items-center gap-2">
          {(["alto", "medio", "bajo"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRiesgo(filterRiesgo === r ? "todos" : r)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                filterRiesgo === r
                  ? `${RIESGO_STYLES[r].bg} ${RIESGO_STYLES[r].text} border-transparent`
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${RIESGO_STYLES[r].dot}`} />
              {counts[r]} {r}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o diagnóstico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
          />
        </div>
        <div className="relative">
          <select
            value={filterRiesgo}
            onChange={(e) => setFilterRiesgo(e.target.value as "todos" | Riesgo)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none bg-white"
          >
            <option value="todos">Todos los riesgos</option>
            <option value="alto">Alto riesgo</option>
            <option value="medio">Riesgo medio</option>
            <option value="bajo">Bajo riesgo</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {(search || filterRiesgo !== "todos") && (
          <button
            onClick={() => { setSearch(""); setFilterRiesgo("todos"); }}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Paciente</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Diagnóstico</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Días post-alta</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Riesgo</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Adherencia</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Tendencia</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Ver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedItems.map((p, idx) => {
                const rs = RIESGO_STYLES[p.riesgo];
                const globalIdx = (currentPage - 1) * 10 + idx + 1;
                return (
                  <tr
                    key={p.id}
                    onClick={() => router.push(`/pacientes/${p.id}`)}
                    className="hover:bg-emerald-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="px-5 py-3.5 text-xs text-gray-400 font-medium">{globalIdx}</td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">{p.nombre}</p>
                      <p className="text-xs text-gray-400">{p.cedula}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-gray-700 text-xs leading-snug max-w-[180px]">{p.diagnostico}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-gray-900">Día {p.dias_post_alta}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${rs.bg} ${rs.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${rs.dot}`} />
                          {rs.label}
                        </span>
                        <span className="text-xs font-bold text-gray-700">{p.riesgo_pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <AdherenciaBadge pct={p.adherencia} />
                    </td>
                    <td className="px-4 py-3.5">
                      <TendenciaBadge t={p.tendencia} />
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/pacientes/${p.id}`); }}
                        className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Sin resultados para los filtros aplicados</p>
            </div>
          )}
        </div>

        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={10}
          onNext={goToNext}
          onPrev={goToPrev}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
        />
      </div>
    </div>
  );
}