"use client";

import { useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import type { InventoryUsage } from "../../types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Tooltip universal con portal (sin scroll horizontal) ─────────────────────
function TooltipPortal({
  text,
  side = "right",
}: {
  text: string;
  side?: "left" | "right";
}) {
  const [pos, setPos] = useState<{ top: number; x: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({
      top: r.top + r.height / 2,
      x: side === "right" ? r.right + 8 : r.left - 8,
    });
  }, [side]);

  const hide = useCallback(() => setPos(null), []);

  return (
    <div
      ref={ref}
      onMouseEnter={show}
      onMouseLeave={hide}
      className="block w-full overflow-hidden"
    >
      <p className="text-xs text-gray-400 truncate cursor-default leading-tight">
        {text}
      </p>

      {pos &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              top: pos.top,
              transform: "translateY(-50%)",
              zIndex: 9999,
              // Para "left" anclamos desde la derecha de la ventana para no
              // depender de left y evitar cualquier desborde horizontal
              ...(side === "right"
                ? { left: pos.x }
                : { right: `calc(100vw - ${pos.x}px)` }),
            }}
            className="w-56 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg pointer-events-none whitespace-normal break-all leading-relaxed"
          >
            {text}
            <div
              className={`absolute top-1/2 -translate-y-1/2 border-4 border-transparent ${
                side === "right"
                  ? "right-full border-r-gray-900"
                  : "left-full border-l-gray-900"
              }`}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  usages: InventoryUsage[];
  loading: boolean;
};

function StatusBadge({ status }: { status: InventoryUsage["status"] }) {
  if (status === "con_paciente") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        Con paciente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
      Sin paciente
    </span>
  );
}

const HEADERS = [
  "Producto",
  "Registrado por",
  "Estado",
  "Cantidad",
  "Fecha",
  "Motivo",
];

function UsageSection({
  title,
  usages,
}: {
  title: string;
  usages: InventoryUsage[];
}) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            title.includes("Insumo") ? "bg-indigo-400" : "bg-purple-400"
          }`}
        />
        {title}
        <span className="ml-auto text-gray-400 font-normal normal-case tracking-normal">
          {usages.length} registros
        </span>
      </h3>

      <div className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width: "26%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "19%" }} />
            </colgroup>

            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="h-[44px]">
                {HEADERS.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-50 [&_tr]:h-[56px] [&_td]:align-middle">
              {usages.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-gray-400 italic !h-auto"
                  >
                    No hay datos para mostrar.
                  </td>
                </tr>
              ) : (
                usages.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    {/* Producto + descripción */}
                    <td className="px-4 py-0 overflow-visible max-w-0">
                      <p className="font-semibold text-gray-900 truncate text-sm leading-tight">
                        {u.product?.name ?? "—"}
                      </p>
                      {u.product?.description &&
                        (u.product.description.length > 45 ? (
                          <TooltipPortal
                            text={u.product.description}
                            side="right"
                          />
                        ) : (
                          <p className="text-xs text-gray-400 truncate leading-tight mt-0.5">
                            {u.product.description}
                          </p>
                        ))}
                    </td>

                    {/* Registrado por */}
                    <td className="px-4 py-0 overflow-hidden max-w-0">
                      <p className="text-xs text-gray-500 truncate">
                        {u.user?.name ?? "—"}
                      </p>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-0">
                      <StatusBadge status={u.status} />
                    </td>

                    {/* Cantidad */}
                    <td className="px-4 py-0 font-bold text-gray-800 tabular-nums">
                      {u.quantity} und.
                    </td>

                    {/* Fecha */}
                    <td className="px-4 py-0">
                      <p className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(u.usage_date)}
                      </p>
                    </td>

                    {/* Motivo */}
                    <td className="px-4 py-0 overflow-visible max-w-0">
                      {u.reason && u.reason.length > 30 ? (
                        <TooltipPortal text={u.reason} side="left" />
                      ) : u.reason ? (
                        <p className="text-xs text-gray-400 truncate">
                          {u.reason}
                        </p>
                      ) : (
                        <span className="italic text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function UsageTable({ usages, loading }: Props) {
  if (loading) {
    return (
      <p className="text-sm text-gray-400 italic py-8 text-center">
        Cargando consumos...
      </p>
    );
  }

  const insumos = usages.filter((u) => u.product?.type === "insumo");
  const equipos = usages.filter((u) => u.product?.type === "equipo");

  return (
    <div>
      <UsageSection title="Insumos Médicos" usages={insumos} />
      <UsageSection title="Equipos & Mobiliario" usages={equipos} />
    </div>
  );
}
