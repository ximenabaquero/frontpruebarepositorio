"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { HelpCircle } from "lucide-react";

type TourStep = {
  element?: string;
  popover: {
    title: string;
    description: string;
    side?: "top" | "bottom" | "left" | "right";
  };
};

const TOURS: Record<string, TourStep[]> = {
  "/dashboard": [
    {
      popover: {
        title: "Dashboard ejecutivo",
        description: "Vista central de la EPS. Muestra el estado de toda la población domiciliaria: alertas activas, solicitudes pendientes y ejecución del mes.",
      },
    },
    {
      popover: {
        title: "47 pacientes activos",
        description: "Afiliados con plan domiciliario autorizado y activo en la red de prestadores. Clasificados por riesgo: alto, medio y bajo.",
      },
    },
    {
      popover: {
        title: "5 alertas críticas",
        description: "Pacientes con visita no confirmada en 48h o signos vitales fuera de rango. Cada alerta enlaza directamente al detalle del paciente.",
      },
    },
    {
      popover: {
        title: "8 por autorizar",
        description: "Solicitudes de autorización pendientes. En Colombia ningún servicio domiciliario se presta sin aprobación previa del pagador.",
      },
    },
    {
      popover: {
        title: "Panel de atención prioritaria",
        description: "Los pacientes críticos aparecen primero en rojo. Haz clic en cualquier alerta para ir al detalle clínico completo.",
      },
    },
  ],
  "/autorizaciones": [
    {
      popover: {
        title: "Solicitudes de autorización",
        description: "El pagador (EPS) debe autorizar cada servicio domiciliario antes de prestarlo. Aquí se toman esas decisiones con toda la información clínica disponible.",
      },
    },
    {
      popover: {
        title: "Filtros de urgencia y tipo",
        description: "Filtra por urgencia (Urgente / Programado) o por tipo de servicio. Las urgentes aparecen marcadas en rojo.",
      },
    },
    {
      popover: {
        title: "Datos de cada solicitud",
        description: "Cada fila muestra: paciente, diagnóstico, complejidad clínica (alta/media/baja), plan propuesto (PHD, PAD, PARD), médico solicitante y costo estimado.",
      },
    },
    {
      popover: {
        title: "Tomar la decisión",
        description: "Cuatro acciones por fila: Aprobar (verde) · Con condiciones (ámbar) · Negar (rojo) · Más info — abre los PDFs de orden médica e historia clínica.",
      },
    },
  ],
  "/pacientes": [
    {
      popover: {
        title: "Pacientes monitoreados",
        description: "Los 47 pacientes que la EPS monitorea activamente este mes. Cada fila muestra el estado clínico sin necesidad de abrir el historial.",
      },
    },
    {
      popover: {
        title: "Filtro por nivel de riesgo",
        description: "Filtra por Alto, Medio o Bajo riesgo. Los rojos tienen mayor probabilidad de reingreso hospitalario esta semana.",
      },
    },
    {
      popover: {
        title: "Columna de Adherencia",
        description: "Porcentaje de servicios del plan cumplidos por el paciente. Verde ≥90% · Ámbar 70–89% · Rojo <70%.",
      },
    },
    {
      popover: {
        title: "Columna de Tendencia",
        description: "↑ Mejorando (verde) · → Estable (gris) · ↓ Deteriorando (rojo). Se calcula con los signos vitales de las últimas visitas verificadas.",
      },
    },
    {
      popover: {
        title: "Ver detalle del paciente",
        description: "Haz clic en cualquier fila para acceder al detalle clínico completo: timeline de servicios, gráfico de signos vitales y documentos de respaldo.",
      },
    },
  ],
  "/auditoria": [
    {
      popover: {
        title: "Auditoría domiciliaria",
        description: "El pagador verifica que cada servicio autorizado y facturado realmente se prestó, con triple evidencia: GPS, firma digital y nota clínica.",
      },
    },
    {
      popover: {
        title: "Yield real de operación: 97.9%",
        description: "139 de 142 operaciones verificadas sin fallo. El porcentaje se calcula matemáticamente — sin redondear a 100%.",
      },
    },
    {
      popover: {
        title: "Fallos de hardware vs. fraude clínico",
        description: "Se separan dos tipos de irregularidad: fallos técnicos (GPS timeout, OS denied) que van a cuarentena para conciliación, y fraude comprobado (GPS spoofing) que va a rechazo definitivo.",
      },
    },
    {
      popover: {
        title: "Tabla de liquidación con tres estados de capital",
        description: "Cada IPS muestra su capital dividido en: Aprobado (GPS + firma 100%) · En cuarentena (fallo técnico, esperando conciliación) · Rechazado (fraude comprobado).",
      },
    },
    {
      popover: {
        title: "Ver detalles del fallo",
        description: "El botón 'Ver detalles →' en cada IPS abre un modal con el código técnico del fallo (ej. GPS-TIMEOUT-011), el motivo y el estado de resolución.",
      },
    },
    {
      popover: {
        title: "Gráfico inversión vs. gasto",
        description: "Comparativo mensual de la inversión contratada vs. el gasto real. La línea roja es el límite de presupuesto. Ahorro acumulado visible en el período.",
      },
    },
  ],
};

