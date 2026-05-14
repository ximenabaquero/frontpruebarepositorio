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
  AlertCircle,
  Activity,
  ArrowUpRight
} from "lucide-react";
import { usePagination } from "@/utils/usePagination";
import PaginationBar from "@/components/PaginationBar";
import { pacientesPagador, type Riesgo, type Tendencia } from "@/data/mock/pacientes";

const RIESGO_STYLES: Record<Riesgo, { bg: string; text: string; dot: string; label: string }> = {
  alto:   { bg: "bg-rose-50",     text: "text-rose-700",     dot: "bg-rose-500",     label: "Alto"  },
  medio:  { bg: "bg-amber-50",    text: "text-amber-700",    dot: "bg-amber-500",    label: "Medio" },
  bajo:   { bg: "bg-emerald-50",  text: "text-emerald-700",  dot: "bg-emerald-500",  label: "Bajo"  },
};

function AdherenciaBadge({ pct }: { pct: number }) {
  let Icon = AlertCircle;
  let color = "text-rose-600";
  let bg = "bg-rose-50";

  if (pct >= 90) {
    Icon = CheckCircle2;
    color = "text-emerald-600";
    bg = "bg-emerald-50";
  } else if (pct >= 70) {
    Icon = AlertTriangle;
    color = "text-amber-600";
    bg = "bg-amber-50";
  }

  return (
    <span className={`text-[11px] font-bold ${color} ${bg} px-2 py-1 rounded border border-current/10 flex items-center gap-1.5 w-fit`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{pct}%</span>
    </span>
  );
}

function TendenciaBadge({ t }: { t: Tendencia }) {
  if (t === "mejorando") return (
    <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
      <TrendingUp className="w-3.5 h-3.5" /> Mejorando
    </span>
  );
  if (t === "deteriorando") return (
    <span className="flex items-center gap-1 text-rose-600 text-[10px] font-black uppercase tracking-wider">
      <TrendingDown className="w-3.5 h-3.5" /> Deteriorando
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-slate-400 text-[10px] font-black uppercase tracking-wider">
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
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 antialiased p-4 lg:p-8 space-y-8">
      
      {/* Header Estilo Olga */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 items-center rounded-full bg-indigo-500/10 px-2.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-500/20">
              EPS Sura Operaciones
            </span>
            <span className="text-sm font-medium text-slate-500 tracking-tight">Mayo 2026</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-slate-900">Pacientes Monitoreados</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {pacientesPagador.length} registros en red activa
          </p>
        </div>
        
        {/* Filtros rápidos (Badges de riesgo) */}
        <div className="flex items-center gap-2">
          {(["alto", "medio", "bajo"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRiesgo(filterRiesgo === r ? "todos" : r)}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] px-3 py-2 rounded-lg border transition-all ${
                filterRiesgo === r
                  ? `${RIESGO_STYLES[r].bg} ${RIESGO_STYLES[r].text} border-current/20 ring-1 ring-current/10 shadow-sm`
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${RIESGO_STYLES[r].dot} ${filterRiesgo === r ? 'animate-pulse' : ''}`} />
              {counts[r]} {r}
            </button>
          ))}
        </div>
      </header>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 flex flex-wrap gap-4 items-center shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="BUSCAR POR NOMBRE, CÉDULA O DIAGNÓSTICO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-bold uppercase tracking-widest bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="relative">
          <select
            value={filterRiesgo}
            onChange={(e) => setFilterRiesgo(e.target.value as "todos" | Riesgo)}
            className="text-[11px] font-bold uppercase tracking-wider border border-slate-200 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 appearance-none bg-slate-50 cursor-pointer"
          >
            <option value="todos">TODOS LOS RIESGOS</option>
            <option value="alto">ALTO RIESGO</option>
            <option value="medio">RIESGO MEDIO</option>
            <option value="bajo">BAJO RIESGO</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        {(search || filterRiesgo !== "todos") && (
          <button
            onClick={() => { setSearch(""); setFilterRiesgo("todos"); }}
            className="text-[10px] font-black text-rose-600 hover:text-rose-700 uppercase tracking-widest ml-2"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* Tabla con Estilo Auditoría */}
      <div className="bg-white rounded-xl ring-1 ring-slate-200 shadow-sm overflow-hidden border-t-2 border-t-indigo-500">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">#</th>
                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Paciente</th>
                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Diagnóstico Clínico</th>
                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Seguimiento</th>
                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Riesgo Bio</th>
                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Adherencia</th>
                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tendencia</th>
                <th className="text-center px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.map((p, idx) => {
                const rs = RIESGO_STYLES[p.riesgo];
                const globalIdx = (currentPage - 1) * 10 + idx + 1;
                return (
                  <tr
                    key={p.id}
                    onClick={() => router.push(`/pacientes/${p.id}`)}
                    className="group hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <td className="px-6 py-4 text-[11px] text-slate-400 font-bold">{globalIdx.toString().padStart(2, '0')}</td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{p.nombre}</p>
                      <p className="text-[10px] font-medium text-slate-400 tracking-widest">{p.cedula}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[11px] font-medium text-slate-600 leading-relaxed max-w-[200px] italic">
                        {p.diagnostico}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Activity size={12} className="text-indigo-500" />
                        <span className="text-xs font-bold text-slate-900">Día {p.dias_post_alta}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center justify-center gap-1.5 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter w-fit ${rs.bg} ${rs.text} ring-1 ring-current/10`}>
                          {rs.label}
                        </span>
                        <span className="text-[11px] font-bold text-slate-700">{p.riesgo_pct}% score</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <AdherenciaBadge pct={p.adherencia} />
                    </td>
                    <td className="px-4 py-4">
                      <TendenciaBadge t={p.tendencia} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                         <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <ArrowUpRight className="w-4 h-4" />
                         </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-20 bg-slate-50/50">
              <Search className="w-10 h-10 mx-auto mb-4 text-slate-200" />
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">No se encontraron registros en la red</p>
            </div>
          )}
        </div>

        <div className="bg-slate-50/50 border-t border-slate-100">
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

      {/* Footer Minimalista */}
      <footer className="pt-8 flex flex-col md:flex-row justify-between items-center border-t border-slate-200 gap-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 OLGA HEALTHTECH · INFRAESTRUCTURA SURA</p>
        <div className="flex gap-6 text-[10px] font-bold text-slate-400 tracking-widest">
          <button className="hover:text-indigo-600 transition-colors uppercase">Consola de Red</button>
          <button className="hover:text-indigo-600 transition-colors uppercase">Protocolos de Seguridad</button>
        </div>
      </footer>
    </div>
  );
}