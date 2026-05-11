import Cookies from "js-cookie";
import type { Appointment } from "../types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

function getHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") ?? "",
  };
}

export function appointmentKey(evaluationId: number): string {
  return `${apiBaseUrl}/api/v1/medical-evaluations/${evaluationId}/appointment`;
}

export type CreateAppointmentPayload = {
  appointment_datetime: string;
  procedure_type: "concejacion" | "sincecion";
  doctor_name?: string;
  notes?: string;
  duration_minutes?: number;
};

export async function createAppointment(
  evaluationId: number,
  payload: CreateAppointmentPayload,
): Promise<Appointment> {
  const res = await fetch(
    `${apiBaseUrl}/api/v1/medical-evaluations/${evaluationId}/appointment`,
    {
      method: "POST",
      credentials: "include",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Error al agendar la cita");
  }
  const json = await res.json();
  return json.data;
}

export async function cancelAppointment(appointmentId: number): Promise<void> {
  const res = await fetch(
    `${apiBaseUrl}/api/v1/appointments/${appointmentId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: getHeaders(),
    },
  );
  if (!res.ok) throw new Error("Error al cancelar la cita");
}
