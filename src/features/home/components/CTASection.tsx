import React from 'react';

const Ico = ({ id, className = "w-4 h-4" }: { id: string, className?: string }) => (
  <svg className={`${className} fill-none stroke-currentColor stroke-[2]`}>
    <use href={`#${id}`} />
  </svg>
);

const CallToAction = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[#0A1F1A]" id="contacto">
      {/* Elementos decorativos de fondo para impacto visual */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#0FB888] blur-[120px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#0FB888] blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Encabezado con Instrument Serif y el estilo visual solicitado */}
        <h2 className="font-['Instrument_Serif',serif] text-[clamp(2.5rem,6vw,4.5rem)] text-white mb-8 font-normal leading-tight">
          ¿Listo para dar <em className="text-[#0FB888] italic text-[1.1em]">visibilidad</em> <br className="hidden md:block" /> a su ecosistema?
        </h2>

        <p className="text-white/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Conozca cómo OLGA puede transformar la coordinación del cuidado extramural en su organización.
        </p>

        {/* Botón Principal con efecto de brillo */}
        <div className="flex justify-center mb-20">
          <a 
            href="mailto:camilocortesu@gmail.com" 
            className="group relative inline-flex items-center gap-3 bg-[#0FB888] hover:bg-[#12d19b] text-[#0A1F1A] font-bold py-5 px-10 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(15,184,136,0.3)] hover:shadow-[0_0_30px_rgba(15,184,136,0.5)] active:scale-95"
          >
            Agendar una conversación
            <Ico id="i-arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Footer de la sección */}
        <div className="pt-12 border-t border-white/10">
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 text-sm font-medium text-white/50 mb-8 uppercase tracking-widest">
            <a href="https://olga.health" className="hover:text-[#0FB888] transition-colors">olga.health</a>
            <span className="hidden md:inline opacity-20">|</span>
            <a href="https://www.linkedin.com/in/camilocortesu/" target="_blank" rel="noopener" className="hover:text-[#0FB888] transition-colors">LinkedIn Personal</a>
            <span className="hidden md:inline opacity-20">|</span>
            <a href="https://www.linkedin.com/company/olga-healthtech" target="_blank" rel="noopener" className="hover:text-[#0FB888] transition-colors">OLGA en LinkedIn</a>
          </div>
          
          <p className="text-white/20 text-[10px] font-bold tracking-[0.2em] uppercase">
            © 2026 OLGA Healthtech S.A.S.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;