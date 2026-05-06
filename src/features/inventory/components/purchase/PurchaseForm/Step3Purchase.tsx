"use client";

import ValidatedInput from "@/components/ValidatedInput";
import type { PurchaseFormValues } from "../../../types";

interface Props {
  form: PurchaseFormValues;
  onChange: (patch: Partial<PurchaseFormValues>) => void;
}

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Step3Purchase({ form, onChange }: Props) {
  const qty = Number(form.quantity) || 0;
  const price = Number(form.unit_price) || 0;
  const total = qty * price;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <ValidatedInput
          id="qty"
          label="Cantidad"
          placeholder="Ej: 10"
          type="number"
          min={1}
          required
          value={form.quantity}
          onChange={(v) => onChange({ quantity: v === "" ? "" : Number(v) })}
          clampToMin
        />
        <ValidatedInput
          id="price"
          label="Precio unitario (COP)"
          placeholder="Ej: 15000"
          type="number"
          min={0}
          required
          value={form.unit_price}
          onChange={(v) => onChange({ unit_price: v === "" ? "" : Number(v) })}
          clampToMin
        />
      </div>

      {/* Total calculado */}
      {total > 0 && (
        <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <span className="text-sm font-medium text-indigo-700">
            Total calculado
          </span>
          <span className="text-lg font-bold text-indigo-900 tabular-nums">
            {formatCOP(total)}
          </span>
        </div>
      )}

      {/* Notas */}
      <ValidatedInput
        id="notes"
        label="Notas (opcional)"
        as="textarea"
        rows={3}
        value={form.notes}
        onChange={(val) => onChange({ notes: val })}
        maxLength={500}
        placeholder="Observaciones sobre la compra..."
      />
    </div>
  );
}
