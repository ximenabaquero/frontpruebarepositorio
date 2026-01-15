import { PROCEDURE_GROUPS, PROCEDURES } from "../data/procedures";

type ProceduresSelectorProps = {
  selectedProcedures: Record<string, boolean>;
  procedurePrices: Record<string, string>;
  setSelectedProcedures: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setProcedurePrices: React.Dispatch<React.SetStateAction<Record<string, string>>>;

  piernaInterna: boolean;
  piernaExterna: boolean;
  setPiernaInterna: (value: boolean) => void;
  setPiernaExterna: (value: boolean) => void;

  fajaTalla: string;
  setFajaTalla: (value: string) => void;

  selectedCount: number;
  proceduresTotalCop: string;
  formatCop: (amount: number) => string;

  clearSubmitError: () => void;
  makePriceChangeHandler: (procedureId: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ProceduresSelector({
  selectedProcedures,
  procedurePrices,
  setSelectedProcedures,
  setProcedurePrices,
  piernaInterna,
  piernaExterna,
  setPiernaInterna,
  setPiernaExterna,
  fajaTalla,
  setFajaTalla,
  selectedCount,
  proceduresTotalCop,
  formatCop,
  clearSubmitError,
  makePriceChangeHandler,
}: ProceduresSelectorProps) {
  const piernaZoneSelected = piernaInterna || piernaExterna;

  return (
    <fieldset className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
      <legend className="px-2 text-sm font-semibold text-emerald-900">Procedimientos</legend>
      <p className="mt-1 text-xs text-gray-500">
        Marca el procedimiento y se habilitarán los campos necesarios. Precio en COP.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4">
        {PROCEDURE_GROUPS.map((group) => {
          const groupSelectedCount = group.procedureIds.filter((id) => Boolean(selectedProcedures[id]))
            .length;

          return (
            <details
              key={group.id}
              open={group.defaultOpen}
              className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
            >
              <summary className="cursor-pointer list-none px-4 py-3 hover:bg-emerald-50/60">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-gray-900">{group.label}</div>
                  <div className="text-xs text-gray-500">
                    {groupSelectedCount > 0 ? `${groupSelectedCount} seleccionado(s)` : "Ninguno"}
                  </div>
                </div>
              </summary>

              <div className="px-4 pb-4">
                <div className="hidden sm:grid sm:grid-cols-[28px_1fr_260px_220px] gap-3 border-y border-gray-100 py-2 text-xs font-semibold text-gray-500">
                  <div />
                  <div>Procedimiento</div>
                  <div>Detalles</div>
                  <div>Precio (COP)</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {group.procedureIds.map((procedureId) => {
                    const procedure = PROCEDURES.find((p) => p.id === procedureId);
                    if (!procedure) return null;

                    const checked = Boolean(selectedProcedures[procedure.id]);
                    const priceValue = procedurePrices[procedure.id] ?? "";

                    const isPierna = procedure.id === "pierna";
                    const isFaja = procedure.id === "faja_postoperatoria";
                    const piernaPriceDisabled = isPierna && checked && !piernaZoneSelected;

                    return (
                      <div
                        key={procedure.id}
                        className="grid grid-cols-1 sm:grid-cols-[28px_1fr_260px_220px] gap-3 py-3"
                      >
                        <div className="pt-1">
                          <input
                            id={`proc_${procedure.id}`}
                            type="checkbox"
                            name="procedures[]"
                            value={procedure.id}
                            checked={checked}
                            onChange={(e) => {
                              clearSubmitError();
                              const nextChecked = e.target.checked;

                              setSelectedProcedures((prev) => ({
                                ...prev,
                                [procedure.id]: nextChecked,
                              }));

                              if (!nextChecked) {
                                setProcedurePrices((prev) => ({
                                  ...prev,
                                  [procedure.id]: "",
                                }));

                                if (procedure.id === "pierna") {
                                  setPiernaInterna(false);
                                  setPiernaExterna(false);
                                }
                                if (procedure.id === "faja_postoperatoria") {
                                  setFajaTalla("");
                                }
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500/30"
                          />
                        </div>

                        <label
                          htmlFor={`proc_${procedure.id}`}
                          className={`text-sm font-medium ${checked ? "text-gray-900" : "text-gray-700"}`}
                        >
                          {procedure.label}
                        </label>

                        <div>
                          {!checked ? (
                            <div className="text-sm text-gray-400">—</div>
                          ) : isPierna ? (
                            <div className="flex flex-wrap items-center gap-4">
                              <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={piernaInterna}
                                  onChange={(e) => {
                                    clearSubmitError();
                                    setPiernaInterna(e.target.checked);
                                    if (!e.target.checked && !piernaExterna) {
                                      setProcedurePrices((prev) => ({
                                        ...prev,
                                        pierna: "",
                                      }));
                                    }
                                  }}
                                  name="procedure_meta[pierna][interna]"
                                  value="1"
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                                Interna
                              </label>

                              <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={piernaExterna}
                                  onChange={(e) => {
                                    clearSubmitError();
                                    setPiernaExterna(e.target.checked);
                                    if (!e.target.checked && !piernaInterna) {
                                      setProcedurePrices((prev) => ({
                                        ...prev,
                                        pierna: "",
                                      }));
                                    }
                                  }}
                                  name="procedure_meta[pierna][externa]"
                                  value="1"
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                                Externa
                              </label>

                              <input type="hidden" name="procedure_label[pierna]" value={procedure.label} />
                            </div>
                          ) : isFaja ? (
                            <div>
                              <label
                                htmlFor="procedure_talla_faja_postoperatoria"
                                className="block text-xs font-medium text-gray-600"
                              >
                                Talla
                              </label>
                              <input
                                id="procedure_talla_faja_postoperatoria"
                                name="procedure_meta[faja_postoperatoria][talla]"
                                required={checked}
                                value={fajaTalla}
                                onChange={(e) => {
                                  clearSubmitError();
                                  setFajaTalla(e.target.value);
                                }}
                                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
                                placeholder="Ej. S / M / L / XL"
                              />

                              <input
                                type="hidden"
                                name="procedure_label[faja_postoperatoria]"
                                value={procedure.label}
                              />
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">—</div>
                          )}
                        </div>

                        <div>
                          {!checked ? (
                            <div className="text-sm text-gray-400">—</div>
                          ) : isPierna ? (
                            <div>
                              <input
                                id="procedure_price_pierna"
                                name="procedure_price[pierna]"
                                inputMode="decimal"
                                disabled={piernaPriceDisabled}
                                required={checked && piernaZoneSelected}
                                value={priceValue}
                                onChange={makePriceChangeHandler("pierna")}
                                className={`w-full rounded-xl border px-3 py-2 text-sm text-gray-900 ${
                                  piernaPriceDisabled
                                    ? "border-gray-100 bg-gray-50 text-gray-400"
                                    : "border-gray-200 bg-white shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                }`}
                                placeholder={
                                  piernaPriceDisabled ? "Selecciona Interna/Externa" : "Ej. 150.000"
                                }
                              />
                              {!piernaZoneSelected ? (
                                <div className="mt-1 text-xs text-gray-500">Selecciona Interna y/o Externa.</div>
                              ) : null}
                            </div>
                          ) : isFaja ? (
                            <input
                              id="procedure_price_faja_postoperatoria"
                              name="procedure_price[faja_postoperatoria]"
                              inputMode="decimal"
                              required={checked}
                              value={priceValue}
                              onChange={makePriceChangeHandler("faja_postoperatoria")}
                              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              placeholder="Ej. 150.000"
                            />
                          ) : (
                            <div>
                              <input
                                id={`procedure_price_${procedure.id}`}
                                name={`procedure_price[${procedure.id}]`}
                                inputMode="decimal"
                                required={checked}
                                value={priceValue}
                                onChange={makePriceChangeHandler(procedure.id)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                placeholder="Ej. 150.000"
                              />

                              <input
                                type="hidden"
                                name={`procedure_label[${procedure.id}]`}
                                value={procedure.label}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </details>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            Seleccionados: <span className="font-semibold">{selectedCount}</span>
          </div>
          <div>
            Total (COP): <span className="font-semibold">{proceduresTotalCop || formatCop(0)}</span>
          </div>
        </div>
      </div>
    </fieldset>
  );
}