function getTourSteps(pathname: string): TourStep[] {
  if (TOURS[pathname]) return TOURS[pathname];
  if (pathname.startsWith("/pacientes/")) return [
    { popover: { title: "Detalle de paciente", description: "Vista clínica completa: datos demográficos, plan autorizado, timeline de servicios y signos vitales desde el alta." } },
    { popover: { title: "Timeline cronológico", description: "Cada servicio muestra su estado: Cumplido (verde) · Pendiente (gris) · No cumplido (rojo). Los no cumplidos incluyen el motivo técnico del fallo." } },
    { popover: { title: "Profesional y entidad prestadora", description: "Cada visita en el timeline muestra el nombre del profesional y la IPS que lo envió, para trazabilidad completa." } },
    { popover: { title: "Gráfico de signos vitales", description: "Evolución de PA sistólica/diastólica, FC y SpO₂ desde el alta. En pacientes con diabetes también se grafica la glucemia." } },
    { popover: { title: "Acciones clínicas", description: "Desde la barra inferior: Contactar prestador · Modificar plan (con justificación) · Derivar a urgencias." } },
  ];
  if (pathname.startsWith("/evidencia/")) return [
    { popover: { title: "Evidencia de servicio", description: "Verificación triple: GPS del profesional, firma digital del paciente y nota clínica del servicio prestado." } },
    { popover: { title: "Mapa GPS", description: "El marcador muestra dónde estaba el profesional al momento del servicio. Si coincide con el domicilio, el GPS está verificado." } },
    { popover: { title: "Firma digital", description: "El paciente o cuidador firma digitalmente al finalizar el servicio. Timestamp registrado y asociado al expediente." } },
    { popover: { title: "Aprobar o marcar irregularidad", description: "GPS + firma + nota clínica = cuenta lista para facturación sin glosa. Si hay discrepancia, se activa el flujo de auditoría." } },
  ];
  return [{ popover: { title: "💡 Tip", description: "Explora el menú lateral para navegar entre las 7 pantallas de la demo." } }];
}

export default function DemoTour() {
  const pathname = usePathname() ?? "/dashboard";
  const steps = getTourSteps(pathname);

  const iniciarTour = useCallback(() => {
    const driverObj = driver({
      showProgress: true,
      progressText: "{{current}} de {{total}}",
      nextBtnText: "Siguiente →",
      prevBtnText: "← Anterior",
      doneBtnText: "¡Entendido! ✓",
      popoverClass: "olga-tour-popover",
      steps: steps.map((s) => ({
        element: s.element,
        popover: {
          title: s.popover.title,
          description: s.popover.description,
          side: s.popover.side ?? "bottom",
          align: "start",
        },
      })),
    });
    driverObj.drive();
  }, [steps]);

  return (
    <>
      <style>{`
        .olga-tour-popover .driver-popover-title {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          font-family: "Poppins", sans-serif;
        }
        .olga-tour-popover .driver-popover-description {
          font-size: 13px;
          color: #4b5563;
          line-height: 1.6;
          margin-top: 6px;
        }
        .olga-tour-popover .driver-popover-next-btn {
          background: #059669 !important;
          color: #fff !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          padding: 6px 14px !important;
        }
        .olga-tour-popover .driver-popover-prev-btn {
          border-radius: 8px !important;
          font-size: 12px !important;
          padding: 6px 14px !important;
        }
        .olga-tour-popover .driver-popover-done-btn {
          background: #059669 !important;
          color: #fff !important;
          border-radius: 8px !important;
          font-weight: 700 !important;
          font-size: 12px !important;
          padding: 6px 14px !important;
        }
        .driver-overlay { opacity: 0.55 !important; }
      `}</style>

      <button
        onClick={iniciarTour}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-600 transition-colors px-3 py-1.5 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200"
        title="Iniciar tour guiado"
      >
        <HelpCircle className="w-4 h-4" />
        Tour guiado
      </button>
    </>
  );
}
