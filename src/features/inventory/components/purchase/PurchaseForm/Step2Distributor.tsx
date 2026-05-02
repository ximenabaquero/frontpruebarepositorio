"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ValidatedInput from "@/components/ValidatedInput";
import PhoneInputField from "@/components/PhoneInputField";
import type { Distributor, PurchaseFormValues } from "../../../types";

interface Props {
  form: PurchaseFormValues;
  onChange: (patch: Partial<PurchaseFormValues>) => void;
  distributors: Distributor[];
}

type DistMode = "none" | "existing" | "new";

export default function Step2Distributor({
  form,
  onChange,
  distributors,
}: Props) {
  const [mode, setMode] = useState<DistMode>(() => {
    if (form.distributor_id) return "existing";
    if (form.distributor_name) return "new";
    return "none";
  });

  // Restaurar nombre del distribuidor seleccionado al volver
  const selectedDistributor = distributors.find(
    (d) => d.id === form.distributor_id,
  );
  const [search, setSearch] = useState(selectedDistributor?.name ?? "");

  useEffect(() => {
    if (form.distributor_id) {
      const d = distributors.find((d) => d.id === form.distributor_id);
      if (d) setSearch(d.name);
    }
  }, [form.distributor_id, distributors]);

  const handleMode = (m: DistMode) => {
    setMode(m);
    onChange({
      distributor_id: null,
      distributor_name: "",
      distributor_cellphone: "",
      distributor_email: "",
    });
    setSearch("");
  };

  const handleSelect = (d: Distributor) => {
    onChange({ distributor_id: d.id });
    setSearch(d.name);
  };

  const filtered = distributors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const showDropdown = search.length > 0 && !form.distributor_id;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          ¿Esta compra tiene distribuidor?
        </p>
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          {(
            [
              { key: "none", label: "Sin distribuidor" },
              { key: "existing", label: "Seleccionar" },
              { key: "new", label: "Crear nuevo" },
            ] as { key: DistMode; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleMode(key)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === key
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === "none" && (
        <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            La compra se registrará sin distribuidor.
          </p>
        </div>
      )}

      {mode === "existing" && (
        <div className="space-y-3">
          {/* Distribuidor ya seleccionado — siempre visible al volver */}
          {form.distributor_id ? (
            <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-indigo-800">
                  {search}
                </p>
                {selectedDistributor?.cellphone && (
                  <p className="text-xs text-indigo-500">
                    {selectedDistributor.cellphone}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  onChange({ distributor_id: null });
                  setSearch("");
                }}
                className="text-xs text-indigo-400 hover:text-indigo-600 underline"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar distribuidor..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    onChange({ distributor_id: null });
                  }}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              {showDropdown && (
                <div className="border border-gray-100 rounded-xl shadow-sm overflow-hidden max-h-44 overflow-y-auto">
                  {filtered.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400 italic">
                      Sin resultados.
                    </p>
                  ) : (
                    filtered.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleSelect(d)}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-indigo-50 border-b border-gray-50 last:border-0"
                      >
                        <p className="font-medium text-gray-900">{d.name}</p>
                        {d.cellphone && (
                          <p className="text-xs text-gray-400">{d.cellphone}</p>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {mode === "new" && (
        <div className="space-y-4">
          <ValidatedInput
            id="dist-name"
            label="Nombre del distribuidor"
            placeholder="Ej: MediSupply SA"
            maxLength={100}
            required
            value={form.distributor_name}
            onChange={(v) => onChange({ distributor_name: v })}
          />
          <PhoneInputField
            label="Celular"
            variant="modal"
            value={form.distributor_cellphone}
            onChange={(v) => onChange({ distributor_cellphone: v })}
          />
          <ValidatedInput
            id="dist-email"
            label="Correo electrónico"
            placeholder="correo@ejemplo.com"
            type="email"
            maxLength={100}
            value={form.distributor_email}
            onChange={(v) => onChange({ distributor_email: v })}
          />
        </div>
      )}
    </div>
  );
}
