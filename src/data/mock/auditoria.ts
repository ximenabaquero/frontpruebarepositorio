export type EstadoAuditoria = "auditado" | "en_revision" | "irregularidad";

export type CuentaRadicada = {
  id: number;
  prestador: string;
  tipo: string;
  servicios: number;
  monto: number;
  fecha_radicacion: string;
  estado: EstadoAuditoria;
  score: number;
};

export type KpiAuditoria = {
  pct_verificados: number;
  fraudes_detectados: number;
  siniestralidad_mes: number;
  score_promedio: number;
};

export type SiniestroMes = {
  mes: string;
  siniestralidad: number;
  presupuesto: number;
};

export const kpisAuditoria: KpiAuditoria = {
  pct_verificados: 94,
  fraudes_detectados: 3,
  siniestralidad_mes: 247,
  score_promedio: 4.7,
};

export const cuentasRadicadas: CuentaRadicada[] = [
  { id: 1, prestador: "Clínica HomeCare S.A.S.", tipo: "Enfermería domiciliaria", servicios: 142, monto: 68400000, fecha_radicacion: "2026-05-05", estado: "auditado", score: 4.9 },
  { id: 2, prestador: "FisioVida Ltda.", tipo: "Fisioterapia domiciliaria", servicios: 87, monto: 34800000, fecha_radicacion: "2026-05-06", estado: "auditado", score: 4.8 },
  { id: 3, prestador: "MediHome Colombia", tipo: "Medicina domiciliaria", servicios: 54, monto: 27000000, fecha_radicacion: "2026-05-07", estado: "en_revision", score: 4.2 },
  { id: 4, prestador: "CuracionesPro", tipo: "Curación heridas", servicios: 38, monto: 11400000, fecha_radicacion: "2026-05-04", estado: "auditado", score: 4.7 },
  { id: 5, prestador: "RehabTotal S.A.", tipo: "Rehabilitación neurológica", servicios: 29, monto: 29000000, fecha_radicacion: "2026-05-08", estado: "auditado", score: 4.6 },
  { id: 6, prestador: "InfusionesMed", tipo: "Infusiones IV domiciliarias", servicios: 22, monto: 33000000, fecha_radicacion: "2026-05-03", estado: "irregularidad", score: 2.1 },
  { id: 7, prestador: "OxigenoHogar", tipo: "Oxigenoterapia domiciliaria", servicios: 47, monto: 14100000, fecha_radicacion: "2026-05-05", estado: "en_revision", score: 3.8 },
  { id: 8, prestador: "FonoRehab", tipo: "Fonoaudiología domiciliaria", servicios: 18, monto: 9000000, fecha_radicacion: "2026-05-06", estado: "auditado", score: 4.9 },
];

export const siniestralidad: SiniestroMes[] = [
  { mes: "Dic", siniestralidad: 198, presupuesto: 280 },
  { mes: "Ene", siniestralidad: 215, presupuesto: 290 },
  { mes: "Feb", siniestralidad: 204, presupuesto: 285 },
  { mes: "Mar", siniestralidad: 232, presupuesto: 295 },
  { mes: "Abr", siniestralidad: 241, presupuesto: 300 },
  { mes: "May", siniestralidad: 247, presupuesto: 310 },
];
