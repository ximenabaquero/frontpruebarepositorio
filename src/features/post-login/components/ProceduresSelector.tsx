import { PROCEDURE_GROUPS, PROCEDURES } from "../data/procedures";

type ProcedureItem = {
  item_name: string;
  price: string;
};

type ProceduresSelectorProps = {
  procedureItems: ProcedureItem[];
  setProcedureItems: React.Dispatch<React.SetStateAction<ProcedureItem[]>>;
  procedureNotes: string;
  setProcedureNotes: React.Dispatch<React.SetStateAction<string>>;
  clearSubmitError: () => void;
  procedurePrices: Record<string, string>;
  handlePriceChange: (
    itemName: string,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ProceduresSelector({
  procedureItems,
  setProcedureItems,
  procedureNotes,
  setProcedureNotes,
  clearSubmitError,
  procedurePrices,
  handlePriceChange,
}: ProceduresSelectorProps) {
  const isSelected = (label: string) =>
    procedureItems.some((item) => item.item_name === label);

  const getPrice = (label: string) =>
    procedureItems.find((item) => item.item_name === label)?.price ?? "";

  const updatePrice = (label: string, raw: string) => {
    setProcedureItems((prev) =>
      prev.map((item) =>
        item.item_name === label ? { ...item, price: raw } : item,
      ),
    );
  };

  const toggleItem = (label: string) => {
    clearSubmitError();

    if (isSelected(label)) {
      setProcedureItems((prev) =>
        prev.filter((item) => item.item_name !== label),
      );

      // limpiar notas automáticas
      if (label.includes("Faja")) {
        setProcedureNotes((prev) =>
          prev.replace(/Faja talla:.*(\n)?/, "").trim(),
        );
      }
      if (label.includes("Pierna")) {
        setProcedureNotes((prev) => prev.replace(/Pierna:.*(\n)?/, "").trim());
      }
    } else {
      setProcedureItems((prev) => [...prev, { item_name: label, price: "" }]);
    }
  };

  const handleFajaChange = (value: string) => {
    setProcedureNotes((prev) => {
      const clean = prev.replace(/Faja talla:.*(\n)?/, "");
      return `${clean}\nFaja talla: ${value}`.trim();
    });
  };

  const handlePiernaChange = (interna: boolean, externa: boolean) => {
    let note = "";
    if (interna && externa) note = "Pierna: interna y externa";
    else if (interna) note = "Pierna: interna";
    else if (externa) note = "Pierna: externa";

    setProcedureNotes((prev) => {
      const clean = prev.replace(/Pierna:.*(\n)?/, "");
      return note ? `${clean}\n${note}`.trim() : clean.trim();
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {PROCEDURE_GROUPS.map((group) => (
          <details
            key={group.id}
            open={false}
            className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
          >
            <summary className="cursor-pointer list-none px-4 py-3 bg-emerald-50/50 hover:bg-emerald-50 rounded-t-2xl transition-colors">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-gray-900">
                  {group.label}
                </div>
              </div>
            </summary>

            <div className="px-4 pb-4">
              {/* Encabezado de columnas */}
              <div className="hidden sm:grid sm:grid-cols-[28px_1fr_260px_220px] gap-3 border-y border-gray-100 py-2 text-xs font-semibold text-gray-500">
                <div />
                <div>Procedimiento</div>
                <div>Detalles</div>
                <div>Precio (COP)</div>
              </div>

              <div className="divide-y divide-gray-100">
                {group.procedureIds.map((procedureId) => {
                  const procedure = PROCEDURES.find(
                    (p) => p.id === procedureId,
                  );
                  if (!procedure) return null;

                  const checked = isSelected(procedure.label);
                  const priceValue = getPrice(procedure.label);

                  const isFaja = procedure.id === "faja_postoperatoria";
                  const isPierna = procedure.id === "pierna";

                  // detectar detalles seleccionados
                  const fajaDetalle = procedureNotes.includes("Faja talla:");
                  const piernaInterna =
                    procedureNotes.includes("Pierna: interna");
                  const piernaExterna =
                    procedureNotes.includes("Pierna: externa");
                  const piernaAmbas =
                    procedureNotes.includes("interna y externa");

                  const piernaDetalle =
                    piernaInterna || piernaExterna || piernaAmbas;

                  const disablePrice =
                    (isFaja && !fajaDetalle) || (isPierna && !piernaDetalle);

                  return (
                    <div
                      key={procedure.id}
                      className="grid grid-cols-1 sm:grid-cols-[28px_1fr_260px_220px] gap-3 py-3"
                    >
                      {/* Checkbox */}
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleItem(procedure.label)}
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500/30"
                        />
                      </div>

                      {/* Nombre */}
                      <label
                        className={`text-sm font-medium ${
                          checked ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {procedure.label}
                      </label>

                      {/* DETALLES */}
                      {checked ? (
                        <>
                          {isFaja ? (
                            <input
                              type="text"
                              onChange={(e) => handleFajaChange(e.target.value)}
                              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
                              placeholder="Talla (Ej. S / M / L)"
                            />
                          ) : isPierna ? (
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={piernaInterna || piernaAmbas}
                                  onChange={(e) =>
                                    handlePiernaChange(
                                      e.target.checked,
                                      piernaExterna,
                                    )
                                  }
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                                Interna
                              </label>

                              <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={piernaExterna || piernaAmbas}
                                  onChange={(e) =>
                                    handlePiernaChange(
                                      piernaInterna,
                                      e.target.checked,
                                    )
                                  }
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                                Externa
                              </label>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">—</div>
                          )}
                        </>
                      ) : (
                        <div className="text-sm text-gray-400">—</div>
                      )}

                      {/* PRECIO */}
                      {checked ? (
                        <input
                          type="text"
                          value={procedurePrices[procedure.label] || ""}
                          onChange={handlePriceChange(procedure.label)}
                          disabled={disablePrice}
                          className={`rounded-xl border px-3 py-2 text-sm ${
                            disablePrice
                              ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white border-gray-200 text-gray-900"
                          }`}
                          placeholder="Precio en COP"
                        />
                      ) : (
                        <div className="text-sm text-gray-400">—</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
