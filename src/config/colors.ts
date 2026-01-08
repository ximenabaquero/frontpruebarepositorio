// Configuración de colores para Coldesthetic
// Puedes cambiar estos colores directamente aquí sin tocar globals.css

export const colors = {
  // Colores principales
  background: '#fad7f2',        // Fondo rosado súper clarito
  foreground: '#171717',        // Texto principal (gris oscuro)
  strongpink: '#de73c1',        // Rosa fuerte/morado
  lightGray: '#f8f9fa',         // Gris claro
  
  // Colores adicionales que puedes usar
  primary: '#de73c1',           // Color primario (mismo que strongpink)
  secondary: '#b6599a',         // Color secundario más oscuro
  accent: '#9b59b6',            // Color de acento morado
  
  // Colores para botones y acciones
  whatsapp: '#25D366',          // Verde de WhatsApp
  whatsappHover: '#20b358',     // Verde de WhatsApp hover
  
  // Gradientes
  gradientFrom: '#fad7f2',      // Inicio del gradiente
  gradientTo: '#f8f9fa',        // Final del gradiente
  
  // Modo oscuro (opcional)
  dark: {
    background: '#0a0a0a',
    foreground: '#ededed',
  }
} as const;

// Función helper para usar los colores fácilmente
export const getColor = (colorName: keyof typeof colors) => {
  return colors[colorName];
};

// Función para generar estilos inline
export const getStyles = () => ({
  background: { backgroundColor: colors.background },
  foreground: { color: colors.foreground },
  strongpink: { color: colors.strongpink },
  primaryBg: { backgroundColor: colors.primary },
  gradient: { 
    background: `linear-gradient(135deg, ${colors.gradientFrom} 0%, ${colors.gradientTo} 100%)` 
  },
});