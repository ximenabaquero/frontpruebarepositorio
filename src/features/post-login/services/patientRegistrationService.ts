import Cookies from "js-cookie";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

type ProcedureItem = {
  item_name: string;
  price: string;
};

function xsrfHeaders() {
  const token = Cookies.get("XSRF-TOKEN") ?? "";
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-XSRF-TOKEN": token,
  };
}

function extractError(body: Record<string, unknown> | null, fallback: string): string {
  if (!body) return fallback;
  if (typeof body.message === "string") return body.message;
  if (body.errors && typeof body.errors === "object") {
    return Object.values(body.errors as Record<string, string[]>)
      .flat()
      .join(" ");
  }
  if (typeof body.error === "string") return body.error;
  return fallback;
}

export async function createPatient(data: {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  document_type: string;
  cedula: string;
  cellphone: string;
  biological_sex: string;
}): Promise<number> {
  const res = await fetch(`${apiBaseUrl}/api/v1/patients`, {
    method: "POST",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(extractError(body, "Error al crear paciente"));
  }

  const json = await res.json();
  return json.data.id as number;
}

export async function createMedicalEvaluation(data: {
  patient_id: number;
  weight: number;
  height: number;
  medical_background: string;
}): Promise<number> {
  const res = await fetch(`${apiBaseUrl}/api/v1/medical-evaluations`, {
    method: "POST",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });

  if (res.status === 401) throw new Error("Sesión expirada. Inicia sesión nuevamente.");
  if (res.status === 403) {
    const body = await res.json().catch(() => null);
    throw new Error(extractError(body, "Cuenta no activa."));
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(extractError(body, "Error al crear evaluación médica"));
  }

  const json = await res.json();
  return json.data.id as number;
}

export async function createProcedures(data: {
  medical_evaluation_id: number;
  procedure_date: string;
  notes: string;
  items: { item_name: string; price: number }[];
}): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/v1/procedures`, {
    method: "POST",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(extractError(body, "Error al crear procedimientos"));
  }
}

export async function registerPatient(params: {
  patient: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    document_type: string;
    cedula: string;
    cellphone: string;
    biological_sex: string;
  };
  evaluation: {
    weight: number;
    height: number;
    medical_background: string;
  };
  procedures: {
    notes: string;
    items: ProcedureItem[];
  };
}): Promise<{ patient_id: number; medical_evaluation_id: number }> {
  const patient_id = await createPatient(params.patient);
  const medical_evaluation_id = await createMedicalEvaluation({
    patient_id,
    ...params.evaluation,
  });
  await createProcedures({
    medical_evaluation_id,
    procedure_date: new Date().toISOString().slice(0, 10),
    notes: params.procedures.notes,
    items: params.procedures.items.map((item) => ({
      item_name: item.item_name,
      price: Number((item.price || "").replace(/\D/g, "")),
    })),
  });
  return { patient_id, medical_evaluation_id };
}
