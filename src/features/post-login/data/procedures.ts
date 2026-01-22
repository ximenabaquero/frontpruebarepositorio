export type ProcedureOption = {
  id: string;
  label: string;
};

export type ProcedureGroup = {
  id: string;
  label: string;
  defaultOpen?: boolean;
  procedureIds: string[];
};

export const PROCEDURES: ProcedureOption[] = [
  { id: "abdomen_completo", label: "Abdomen completo" },
  { id: "laterales", label: "Laterales" },
  { id: "cintura", label: "Cintura" },
  { id: "espalda_completa", label: "Espalda completa" },
  { id: "coxis", label: "Coxis" },
  { id: "brazos", label: "Brazos" },
  { id: "papada", label: "Papada" },
  { id: "pierna", label: "Pierna" },
  { id: "criolipolisis", label: "Criolipólisis" },
  { id: "radiofrecuencia", label: "Radiofrecuencia" },
  { id: "cavitacion", label: "Cavitación" },
  { id: "hifu", label: "HIFU" },
  { id: "laser_basico", label: "Láser básico" },
  { id: "laser_infrarrojo", label: "Láser infrarrojo" },
  { id: "laser", label: "Láser" },
  { id: "laser_diodo", label: "Láser diodo" },
  { id: "lipoinyeccion", label: "Lipoinyección" },
  { id: "faja_postoperatoria", label: "Faja postoperatoria" },
  { id: "medicamentos", label: "Medicamentos" },
  { id: "drenaje", label: "Drenaje linfático" },
  { id: "masaje", label: "Masaje postoperatorio" },
  { id: "espuma_reafirmante", label: "Espuma reafirmante" },
  { id: "examenes", label: "Exámenes" },
  { id: "controles", label: "Controles" },
];

export const PROCEDURE_GROUPS: ProcedureGroup[] = [
  {
    id: "zonas",
    label: "Zonas",
    defaultOpen: true,
    procedureIds: [
      "abdomen_completo",
      "laterales",
      "cintura",
      "espalda_completa",
      "coxis",
      "brazos",
      "papada",
      "pierna",
    ],
  },
  {
    id: "laser",
    label: "Láser",
    defaultOpen: true,
    procedureIds: ["laser_basico", "laser_infrarrojo", "laser", "laser_diodo"],
  },
  {
    id: "postop",
    label: "Post-operatorio",
    defaultOpen: true,
    procedureIds: [
      "faja_postoperatoria",
      "drenaje",
      "masaje",
      "espuma_reafirmante",
    ],
  },
  {
    id: "otros",
    label: "Otros",
    defaultOpen: false,
    procedureIds: [
      "criolipolisis",
      "radiofrecuencia",
      "cavitacion",
      "hifu",
      "lipoinyeccion",
      "medicamentos",
      "examenes",
      "controles",
    ],
  },
];
