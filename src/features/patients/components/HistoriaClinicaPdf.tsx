import { forwardRef } from "react";
import type { EvaluationData } from "../types";

type Props = {
  evaluation: EvaluationData;
  evaluationId: number;
  currentYear: number;
};

const label: React.CSSProperties = {
  fontSize: "9px",
  fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "3px",
};

const value: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 600,
  color: "#111827",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  color: "#374151",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "8px",
  borderBottom: "1px solid #d1d5db",
  paddingBottom: "4px",
};

const HistoriaClinicaPdf = forwardRef<HTMLDivElement, Props>(
  ({ evaluation, evaluationId, currentYear }, ref) => {
    const { patient, procedures } = evaluation;

    const procedureDate = procedures?.[0]?.procedure_date ?? evaluation.created_at;
    const formattedDate = procedureDate
        ? new Date(/^\d{4}-\d{2}-\d{2}$/.test(procedureDate) ? `${procedureDate}T00:00:00` : procedureDate)
          .toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })
      : "";

    const STATUS_LABEL: Record<string, string> = {
      EN_ESPERA: "En espera",
      CONFIRMADO: "Confirmado",
      CANCELADO: "Cancelado",
    };

    return (
      <div className="fixed -left-[9999px] top-0" aria-hidden="true">
        <div ref={ref} style={{ width: "794px", padding: "48px", background: "#fff", fontFamily: "sans-serif", color: "#111827" }}>

          {/* Encabezado */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
            <div>
              <p style={{ fontSize: "20px", fontWeight: 800, color: "#111827", marginBottom: "2px" }}>
                {evaluation.user?.brand_name ?? "Cold Esthetic"}
              </p>
              <p style={{ fontSize: "9px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Historia Clínica — Documento confidencial
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "9px", color: "#9ca3af", textTransform: "uppercase", marginBottom: "2px" }}>Registro N°</p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>
                #{String(evaluationId).padStart(5, "0")}
              </p>
              <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>{formattedDate}</p>
              {evaluation.status && (
                <p style={{ fontSize: "10px", fontWeight: 600, color: "#374151", marginTop: "4px" }}>
                  Estado: {STATUS_LABEL[evaluation.status] ?? evaluation.status}
                </p>
              )}
            </div>
          </div>

          <div style={{ borderTop: "2px solid #111827", marginBottom: "24px" }} />

          {/* Datos personales */}
          <div style={{ marginBottom: "24px" }}>
            <p style={sectionTitle}>Datos personales</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", fontSize: "12px" }}>
              <div><p style={label}>Nombre</p><p style={value}>{patient.first_name} {patient.last_name}</p></div>
              <div><p style={label}>Cédula</p><p style={value}>{patient.cedula}</p></div>
              <div><p style={label}>Fecha de nacimiento</p><p style={value}>{new Date(patient.date_of_birth).toLocaleDateString("es-CO")}</p></div>
              <div><p style={label}>Edad</p><p style={value}>{evaluation.patient_age_at_evaluation} años</p></div>
              <div><p style={label}>Sexo biológico</p><p style={value}>{patient.biological_sex}</p></div>
              <div><p style={label}>Celular</p><p style={value}>{patient.cellphone}</p></div>
              <div><p style={label}>Remitente</p><p style={value}>{evaluation.referrer_name ?? "—"}</p></div>
            </div>
          </div>

          {/* Evaluación clínica */}
          <div style={{ marginBottom: "24px" }}>
            <p style={sectionTitle}>Evaluación clínica</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", fontSize: "12px", marginBottom: "12px" }}>
              <div><p style={label}>Peso</p><p style={value}>{evaluation.weight} kg</p></div>
              <div><p style={label}>Estatura</p><p style={value}>{evaluation.height} m</p></div>
              <div><p style={label}>IMC</p><p style={value}>{evaluation.bmi}</p></div>
              <div><p style={label}>Estado IMC</p><p style={value}>{evaluation.bmi_status}</p></div>
            </div>
            <div>
              <p style={label}>Antecedentes médicos</p>
              <div style={{ border: "1px solid #d1d5db", borderRadius: "6px", padding: "10px", fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>
                {evaluation.medical_background}
              </div>
            </div>
          </div>

          {/* Procedimientos */}
          {procedures.map((proc, idx) => (
            <div key={proc.id ?? idx} style={{ marginBottom: "24px" }}>
              <p style={sectionTitle}>Procedimiento {procedures.length > 1 ? idx + 1 : ""}</p>

              {proc.procedure_date && (
                <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "8px" }}>
                  Fecha: {new Date(`${proc.procedure_date}T00:00:00`).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              )}

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "10px" }}>
                <thead>
                  <tr style={{ background: "#f3f4f6" }}>
                    <th style={{ textAlign: "left", padding: "8px 10px", fontSize: "9px", textTransform: "uppercase", color: "#6b7280", fontWeight: 700 }}>Procedimiento</th>
                    <th style={{ textAlign: "right", padding: "8px 10px", fontSize: "9px", textTransform: "uppercase", color: "#6b7280", fontWeight: 700 }}>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {proc.items.map((item, i) => (
                    <tr key={item.id ?? i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "8px 10px", color: "#374151" }}>{item.item_name}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 600, color: "#111827" }}>
                        ${Number(item.price).toLocaleString("es-CO")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                <div style={{ borderTop: "1px solid #374151", paddingTop: "6px", textAlign: "right" }}>
                  <p style={{ fontSize: "9px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>Total</p>
                  <p style={{ fontSize: "18px", fontWeight: 800, color: "#111827" }}>
                    ${Number(proc.total_amount).toLocaleString("es-CO")}
                  </p>
                </div>
              </div>

              {proc.notes && (
                <div>
                  <p style={label}>Notas clínicas</p>
                  <div style={{ border: "1px solid #d1d5db", borderRadius: "6px", padding: "10px", fontSize: "12px", color: "#374151", fontStyle: "italic", lineHeight: 1.6 }}>
                    {proc.notes}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Firma */}
          {evaluation.patient_signature && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ borderTop: "1px solid #d1d5db", marginBottom: "16px" }} />
              <p style={sectionTitle}>Firma de la paciente</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}>
                <div style={{ border: "1px solid #d1d5db", borderRadius: "6px", padding: "6px", background: "#f9fafb" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={evaluation.patient_signature} alt="Firma" style={{ height: "72px", objectFit: "contain" }} />
                </div>
                <div style={{ fontSize: "10px", color: "#6b7280" }}>
                  {evaluation.confirmed_at && (
                    <p>Firmado el {new Date(evaluation.confirmed_at).toLocaleString("es-CO", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  )}
                  <p style={{ fontStyle: "italic", marginTop: "4px" }}>
                    La paciente confirma haber leído y aceptado el registro clínico.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pie */}
          <div style={{ borderTop: "1px solid #d1d5db", paddingTop: "10px", textAlign: "center", fontSize: "9px", color: "#9ca3af" }}>
            Cold Esthetic — Historia Clínica © {currentYear} | Documento confidencial
          </div>
        </div>
      </div>
    );
  },
);

HistoriaClinicaPdf.displayName = "HistoriaClinicaPdf";
export default HistoriaClinicaPdf;
