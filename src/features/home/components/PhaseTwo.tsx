import React from 'react';

// Diccionario de iconos para Fase 2 (Escalamiento e IoT)
const PHASE_2_ICONS = {
  'i-activity': <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  'i-brain': (
    <>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.97-3.06 2.5 2.5 0 0 1-2.51-4.58 2.5 2.5 0 0 1 2.98-3.07A2.5 2.5 0 0 1 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.97-3.06 2.5 2.5 0 0 0 2.51-4.58 2.5 2.5 0 0 0-2.98-3.07A2.5 2.5 0 0 0 14.5 2z" />
    </>
  ),
  'i-stethoscope': (
    <>
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </>
  ),
  'i-hospital': (
    <>
      <path d="M18 21v-4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4" />
      <path d="M3 21h18" /><path d="M3 7h18" /><path d="M14 2H10v5h4V2z" /><path d="M21 21V7H3v14" />
    </>
  ),
  'i-trending': <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />,
};

const Ico = ({ id, className = "w-6 h-6" }: { id: string, className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={`${className} fill-none stroke-currentColor stroke-[1.5] stroke-linecap-round stroke-linejoin-round`}
  >
    {PHASE_2_ICONS[id as keyof typeof PHASE_2_ICONS]}
  </svg>
);

const PhaseTwo = () => {
  const cards = [
    { 
      id: 'i-activity', 
      title: 'Monitoreo IoT continuo', 
      desc: 'Dispositivos médicos certificados en casa del paciente. Signos vitales 24/7 sin depender de visitas físicas.',
      accent: 'bg-blue-500'
    },
    { 
      id: 'i-brain', 
      title: 'Cerebro clínico', 
      desc: 'Triage inteligente con protocolos por patología. Alertas predictivas que detectan el riesgo antes del deterioro.',
      accent: 'bg-purple-500'
    },
    { 
      id: 'i-stethoscope', 
      title: 'Panel de enfermería 24/7', 
      desc: 'Equipo clínico monitoreando pacientes en tiempo real desde un centro de comando virtual permanente.',
      accent: 'bg-[#0FB888]'
    },
    { 
      id: 'i-hospital', 
      title: 'Hospital en Casa', 
      desc: 'Atención hospitalaria completa en el domicilio. El paciente solo pisa urgencias si es estrictamente necesario.',
      accent: 'bg-red-500'
    },
    { 
      id: 'i-trending', 
      title: 'Inteligencia de datos', 
      desc: 'Análisis poblacional y modelos predictivos que generan evidencia clínica para todo el ecosistema de salud.',
      accent: 'bg-orange-500'
    },
  ];

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden" id="fase2">
      <div className="flex flex-col items-center text-center mb-20">
        {/* Badge Dinámico */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0FB888]/5 border border-[#0FB888]/10 text-[#0FB888] text-[0.65rem] font-black uppercase tracking-[3px] mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0FB888] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0FB888]"></span>
          </span>
          Fase 2 — Escalamiento
        </div>

        <h2 className="font-['Instrument_Serif',serif] text-[clamp(2.5rem,6vw,5rem)] text-[#0A1F1A] mb-8 font-normal leading-[1.05]">
          De verificación a <br />
          <em className="text-[#0FB888] italic px-2">Hospital en Casa</em>
        </h2>

        <p className="max-w-2xl text-[#4A6B62] text-xl font-light leading-relaxed">
          Una vez conectado el ecosistema, OLGA escala el modelo para habilitar 
          atención hospitalaria de alta complejidad fuera de la institución.
        </p>
      </div>

      {/* Grid con diseño mejorado */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="group relative p-10 rounded-[2.5rem] bg-white border border-[#0A1F1A]/5 hover:border-[#0FB888]/30 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(15,184,136,0.12)] flex flex-col items-start"
          >
            {/* Dot decorativo superior */}
            <div className={`absolute top-8 right-8 w-1.5 h-1.5 rounded-full ${card.accent} opacity-20 group-hover:opacity-100 transition-opacity`} />
            
            <div className="w-14 h-14 rounded-2xl bg-[#F0FBF6] text-[#0FB888] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#0FB888] group-hover:text-white transition-all duration-500 shadow-sm">
              <Ico id={card.id} className="w-7 h-7" />
            </div>
            
            <h4 className="text-[#0A1F1A] text-2xl font-bold mb-4 tracking-tight leading-tight">
              {card.title}
            </h4>
            
            <p className="text-[#4A6B62] text-[0.95rem] leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
              {card.desc}
            </p>

            {/* Línea decorativa inferior */}
            <div className="mt-8 w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-[#0FB888]/40 to-transparent transition-all duration-700" />
          </div>
        ))}
        
        {/* Card de Cierre / CTA Visual */}
        <div className="hidden lg:flex p-10 rounded-[2.5rem] bg-gradient-to-br from-[#0A1F1A] to-[#1a2e29] items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0FB888] via-transparent to-transparent" />
            </div>
            <div className="relative z-10">
                <div className="text-white font-bold text-xl">El futuro ya es real.</div>
            </div>
        </div>
      </div>

      {/* Banner de Autoridad Final */}
      <div className="bg-[#0A1F1A] rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-white text-3xl md:text-4xl font-normal font-['Instrument_Serif',serif] leading-tight mb-6">
              Inspirado en estándares <br />
              <span className="text-[#0FB888]">globales de salud.</span>
            </h3>
            <div className="flex gap-4 items-center">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">JAMA Clinical Update 2026</span>
            </div>
          </div>
          
          <div className="text-white/80 text-lg md:text-xl font-light leading-relaxed border-l border-white/10 md:pl-12">
            USA acaba de extender 5 años más su programa de <span className="text-white font-bold underline decoration-[#0FB888] underline-offset-4 tracking-tight">Hospital at Home</span>. 
            <br className="mb-4" />
            Lo que ocurre hoy en los sistemas más avanzados es la hoja de ruta de OLGA para Latinoamérica.
          </div>
        </div>
        
        {/* Decoración ambiental */}
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#0FB888]/20 blur-[120px] rounded-full" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
      </div>
    </section>
  );
};

export default PhaseTwo;