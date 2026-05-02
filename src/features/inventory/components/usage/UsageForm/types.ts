import type { InventoryProduct } from "../../../types";

export type UsageMode = "con_paciente" | "sin_paciente";

export type UsageFormProps = {
  products: InventoryProduct[];
  mode: UsageMode;
  medicalEvaluationId?: number; // solo cuando mode === "con_paciente"
  onClose: () => void;
  onSaved: () => void;
};
