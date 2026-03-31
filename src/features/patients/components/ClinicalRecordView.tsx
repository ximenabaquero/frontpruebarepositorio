import { forwardRef } from "react";
import Image from "next/image";
import { CheckBadgeIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import type { Procedure, EvaluationData } from "../types";

type Props = {
  evaluation: EvaluationData;
  currentYear: number;
  isConfirmed: boolean;
  status?: "EN_ESPERA" | "CONFIRMADO" | "CANCELADO";
  onEditEval: () => void;
  onEditProc: (proc: Procedure) => void;
};

const ClinicalRecordView = forwardRef<HTMLDivElement, Props>(
  ({ evaluation, currentYear, isConfirmed, status = "EN_ESPERA", onEditEval, onEditProc }, ref) => {
    const { patient, procedures } = evaluation;

    const procedureDate = procedures?.[0]?.procedure_date ?? evaluation.created_at;
    const formattedDate = procedureDate
      ? (() => {
          const f = new Date(procedureDate).toLocaleString("es-ES", {
            dateStyle: "medium",
            timeStyle: "short",
          });
          return f.charAt(0).toUpperCase() + f.slice(1);
        })()
      : "";

    // Configuración de estados
    const getStatusConfig = (currentStatus: string) => {
      const configs = {
        EN_ESPERA: {
          label: "En espera",
          icon: ClockIcon,
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-700",
          iconColor: "text-yellow-500",
          description: "Este registro está pendiente de confirmación"
        },
        CONFIRMADO: {
          label: "Confirmado",
          icon: CheckCircleIcon,
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          textColor: "text-emerald-700",
          iconColor: "text-emerald-500",
          description: "Este registro ha sido confirmado y aprobado"
        },
        CANCELADO: {
          label: "Cancelado",
          icon: XCircleIcon,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-700",
          iconColor: "text-red-500",
          description: "Este registro ha sido cancelado"
        }
      };
      return configs[currentStatus as keyof typeof configs] || configs.EN_ESPERA;
    };

    const currentStatus = getStatusConfig(status);
    const StatusIcon = currentStatus.icon;

    return (
      <div
        ref={ref}
        className="max-w-5xl mx-auto bg-white border border-gray-100 shadow-md rounded-2xl"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start px-4 sm:px-8 py-6 bg-white rounded-t-2xl gap-4">
          <div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 p-[2px] shadow-sm">
                <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <Image
                    src="/coldestheticlogo.png"
                    alt="Coldesthetic"
                    width={32}
                    height={32}
                    className="h-full w-full object-contain"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
                {evaluation.user?.brand_name}
              </h1>
            </div>
            <p className="ml-12 text-[10px] uppercase tracking-wider text-gray-400">
              Realiza tus suenos de una forma segura
            </p>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-end gap-6 text-[13px] text-gray-700">
            <div className="flex flex-col items-start">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Remitente</p>
              <div className="flex items-center gap-1">
                <CheckBadgeIcon className="w-4 h-4 text-emerald-500" />
                <span className="font-medium">{evaluation.referrer_name}</span>
              </div>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex flex-col items-start">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Fecha</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-1 mb-3" />

        <div className="px-4 sm:px-8 py-6 space-y-10">
          {/* Estado del registro */}
          <section>
            <div className={`flex flex-wrap items-center gap-3 rounded-xl border ${currentStatus.borderColor} ${currentStatus.bgColor} px-4 py-3`}>
              <StatusIcon className={`h-5 w-5 shrink-0 ${currentStatus.iconColor}`} />
              <span className={`text-sm font-bold ${currentStatus.textColor}`}>
                {currentStatus.label}
              </span>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <span className="text-xs text-gray-500">
                {patient.first_name} {patient.last_name}
              </span>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
          </section>

          {/* Datos personales */
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-5 w-1 bg-emerald-500 rounded-full" />
              <h3 className="text-lg font-semibold text-gray-800 tracking-tight">Datos personales</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 rounded-xl border border-gray-200 bg-white p-4 text-sm">
              {[
                { label: "Nombre completo", value: `${patient.first_name} ${patient.last_name}` },
                { label: "Cedula", value: patient.cedula },
                { label: "Fecha de nacimiento", value: new Date(patient.date_of_birth).toLocaleDateString("es-ES") },
                { label: "Edad", value: `${evaluation.patient_age_at_evaluation} años` },
                { label: "Sexo biologico", value: patient.biological_sex },
                { label: "Celular", value: patient.cellphone },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">{label}</p>
                  <p className="font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </section>
          }
          {/* Evaluación clínica */}
          <section>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-5 w-1 bg-blue-500 rounded-full" />
                <h3 className="text-lg font-semibold text-gray-800 tracking-tight">Evaluacion clinica</h3>
              </div>
              {!isConfirmed && (
                <button
                  onClick={onEditEval}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition print:hidden"
                >
                  <PencilSquareIcon className="h-3.5 w-3.5" />
                  Editar
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">Peso</p>
                <p className="font-medium">{evaluation.weight} kg</p>
                <div className="border-t border-gray-100 mt-2" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">Estatura</p>
                <p className="font-medium">{evaluation.height} m</p>
                <div className="border-t border-gray-100 mt-2" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">IMC</p>
                <p className="font-semibold text-blue-600">{evaluation.bmi}</p>
                <div className="border-t border-gray-100 mt-2" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-0.5">Estado IMC</p>
                <span className="inline-block mt-1 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                  {evaluation.bmi_status}
                </span>
                <div className="border-t border-gray-100 mt-2" />
              </div>
            </div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">Antecedentes medicos</p>
            <div className="bg-gray-50 rounded-xl p-4 text-sm">
              <p className="text-gray-700">{evaluation.medical_background}</p>
            </div>
          </section>

          {/* Procedimientos */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-5 w-1 bg-emerald-500 rounded-full" />
              <h3 className="text-lg font-semibold text-gray-800 tracking-tight">Procedimientos y precios</h3>
            </div>
            {procedures.map((proc) => (
              <div key={proc.id} className="space-y-4 mb-8">
                <div className="flex justify-end print:hidden">
                  <button
                    onClick={() => onEditProc(proc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  >
                    <PencilSquareIcon className="h-3.5 w-3.5" />
                    Editar procedimiento
                  </button>
                </div>
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="text-[10px] uppercase font-bold text-gray-500 tracking-wide text-left py-3 px-3">Procedimiento</th>
                      <th className="text-[10px] uppercase font-bold text-gray-500 tracking-wide text-right py-3 px-3">Precio unitario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proc.items.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100">
                        <td className="py-2 px-3 text-gray-700">{item.item_name}</td>
                        <td className="py-2 px-3 text-right font-medium text-gray-800">
                          ${Number(item.price).toLocaleString("es-CO")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-1">Notas clinicas</p>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm italic text-gray-600">
                  {proc.notes}
                </div>
                <div className="text-right">
                  <div className="border-t border-gray-100 mt-1 mb-4" />
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Valor clinico total</p>
                  <p className="text-4xl font-extrabold text-green-500">
                    ${Number(proc.total_amount).toLocaleString("es-CO")}
                  </p>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* Firma existente */}
        {evaluation.patient_signature && (
          <div className="px-4 sm:px-8 pb-6">
            <div className="border-t border-gray-100 mb-6" />
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-3">Firma de la paciente</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-2 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={evaluation.patient_signature} alt="Firma de la paciente" className="h-24 object-contain" />
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                {evaluation.confirmed_at && (
                  <p>
                    Firmado el{" "}
                    {new Date(evaluation.confirmed_at).toLocaleString("es-CO", {
                      day: "2-digit", month: "long", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                )}
                <p className="text-gray-400 italic">
                  La paciente confirma haber leído y aceptado el registro clínico.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 text-center text-[10px] text-gray-400 py-4">
          Coldesthetic - Historia Clinica (c) {currentYear} | Documento confidencial
        </div>
      </div>
    );
  },
);

ClinicalRecordView.displayName = "ClinicalRecordView";
export default ClinicalRecordView;
