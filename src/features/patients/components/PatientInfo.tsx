"use client";

interface Props {
  patientId: number;
}

export default function PatientInfo({ patientId }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">
        Información del paciente
      </h2>

      <p className="text-sm text-gray-600 mt-2">ID del paciente: {patientId}</p>
    </div>
  );
}
