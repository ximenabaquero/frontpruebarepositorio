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
        title: "🏠 Dashboard Ejecutivo",
        description: "Esta es la vista central de la EPS. Aquí ves el estado de toda tu población domiciliaria en tiempo real.",
      },
    },
    {
      element: "[data-tour='kpi-pacientes']",
      popover: {
        title: "👥 Pacientes monitoreados",
        description: "47 pacientes activos clasificados por nivel de riesgo: alto (rojo), medio (ámbar) y bajo (verde).",
        side: "bottom",
      },
    },
    {
      element: "[data-tour='kpi-alertas']",
      popover: {
        title: "🚨 Alertas clínicas",
        description: "5 alertas que requieren atención inmediata. Pacientes con signos de deterioro o visitas sin confirmar.",
        side: "bottom",
      },
    },
    {
      element: "[data-tour='kpi-solicitudes']",
      popover: {
        title: "📋 Solicitudes pendientes",
        description: "8 servicios esperan tu autorización. En Colombia, ningún servicio domiciliario se presta sin aprobación previa de la EPS.",
        side: "bottom",
      },
    },
    {
      element: "[data-tour='kpi-presupuesto']",
      popover: {
        title: "💰 Presupuesto del mes",
        description: "Llevas $247M de $310M ejecutados (79.7%). La barra se vuelve roja si superas el 85%.",
        side: "bottom",
      },
    },
    {
      element: "[data-tour='top3']",
      popover: {
        title: "⚠️ Top 3 en riesgo",
        description: "Los pacientes con mayor probabilidad de reingreso esta semana. Click en cualquiera para ver su detalle clínico.",
        side: "top",
      },
    },
    {
      element: "[data-tour='alertas-panel']",
      popover: {
        title: "🔴 Panel de alertas",
        description: "Detalle de cada alerta con botón 'Atender'. Los críticos (rojo) requieren acción en las próximas 2 horas.",
        side: "top",
      },
    },
  ],
  "/autorizaciones": [
    {
      popover: {
        title: "📋 Solicitudes de Autorización",
        description: "En Colombia, el pagador (EPS) debe autorizar cada servicio domiciliario antes de prestarlo. Esta pantalla es donde se toman esas decisiones.",
      },
    },
    {
      element: "[data-tour='filtros']",
      popover: {
        title: "🔍 Filtros",
        description: "Filtra por urgencia (rojos primero), tipo de servicio, o busca directamente por paciente o médico.",
        side: "bottom",
      },
    },
    {
      element: "[data-tour='tabla-solicitudes']",
      popover: {
        title: "📊 Tabla de solicitudes",
        description: "Cada fila muestra: paciente, diagnóstico, complejidad clínica, plan propuesto, médico solicitante y costo estimado.",
        side: "top",
      },
    },
    {
      element: "[data-tour='acciones-solicitud']",
      popover: {
        title: "✅ Tomar decisiones",
        description: "Cuatro acciones disponibles: Aprobar (verde) · Con condiciones (ámbar) · Negar (rojo) · Solicitar más info (gris).",
        side: "left",
      },
    },
  ],
  "/pacientes": [
    {
      popover: {
        title: "👥 Lista de Pacientes",
        description: "Los 47 pacientes que la EPS está monitoreando activamente. Cada fila muestra su estado clínico de un vistazo.",
      },
    },
    {
      element: "[data-tour='filtro-riesgo']",
      popover: {
        title: "🎯 Filtro por riesgo",
        description: "Haz click en 'Alto', 'Medio' o 'Bajo' para filtrar. Los rojos son los que requieren intervención prioritaria.",
        side: "bottom",
      },
    },
    {
      element: "[data-tour='col-adherencia']",
      popover: {
        title: "🟢 Adherencia al plan",
        description: "Porcentaje de servicios del plan que el paciente ha cumplido. 🟢 ≥90% · 🟡 70–89% · 🔴 <70%.",
        side: "top",
      },
    },
    {
      element: "[data-tour='col-tendencia']",
      popover: {
        title: "📈 Tendencia clínica",
        description: "↑ Mejorando (verde) · → Estable (gris) · ↓ Deteriorando (rojo). Detectado con los signos vitales de las últimas visitas.",
        side: "top",
      },
    },
  ],
  "/auditoria": [
    {
      popover: {
        title: "🔍 Auditoría y Reportes",
        description: "Aquí el pagador verifica que cada servicio autorizado realmente se prestó, con evidencia verificable.",
      },
    },
    {
      element: "[data-tour='kpi-verificados']",
      popover: {
        title: "✅ Servicios verificados",
        description: "94% de los servicios tienen GPS + firma digital + nota clínica. El 6% restante está pendiente de revisión.",
        side: "bottom",
      },
    },
    {
      element: "[data-tour='kpi-irregularidades']",
      popover: {
        title: "🚨 Irregularidades",
        description: "3 servicios con anomalías detectadas: GPS que nunca llegó al domicilio, servicios simultáneos, o notas sin visita.",
        side: "bottom",
      },
    },
    {
      element: "[data-tour='tabla-cuentas']",
      popover: {
        title: "📊 Cuentas radicadas",
        description: "'Auditado con evidencia' = GPS ✅ + firma ✅ + nota clínica ✅. Solo estas cuentas se aprueban para pago.",
        side: "top",
      },
    },
    {
      element: "[data-tour='tabs-regulatorio']",
      popover: {
        title: "🏛️ Módulos regulatorios",
        description: "Integración con RIPS (reporte a Ministerio), Supersalud, ADRES y scoring de prestadores. En construcción — Fase 2.",
        side: "bottom",
      },
    },
  ],
};

function getTourSteps(pathname: string): TourStep[] {
  if (TOURS[pathname]) return TOURS[pathname];
  if (pathname.startsWith("/pacientes/")) return [
    { popover: { title: "👤 Detalle de Paciente", description: "Vista clínica completa: datos demográficos, timeline de servicios, signos vitales y acciones disponibles." } },
    { element: "[data-tour='timeline']", popover: { title: "📅 Timeline de servicios", description: "✅ Cumplido · ⏳ Pendiente · ❌ No cumplido. Los rojos indican que el servicio no se verificó.", side: "right" } },
    { element: "[data-tour='grafico-vitales']", popover: { title: "📈 Signos vitales", description: "Evolución de PA, FC y SpO₂ desde el alta. Si la curva sube en rojo, el paciente se está deteriorando.", side: "left" } },
    { element: "[data-tour='acciones-paciente']", popover: { title: "⚙️ Acciones", description: "Modificar plan · Derivar a especialista · Suspender atención domiciliaria.", side: "bottom" } },
  ];
  if (pathname.startsWith("/evidencia/")) return [
    { popover: { title: "📍 Evidencia de Servicio", description: "Verificación completa de que el profesional llegó al domicilio del paciente." } },
    { element: "[data-tour='mapa']", popover: { title: "🗺️ Mapa GPS", description: "Verde = llegó al domicilio (≤200m). Rojo discontinuo = GPS fuera de rango → posible visita fantasma.", side: "right" } },
    { element: "[data-tour='firma']", popover: { title: "✍️ Firma digital", description: "El paciente confirma el servicio con su firma. Timestamp registrado automáticamente.", side: "left" } },
    { element: "[data-tour='btn-aprobar']", popover: { title: "✅ Aprobar para auditoría", description: "Una vez verificado GPS + firma + nota clínica, el servicio queda listo para facturación sin glosa.", side: "top" } },
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
