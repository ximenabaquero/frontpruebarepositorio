"use client";

import useSWR from "swr";
import { endpoints } from "../services/StatsService";

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  })
    .then((res) => res.json())
    .then((json) => json.data || {});

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

const CX = 130,
  CY = 130,
  STROKE = 24,
  GAP_DEG = 3,
  START = 180,
  TOTAL_DEG = 180;

const RINGS_CONFIG = [
  { r: 95, label: "Confirmados", colorStart: "#10b981", colorEnd: "#34d399" },
  { r: 68, label: "En espera", colorStart: "#f59e0b", colorEnd: "#fbbf24" },
  { r: 41, label: "Cancelados", colorStart: "#ef4444", colorEnd: "#f87171" },
];

export default function ConversionRateCard() {
  const { data, error, isLoading } = useSWR(endpoints.conversionRate, fetcher);

  const confirmed = data?.confirmed ?? 0;
  const canceled = data?.canceled ?? 0;
  const pending = data?.pending ?? 0;
  const total = data?.total ?? 0;

  const pctRound = (v: number) =>
    total > 0 ? Math.round((v / total) * 100) : 0;
  const pctExact = (v: number) => (total > 0 ? (v / total) * 100 : 0);

  const values = [confirmed, pending, canceled];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Estado de Evaluaciones
          </h2>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">
            Registros clínicos del periodo actual
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
            Total
          </p>
          <p className="text-2xl font-bold text-gray-900 leading-tight">
            {total}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-40 flex items-center justify-center">
          <p className="text-sm text-gray-400 italic">Cargando...</p>
        </div>
      ) : error || !data ? (
        <div className="h-40 flex items-center justify-center">
          <p className="text-sm text-red-400">Error al cargar.</p>
        </div>
      ) : (
        <>
          {/* Gauge */}
          <div className="relative overflow-hidden" style={{ height: 139 }}>
            <svg
              width={260}
              height={260}
              viewBox="0 0 260 260"
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <defs>
                {RINGS_CONFIG.map((rc, i) => (
                  <linearGradient
                    key={rc.label}
                    id={`g${i}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={rc.colorStart} />
                    <stop offset="100%" stopColor={rc.colorEnd} />
                  </linearGradient>
                ))}
              </defs>

              {RINGS_CONFIG.map((rc, i) => {
                const pct = pctExact(values[i]);
                const sweep = (pct / 100) * (TOTAL_DEG - GAP_DEG * 2);
                const startD = START + GAP_DEG;
                const endD = startD + sweep;

                return (
                  <g key={rc.label}>
                    <path
                      d={describeArc(
                        CX,
                        CY,
                        rc.r,
                        START + GAP_DEG,
                        START + TOTAL_DEG - GAP_DEG,
                      )}
                      fill="none"
                      stroke="#f0f0f5"
                      strokeWidth={STROKE}
                      strokeLinecap="round"
                    />
                    {pct > 0 && (
                      <path
                        d={describeArc(
                          CX,
                          CY,
                          rc.r,
                          startD,
                          Math.max(endD, startD + 2),
                        )}
                        fill="none"
                        stroke={`url(#g${i})`}
                        strokeWidth={STROKE}
                        strokeLinecap="round"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Leyenda con valores */}
          <div className="mt-3 space-y-1">
            {RINGS_CONFIG.map((rc, i) => (
              <div key={rc.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: rc.colorStart }}
                  />
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                    {rc.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    {values[i]}
                  </span>
                  <span className="text-xs text-gray-400 w-9 text-right">
                    {pctRound(values[i])}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
