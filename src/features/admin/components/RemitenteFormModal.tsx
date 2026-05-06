"use client";

import { useState } from "react";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import type { Remitente } from "../types";
import ValidatedInput from "@/components/ValidatedInput";
import PhoneInputField from "@/components/PhoneInputField";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

type FormData = {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: string;
  password: string;
  password_confirmation: string;
};

type Props = {
  remitente: Remitente | null;
  onClose: () => void;
  onSaved: () => void;
};

const PASSWORD_RULES = [
  { label: "Mínimo 8 caracteres",         test: (p: string) => p.length >= 8 },
  { label: "Al menos una mayúscula",       test: (p: string) => /[A-Z]/.test(p) },
  { label: "Al menos una minúscula",       test: (p: string) => /[a-z]/.test(p) },
  { label: "Al menos un número",           test: (p: string) => /[0-9]/.test(p) },
  { label: "Al menos un carácter especial",test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function RemitenteFormModal({ remitente, onClose, onSaved }: Props) {
  const editingId = remitente?.id ?? null;

  const [form, setForm] = useState<FormData>(() =>
    remitente
      ? { name: remitente.name, first_name: remitente.first_name, last_name: remitente.last_name, email: remitente.email, cellphone: remitente.cellphone, password: "", password_confirmation: "" }
      : { name: "", first_name: "", last_name: "", email: "", cellphone: "", password: "", password_confirmation: "" },
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const setField = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const passwordTouched = form.password.length > 0;
  const allRulesMet = passwordTouched && PASSWORD_RULES.every((r) => r.test(form.password));
  const confirmMismatch = form.password_confirmation.length > 0 && form.password !== form.password_confirmation;

  const handleSave = async () => {
    if (!form.name || !form.first_name || !form.last_name || !form.email || !form.cellphone) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    if (!editingId && !form.password) {
      toast.error("La contraseña es obligatoria para nuevos remitentes");
      return;
    }
    if (form.password && !allRulesMet) {
      toast.error("La contraseña no cumple los requisitos de seguridad");
      return;
    }
    if (form.password && form.password !== form.password_confirmation) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsSaving(true);
    const token = Cookies.get("XSRF-TOKEN") ?? "";

    const body: Partial<FormData> = { ...form };
    if (!body.password) {
      delete body.password;
      delete body.password_confirmation;
    }

    try {
      const url = editingId
        ? `${apiBaseUrl}/api/v1/remitentes/${editingId}`
        : `${apiBaseUrl}/api/v1/remitentes`;
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { message?: string; errors?: Record<string, string[]> };
        if (err.errors) {
          const mapped: Record<string, string> = {};
          for (const [field, msgs] of Object.entries(err.errors)) {
            mapped[field] = msgs[0] ?? "";
          }
          setFieldErrors(mapped);
        }
        toast.error(err.message ?? "Revisa los campos del formulario");
        return;
      }

      toast.success(editingId ? "Remitente actualizado" : "Remitente creado");
      onSaved();
      onClose();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            {editingId ? "Editar remitente" : "Nuevo remitente"}
          </h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100 transition">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ValidatedInput
                id="first_name"
                label="Nombre *"
                type="text"
                value={form.first_name}
                onChange={(val) => setField("first_name", val)}
                maxLength={100}
                required
                placeholder="Nombre"
              />
              {fieldErrors.first_name && <p className="mt-1 text-xs text-red-500">{fieldErrors.first_name}</p>}
            </div>
            <div>
              <ValidatedInput
                id="last_name"
                label="Apellido *"
                type="text"
                value={form.last_name}
                onChange={(val) => setField("last_name", val)}
                maxLength={100}
                required
                placeholder="Apellido"
              />
              {fieldErrors.last_name && <p className="mt-1 text-xs text-red-500">{fieldErrors.last_name}</p>}
            </div>
          </div>

          <div>
            <ValidatedInput
              id="name"
              label="Nombre de usuario *"
              type="text"
              value={form.name}
              onChange={(val) => setField("name", val)}
              maxLength={50}
              required
              placeholder="usuario_unico"
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <ValidatedInput
                id="email"
                label="Email *"
                type="email"
                value={form.email}
                onChange={(val) => setField("email", val)}
                maxLength={150}
                required
                placeholder="correo@ejemplo.com"
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
            </div>
            <div>
              <PhoneInputField
                label="Celular *"
                value={form.cellphone}
                onChange={(val) => setField("cellphone", val)}
                variant="modal"
              />
              {fieldErrors.cellphone && <p className="mt-1 text-xs text-red-500">{fieldErrors.cellphone}</p>}
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <ValidatedInput
              id="password"
              label={`Contraseña ${editingId ? "(dejar vacío para no cambiar)" : "*"}`}
              type="password"
              value={form.password}
              onChange={(val) => setField("password", val)}
              maxLength={128}
              showToggle
              placeholder="Mínimo 8 caracteres"
            />
            {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}

            {/* Checklist de requisitos */}
            {passwordTouched && (
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
                {PASSWORD_RULES.map((rule) => {
                  const ok = rule.test(form.password);
                  return (
                    <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-emerald-600" : "text-gray-400"}`}>
                      <CheckCircleSolid className={`h-3.5 w-3.5 shrink-0 ${ok ? "text-emerald-500" : "text-gray-200"}`} />
                      {rule.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirmación de contraseña */}
          {(form.password.length > 0 || (!editingId)) && (
            <div>
              <ValidatedInput
                id="password_confirmation"
                label={`Confirmar contraseña ${!editingId ? "*" : ""}`}
                type="password"
                value={form.password_confirmation}
                onChange={(val) => setField("password_confirmation", val)}
                maxLength={128}
                showToggle
                placeholder="Repite la contraseña"
              />
              {confirmMismatch && <p className="mt-1 text-xs text-red-500">Las contraseñas no coinciden</p>}
              {!confirmMismatch && form.password_confirmation.length > 0 && (
                <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircleIcon className="h-3.5 w-3.5" /> Las contraseñas coinciden
                </p>
              )}
              {fieldErrors.password_confirmation && <p className="mt-1 text-xs text-red-500">{fieldErrors.password_confirmation}</p>}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={isSaving} className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50">
            {isSaving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear remitente"}
          </button>
        </div>
      </div>
    </div>
  );
}
