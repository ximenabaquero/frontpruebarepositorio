"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

type Props = {
  evaluationId: number;
  onClose: () => void;
  onConfirmed: () => void;
};

export default function ConfirmacionModal({ evaluationId, onClose, onConfirmed }: Props) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dataConsentAccepted, setDataConsentAccepted] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);

  const handleClose = () => {
    setTermsAccepted(false);
    setDataConsentAccepted(false);
    sigCanvasRef.current?.clear();
    onClose();
  };

  const handleConfirmar = async () => {
    if (!termsAccepted) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }
    if (!dataConsentAccepted) {
      toast.error("Debes autorizar el tratamiento de datos personales");
      return;
    }
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      toast.error("La firma es obligatoria");
      return;
    }

    const signature = sigCanvasRef.current.toDataURL("image/png");
    setIsConfirming(true);
    const token = Cookies.get("XSRF-TOKEN") ?? "";

    try {
      const res = await fetch(
        `${apiBaseUrl}/api/v1/medical-evaluations/${evaluationId}/confirmar`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": token,
          },
          body: JSON.stringify({
            terms_accepted: true,
            patient_signature: signature,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Error al confirmar");
      }
      toast.success("Valoración confirmada");
      handleClose();
      onConfirmed();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Confirmar valoración</h2>
          <button onClick={handleClose} className="rounded-full p-1.5 hover:bg-gray-100 transition">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Términos y condiciones */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
              Términos y condiciones
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600 space-y-2 max-h-44 overflow-y-auto">
              <p>
                Al confirmar esta valoración, la paciente declara que ha
                leído, comprendido y acepta el registro clínico elaborado
                por el profesional de Cold Esthetic.
              </p>
              <p>
                La paciente confirma que la información personal y clínica
                suministrada es verídica y autoriza su uso con fines
                estrictamente médicos y de seguimiento.
              </p>
              <p>
                La paciente entiende que los procedimientos descritos en
                este documento se realizarán bajo su consentimiento
                informado y que puede contactar al profesional ante
                cualquier duda o complicación posterior.
              </p>
              <p>
                Este documento tiene validez legal como constancia de
                aceptación del tratamiento y del plan de procedimientos
                acordado.
              </p>
            </div>
          </div>

          {/* Checkbox aceptar términos */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-emerald-600"
            />
            <span className="text-sm text-gray-700">
              He leído y acepto los términos y condiciones anteriores.
            </span>
          </label>

          {/* Checkbox autorización de datos personales */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dataConsentAccepted}
              onChange={(e) => setDataConsentAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-emerald-600"
            />
            <span className="text-sm text-gray-700">
              El/la paciente autoriza el tratamiento de sus datos personales
              conforme a la{" "}
              <span className="font-semibold text-gray-900">Ley 1581 de 2012</span>{" "}
              y el{" "}
              <span className="font-semibold text-gray-900">Decreto 1377 de 2013</span>{" "}
              (Protección de Datos Personales — Colombia), y ha leído y aceptado
              los términos y condiciones del servicio.{" "}
              <span className="text-red-500 font-semibold">*</span>
            </span>
          </label>
          {!dataConsentAccepted && (
            <p className="text-[10px] uppercase tracking-wider text-red-400 -mt-3 pl-7">
              Requerido para continuar
            </p>
          )}

          {/* Pad de firma */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Firma de la paciente
              </p>
              <button
                type="button"
                onClick={() => sigCanvasRef.current?.clear()}
                className="text-xs text-gray-400 hover:text-red-500 transition"
              >
                Limpiar
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
              <SignatureCanvas
                ref={sigCanvasRef}
                penColor="#1f2937"
                canvasProps={{
                  className: "w-full",
                  style: { height: "160px", width: "100%" },
                }}
                backgroundColor="rgb(249,250,251)"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Firme dentro del recuadro con el ratón o el dedo.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={isConfirming}
            className="flex items-center gap-2 px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50"
          >
            <CheckCircleIcon className="h-4 w-4" />
            {isConfirming ? "Confirmando..." : "Confirmar valoración"}
          </button>
        </div>
      </div>
    </div>
  );
}
