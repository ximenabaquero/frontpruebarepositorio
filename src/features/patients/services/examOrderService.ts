import Cookies from "js-cookie";
import type { ExamOrder } from "../types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

function getHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") ?? "",
  };
}

export async function createExamOrder(
  evaluationId: number,
  exams: string[],
): Promise<ExamOrder> {
  const res = await fetch(
    `${apiBaseUrl}/api/v1/medical-evaluations/${evaluationId}/exam-order`,
    {
      method: "POST",
      credentials: "include",
      headers: getHeaders(),
      body: JSON.stringify({ exams }),
    },
  );
  if (!res.ok) throw new Error("Error al guardar la orden de exámenes");
  const json = await res.json();
  return json.data;
}

export async function updateExamOrder(
  orderId: number,
  payload: { status: "apto" | "no_apto" | "pendiente"; notes?: string },
): Promise<ExamOrder> {
  const res = await fetch(`${apiBaseUrl}/api/v1/exam-orders/${orderId}`, {
    method: "PATCH",
    credentials: "include",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al actualizar la orden de exámenes");
  const json = await res.json();
  return json.data;
}

/** Clave SWR para obtener la orden de exámenes de una valoración */
export function examOrderKey(evaluationId: number): string {
  return `${apiBaseUrl}/api/v1/medical-evaluations/${evaluationId}/exam-order`;
}

export async function uploadExamResult(
  orderId: number,
  file: File,
): Promise<{ result_file_url: string }> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${apiBaseUrl}/api/v1/exam-orders/${orderId}/result`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") ?? "",
      Accept: "application/json",
    },
    body: form,
  });
  if (!res.ok) throw new Error("Error al subir el archivo de resultados");
  const json = await res.json();
  return json.data;
}
