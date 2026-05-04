"use client";

import { useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import type { InventoryPurchase } from "../../types";
import PaginationBar from "@/components/PaginationBar";

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Tooltip portal ───────────────────────────────────────────────────────────
function TooltipPortal({
  children, // texto truncado visible en la celda
  lines, // contenido completo del cartel [título?, cuerpo]
  side = "right",
}: {
  children: React.ReactNode;
  lines: string[];
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
      className="block w-full overflow-hidden cursor-default"
    >
      {children}
      {pos &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              top: pos.top,
              transform: "translateY(-50%)",
              zIndex: 9999,
              ...(side === "right"
                ? { left: pos.x }
                : { right: `calc(100vw - ${pos.x}px)` }),
            }}
            className="w-64 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg pointer-events-none leading-relaxed"
          >
            {lines.length === 2 ? (
              <>
                <p className="font-semibold break-all">{lines[0]}</p>
                <p className="text-gray-300 mt-1 break-all">{lines[1]}</p>
              </>
            ) : (
              <p className="break-all">{lines[0]}</p>
            )}
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

const LONG = 30;

type Props = {
  purchases: InventoryPurchase[];
  isAdmin: boolean;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onNext: () => void;
  onPrev: () => void;
};

const HEADERS = [
  { label: "Producto", align: "text-left" },
  { label: "Registrado por", align: "text-left" },
  { label: "Distribuidor", align: "text-left" },
  { label: "Cant.", align: "text-right" },
  { label: "P. Unitario", align: "text-right" },
  { label: "Total", align: "text-right" },
  { label: "Fecha", align: "text-left" },
  { label: "Notas", align: "text-left" },
];

export default function PurchaseTable({
  purchases,
  isAdmin,
  loading,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onNext,
  onPrev,
}: Props) {
  if (loading)
    return (
      <p className="text-gray-500 italic text-sm py-6">Cargando compras...</p>
    );

  return (
    <div className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="min-w-full text-sm table-fixed">
        <colgroup>
          <col style={{ width: "20%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "7%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "11%" }} />
          <col style={{ width: "13%" }} />
        </colgroup>

        <thead className="bg-gray-50 border-b border-gray-100">
          <tr className="h-[44px]">
            {HEADERS.map(({ label, align }) => (
              <th
                key={label}
                className={`px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider ${align}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-50 [&_tr]:h-[56px] [&_td]:align-middle">
          {purchases.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-10 text-center text-sm text-gray-400 italic !h-auto"
              >
                No hay datos para mostrar.
              </td>
            </tr>
          ) : (
            purchases.map((p) => {
              const name = p.product?.name ?? "";
              const desc = p.product?.description ?? "";
              const notes = p.notes ?? "";
              const nameLong = name.length > LONG;
              const descLong = desc.length > LONG;

              // Líneas para el tooltip del producto:
              // siempre incluye el nombre completo si es largo,
              // siempre incluye la descripción completa si es larga.
              const productLines: string[] = [
                ...(nameLong ? [name] : []),
                ...(descLong ? [desc] : []),
              ];

              return (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  {/* ── Producto + descripción ── */}
                  <td className="px-4 py-0 overflow-visible max-w-0">
                    {/* Nombre: si es largo, él mismo es el área de hover */}
                    {nameLong ? (
                      <TooltipPortal
                        lines={productLines} // nombre + desc (si desc también larga)
                        side="right"
                      >
                        <p className="font-semibold text-gray-900 truncate text-sm leading-tight">
                          {name}
                        </p>
                      </TooltipPortal>
                    ) : (
                      <p className="font-semibold text-gray-900 truncate text-sm leading-tight">
                        {name || "—"}
                      </p>
                    )}

                    {/* Descripción: si es larga y el nombre NO era largo
                        (si el nombre era largo ya está todo en su tooltip) */}
                    {!nameLong &&
                      desc &&
                      (descLong ? (
                        <TooltipPortal lines={[desc]} side="right">
                          <p className="text-xs text-gray-400 truncate leading-tight mt-0.5">
                            {desc}
                          </p>
                        </TooltipPortal>
                      ) : (
                        <p className="text-xs text-gray-400 truncate leading-tight mt-0.5">
                          {desc}
                        </p>
                      ))}
                  </td>

                  {/* Registrado por */}
                  <td className="px-4 py-0 overflow-hidden max-w-0">
                    <p className="text-xs text-gray-500 truncate">
                      {p.user?.name ?? "—"}
                    </p>
                  </td>

                  {/* Distribuidor */}
                  <td className="px-4 py-0 overflow-hidden max-w-0">
                    {p.distributor?.name ? (
                      <span className="inline-block text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full truncate max-w-full">
                        {p.distributor.name}
                      </span>
                    ) : (
                      <span className="italic text-gray-300 text-xs">
                        Sin distribuidor
                      </span>
                    )}
                  </td>

                  {/* Cantidad */}
                  <td className="px-4 py-0 text-right text-gray-600 tabular-nums">
                    {p.quantity}
                  </td>

                  {/* Precio unitario */}
                  <td className="px-4 py-0 text-right text-gray-600 tabular-nums">
                    {formatCOP(p.unit_price)}
                  </td>

                  {/* Total */}
                  <td className="px-4 py-0 text-right font-bold text-gray-800 tabular-nums">
                    {formatCOP(p.total_price)}
                  </td>

                  {/* Fecha */}
                  <td className="px-4 py-0">
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(p.purchase_date).toLocaleDateString("es-CO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </td>

                  {/* ── Notas: siempre cartel si hay texto ── */}
                  <td className="px-4 py-0 overflow-visible max-w-0">
                    {notes ? (
                      <TooltipPortal lines={[notes]} side="left">
                        <p className="text-xs text-gray-400 truncate">
                          {notes}
                        </p>
                      </TooltipPortal>
                    ) : (
                      <span className="italic text-gray-300 text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onNext={onNext}
        onPrev={onPrev}
        isFirstPage={currentPage === 1}
        isLastPage={currentPage === totalPages}
      />
    </div>
  );
}
