// Configuración de WhatsApp con mensajes automáticos por sección
// Cambia el número de teléfono aquí si es necesario

export const WHATSAPP_NUMBER = "573224042286";

// Mensajes predefinidos por sección
export const whatsappMessages = {
  hero: "¡Hola! Me interesa conocer más información sobre lipolisis láser. ¿Podrían ayudarme?",
  services: "Hola, me gustaría saber más detalles sobre los servicios que ofrecen en Perfestetic.",
  benefits: "¡Hola! Quiero conocer más sobre los beneficios de los tratamientos que realizan.",
  gallery: "Hola, me gustaría ver más fotos de resultados y conocer más sobre los tratamientos.",
  contact: "¡Hola! Me gustaría agendar una consulta gratuita. ¿Cuándo tienen disponibilidad?",
  general: "Hola, quiero más información sobre Perfestetic."
} as const;

// Función para generar URL de WhatsApp con mensaje automático
export const generateWhatsAppURL = (section: keyof typeof whatsappMessages): string => {
  const message = whatsappMessages[section];
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

// Función para abrir WhatsApp con mensaje automático
export const openWhatsApp = (section: keyof typeof whatsappMessages): void => {
  const url = generateWhatsAppURL(section);
  window.open(url, '_blank', 'noopener,noreferrer');
};