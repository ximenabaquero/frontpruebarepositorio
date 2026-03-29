import {
  PencilSquareIcon,
  CheckCircleIcon,
  PauseCircleIcon,
  NoSymbolIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import PaginationBar from "@/components/PaginationBar";
import { usePagination } from "@/utils/usePagination";
import type { Remitente } from "../types";

const STATUS_CONFIG = {
  active:   { label: "Activo",    classes: "bg-emerald-100 text-emerald-700" },
  inactive: { label: "Inactivo",  classes: "bg-yellow-100 text-yellow-700" },
  fired:    { label: "Despedido", classes: "bg-red-100 text-red-600" },
} as const;

type Props = {
  remitentes: Remitente[];
  onEdit: (r: Remitente) => void;
  onChangeStatus: (id: number, action: "activar" | "inactivar" | "despedir", label: string) => void;
};

export default function RemitentesTable({ remitentes, onEdit, onChangeStatus }: Props) {
  const { currentPage, totalPages, paginatedItems, goToNext, goToPrev, isFirstPage, isLastPage } =
    usePagination(remitentes, 10);

  if (remitentes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-gray-200 bg-white">
        <UserGroupIcon className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Aún no hay remitentes</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-emerald-600 to-teal-600">
            <tr className="text-left text-xs font-semibold text-white/95 uppercase tracking-wide">
              <th className="px-5 py-3">Especialista</th>
              <th className="px-5 py-3 hidden md:table-cell">Usuario del sistema</th>
              <th className="px-5 py-3 hidden sm:table-cell">Celular</th>
              <th className="px-5 py-3 w-px whitespace-nowrap">Estado</th>
              <th className="px-5 py-3 w-px whitespace-nowrap text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedItems.map((r) => {
              const sc = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.inactive;
              return (
                <tr key={r.id} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900 text-sm">{r.first_name} {r.last_name}</p>
                    <p className="text-xs text-gray-400">{r.email}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-600">@{r.name}</span>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-sm text-gray-600">{r.cellphone}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${sc.classes}`}>
                      {r.status === "active"   && <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />}
                      {r.status === "inactive" && <span className="h-2 w-2 rounded-full border-2 border-yellow-500 shrink-0" />}
                      {r.status === "fired"    && <NoSymbolIcon className="h-3 w-3 text-red-500 shrink-0" />}
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        title={r.status === "fired" ? "No se puede editar un remitente despedido" : "Editar"}
                        onClick={() => r.status !== "fired" && onEdit(r)}
                        disabled={r.status === "fired"}
                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      {r.status !== "active" && (
                        <button title="Activar" onClick={() => onChangeStatus(r.id, "activar", "Activar")} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors">
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                      )}
                      {r.status === "active" && (
                        <button title="Inactivar" onClick={() => onChangeStatus(r.id, "inactivar", "Inactivar")} className="p-1.5 rounded-lg text-yellow-500 hover:bg-yellow-50 transition-colors">
                          <PauseCircleIcon className="h-4 w-4" />
                        </button>
                      )}
                      {r.status !== "fired" && (
                        <button title="Despedir" onClick={() => onChangeStatus(r.id, "despedir", "Despedir")} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                          <NoSymbolIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={remitentes.length}
        itemsPerPage={10}
        onNext={goToNext}
        onPrev={goToPrev}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
      />
    </div>
  );
}
