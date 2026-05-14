"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// Mensajes contextuales por ruta
const MENSAJES: Record<string, string[]> = {
  "/dashboard": [
    "¡Bienvenido al dashboard ejecutivo! Aquí ves todos los KPIs de la EPS en tiempo real.",
    "Hay 5 alertas clínicas pendientes. Te recomiendo revisarlas primero.",
    "El 94% de los servicios están verificados por GPS. ¡Excelente resultado!",
  ],
  "/autorizaciones": [
    "Aquí está la pantalla más importante: en Colombia ningún servicio domiciliario se presta sin autorización previa.",
    "Tienes 8 solicitudes pendientes. Puedes aprobar, negar o solicitar más información.",
    "Las solicitudes urgentes están marcadas en rojo. ¡Empieza por ahí!",
  ],
  "/pacientes": [
    "Lista completa de los 47 pacientes que la EPS está monitoreando este mes.",
    "Las columnas de Adherencia y Tendencia te dicen cómo va cada paciente sin abrir su historial.",
    "Los pacientes en rojo tienen menos del 70% de adherencia al plan. Requieren atención.",
  ],
  "/auditoria": [
    "Aquí puedes verificar que cada servicio pagado realmente se prestó.",
    "Las cuentas marcadas como 'Auditado con evidencia' tienen GPS, firma digital y nota clínica.",
    "Se detectaron 3 irregularidades este mes — posibles visitas fantasma.",
  ],
};

const MENSAJES_DETALLE = [
  "Este es el detalle clínico completo del paciente. Incluye timeline y signos vitales.",
  "El gráfico muestra la evolución de los signos vitales desde el alta.",
  "Desde aquí puedes modificar el plan, suspender o derivar al paciente.",
];

const MENSAJES_EVIDENCIA = [
  "El mapa muestra dónde estaba el profesional según su GPS al momento del servicio.",
  "La línea verde indica que el GPS coincide con el domicilio del paciente.",
  "La firma digital del paciente confirma que el servicio fue recibido.",
];

const DEFAULT = [
  "Soy tu guía en OLGA. ¡Explora las pantallas del menú lateral!",
];

function getMensaje(pathname: string): string[] {
  if (MENSAJES[pathname]) return MENSAJES[pathname];
  if (pathname.startsWith("/pacientes/")) return MENSAJES_DETALLE;
  if (pathname.startsWith("/evidencia/")) return MENSAJES_EVIDENCIA;
  return DEFAULT;
}

export default function DoctorGuide() {
  const pathname = usePathname() ?? "/dashboard";
  const [visible, setVisible] = useState(true);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);

  const mensajes = getMensaje(pathname);

  // Al cambiar de pantalla: mostrar burbuja automáticamente con el primer mensaje
  useEffect(() => {
    setMsgIdx(0);
    setBubbleVisible(true);
    const timer = setTimeout(() => setBubbleVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!visible) return null;

  function nextMsg() {
    setMsgIdx((i) => (i + 1) % mensajes.length);
    setBubbleVisible(true);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">

      {/* Burbuja de texto */}
      <AnimatePresence>
        {bubbleVisible && (
          <motion.div
            key={`${pathname}-${msgIdx}`}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="max-w-xs bg-white border border-gray-200 rounded-2xl rounded-br-sm shadow-xl p-4 relative"
          >
            <button
              onClick={() => setBubbleVisible(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <p className="text-sm text-gray-700 leading-relaxed pr-4">{mensajes[msgIdx]}</p>
            {mensajes.length > 1 && (
              <button
                onClick={nextMsg}
                className="mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Siguiente → ({msgIdx + 1}/{mensajes.length})
              </button>
            )}
            {/* Triángulo */}
            <div className="absolute -bottom-2 right-5 w-4 h-2 overflow-hidden">
              <div className="w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45 translate-y-[-6px] translate-x-[2px]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar del doctor */}
      <div className="flex items-end gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setBubbleVisible((v) => !v); }}
          className="relative w-16 h-16 rounded-full bg-emerald-600 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center cursor-pointer hover:shadow-2xl transition-shadow"
          title="Doctor OLGA"
        >
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <circle cx="32" cy="32" r="32" fill="#059669" />
            <circle cx="32" cy="22" r="10" fill="#fff" />
            <path d="M12 56c0-11 8.95-20 20-20s20 8.95 20 20" fill="#fff" />
            <line x1="28" y1="35" x2="28" y2="42" stroke="#059669" strokeWidth="2" />
            <line x1="36" y1="35" x2="36" y2="42" stroke="#059669" strokeWidth="2" />
            <line x1="32" y1="38" x2="32" y2="44" stroke="#059669" strokeWidth="2" />
            <rect x="28" y="42" width="8" height="4" rx="2" fill="#059669" />
          </svg>
          {/* Badge verde de disponible */}
          <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />
        </motion.button>

        {/* Botón cerrar doctor */}
        <button
          onClick={() => setVisible(false)}
          className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors mb-1"
          title="Ocultar guía"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Botón re-abrir si cerrado — no aplica aquí porque no se ve, pero útil para debug */}
    </div>
  );
}
