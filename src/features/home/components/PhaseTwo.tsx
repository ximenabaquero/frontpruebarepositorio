import React from 'react';

// Reutilizamos el componente Ico para mantener consistencia visual
const Ico = ({ id, className = "w-6 h-6" }: { id: string, className?: string }) => (
  <svg className={`${className} fill-none stroke-currentColor stroke-[1.5]`}>
    <use href={`#${id}`} />
  </svg>
);

const PhaseTwo = () => {
  const cards = [
    { id: 'i-activity', title: 'Monitoreo IoT continuo', desc: 'Dispositivos médicos certificados en casa del paciente. Signos vitales 24/7 sin depender de visitas.' },
    { id: 'i-brain', title: 'Cerebro clínico', desc: 'Triage inteligente con protocolos por patología. Alertas predictivas antes del deterioro.' },
    { id: 'i-stethoscope', title: 'Panel de enfermería 24/7', desc: 'Equipo clínico monitoreando pacientes en tiempo real desde un centro de comando virtual.' },
    { id: 'i-hospital', title: 'Hospital en Casa', desc: 'Atención hospitalaria completa en el domicilio. El paciente nunca pisa urgencias si no es necesario.' },
    { id: 'i-trending', title: 'Inteligencia de datos', desc: 'Análisis poblacional, modelos predictivos, y evidencia clínica para todo el ecosistema.' },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto" id="future">
      {/* Etiqueta de Sección */}
      <div className="inline-block text-[#0FB888] text-[0.7rem] font-bold tracking-[3px] uppercase mb-6">
        Fase 2 — Escalamiento
      </div>

      {/* Encabezado con Instrument Serif y el estilo solicitado */}
      <h2 className="font-['Instrument_Serif',serif] text-[clamp(2rem,4vw,3.5rem)] text-[#0A1F1A] mb-6 font-normal leading-[1.1]">
        De verificación a <em className="text-[#0FB888] italic">Hospital en Casa</em>
      </h2>

      <p className="max-w-2xl text-[#4A6B62] text-lg mb-16 leading-relaxed">
        Una vez que el ecosistema está conectado y cada servicio verificado, OLGA escala el modelo para habilitar atención hospitalaria completa fuera de la institución.
      </p>

      {/* Grid de Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="group p-8 rounded-[2rem] bg-[#F0FBF6] border border-[#0FB888]/5 hover:border-[#0FB888]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#0FB888]/5"
          >
            <div className="w-12 h-12 rounded-xl bg-white text-[#0FB888] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <Ico id={card.id} />
            </div>
            <h4 className="text-[#0A1F1A] text-xl font-bold mb-3">{card.title}</h4>
            <p className="text-[#4A6B62] text-sm leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Nota de Contexto Global */}
      <div className="bg-[#0A1F1A] rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden text-center md:text-left">
        <div className="relative z-10">
          <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed max-w-4xl">
            USA acaba de extender 5 años más su programa de <span className="text-[#0FB888] font-medium">Hospital at Home</span> (JAMA, abril 2026). <br className="hidden md:block" />
            Esto se viene para Latinoamérica. OLGA es la infraestructura que lo hace posible.
          </p>
        </div>
        
        {/* Decoración sutil de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0FB888]/10 blur-[100px] rounded-full -mr-20 -mt-20" />
      </div>
    </section>
  );
};

export default PhaseTwo;