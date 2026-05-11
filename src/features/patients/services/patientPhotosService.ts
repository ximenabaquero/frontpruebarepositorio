import Cookies from "js-cookie";
import type { PatientPhoto, PhotoStage } from "../types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

export function photosKey(evaluationId: number): string {
  return `${apiBaseUrl}/api/v1/medical-evaluations/${evaluationId}/photos`;
}

export async function uploadPatientPhoto(
  evaluationId: number,
  stage: PhotoStage,
  file: File,
  notes?: string,
): Promise<PatientPhoto> {
  const form = new FormData();
  form.append("stage", stage);
  form.append("image", file);
  if (notes) form.append("notes", notes);

  const res = await fetch(
    `${apiBaseUrl}/api/v1/medical-evaluations/${evaluationId}/photos`,
    {
      method: "POST",
      credentials: "include",
      headers: { "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") ?? "", Accept: "application/json" },
      body: form,
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Error al subir la foto");
  }
  const json = await res.json();
  return json.data;
}

export async function deletePatientPhoto(
  evaluationId: number,
  photoId: number,
): Promise<void> {
  const res = await fetch(
    `${apiBaseUrl}/api/v1/medical-evaluations/${evaluationId}/photos/${photoId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: { "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") ?? "", Accept: "application/json" },
    },
  );
  if (!res.ok) throw new Error("Error al eliminar la foto");
}
