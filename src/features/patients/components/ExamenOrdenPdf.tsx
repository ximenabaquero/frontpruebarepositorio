import { forwardRef } from "react";

type Props = {
  patientName: string;
  age: number;
  bmi: number | string;
  exams: string[];
  currentYear: number;
};

const ExamenOrdenPdf = forwardRef<HTMLDivElement, Props>(
  ({ patientName, age, bmi, exams, currentYear }, ref) => {
    const today = new Date().toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return (
      <div className="fixed -left-[9999px] top-0" aria-hidden="true">
        <div
          ref={ref}
          style={{
            width: "794px",
            padding: "56px 64px",
            background: "#fff",
            fontFamily: "sans-serif",
            color: "#111827",
          }}
        >
          {/* Encabezado */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "32px",
            }}
          >
            <div>
              <p style={{ fontSize: "22px", fontWeight: 800, color: "#0f766e", marginBottom: "4px" }}>
                Cold Esthetic
              </p>
              <p style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Orden de Exámenes Médicos
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", marginBottom: "2px" }}>
                Fecha de emisión
              </p>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{today}</p>
            </div>
          </div>

          <div style={{ borderTop: "2px solid #0f766e", marginBottom: "28px" }} />

          {/* Datos del paciente */}
          <div
            style={{
              background: "#f0fdfa",
              border: "1px solid #99f6e4",
              borderRadius: "10px",
              padding: "16px 20px",
              marginBottom: "28px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              fontSize: "12px",
            }}
          >
            <div>
              <p style={{ fontSize: "9px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>
                Paciente
              </p>
              <p style={{ fontWeight: 600, color: "#111827" }}>{patientName}</p>
            </div>
            <div>
              <p style={{ fontSize: "9px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>
                Edad
              </p>
              <p style={{ fontWeight: 600, color: "#111827" }}>{age} años</p>
            </div>
            <div>
              <p style={{ fontSize: "9px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>
                IMC
              </p>
              <p style={{ fontWeight: 600, color: Number(bmi) >= 25 ? "#d97706" : "#111827" }}>
                {Number(bmi).toFixed(1)} {Number(bmi) >= 25 ? "(Sobrepeso/Obesidad)" : ""}
              </p>
            </div>
          </div>

          {/* Instrucciones */}
          <div style={{ marginBottom: "24px" }}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#374151",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "6px",
                marginBottom: "10px",
              }}
            >
              Instrucciones para el paciente
            </p>
            <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.7 }}>
              Por favor realice los siguientes exámenes en el laboratorio clínico de su preferencia
              y traiga los resultados originales a la clínica antes de su cita de procedimiento.
            </p>
          </div>

          {/* Lista de exámenes */}
          <div style={{ marginBottom: "32px" }}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#374151",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "6px",
                marginBottom: "12px",
              }}
            >
              Exámenes requeridos
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <tbody>
                {exams.map((exam, idx) => (
                  <tr
                    key={exam}
                    style={{
                      background: idx % 2 === 0 ? "#f9fafb" : "#ffffff",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <td style={{ padding: "10px 14px", color: "#374151" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#0f766e",
                          marginRight: "10px",
                          verticalAlign: "middle",
                        }}
                      />
                      {exam}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        textAlign: "right",
                        color: "#9ca3af",
                        fontSize: "11px",
                      }}
                    >
                      □ Entregado
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Firma */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "32px",
            }}
          >
            <div>
              <div style={{ borderTop: "1px solid #d1d5db", paddingTop: "8px" }}>
                <p style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase" }}>
                  Firma y sello del médico
                </p>
              </div>
            </div>
            <div>
              <div style={{ borderTop: "1px solid #d1d5db", paddingTop: "8px" }}>
                <p style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase" }}>
                  Fecha de entrega de resultados
                </p>
              </div>
            </div>
          </div>

          {/* Pie */}
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "10px",
              textAlign: "center",
              fontSize: "9px",
              color: "#9ca3af",
            }}
          >
            Cold Esthetic — Orden de Exámenes © {currentYear} | Documento confidencial
          </div>
        </div>
      </div>
    );
  },
);

ExamenOrdenPdf.displayName = "ExamenOrdenPdf";
export default ExamenOrdenPdf;
