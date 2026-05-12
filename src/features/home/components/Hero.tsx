import React from 'react';

// Si usas Google Fonts en Next.js, asegúrate de importar una fuente con serifa como 'Playfair Display' o similar.
// Aquí aplicaremos 'font-serif' de Tailwind.

const OlgaHero = () => {
  return (
    <div className="min-h-screen bg-[#F9FBFB] font-sans text-[#1A2E2E]">


      {/* HERO SECTION */}
      <section className="pt-48 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2BB38E] mb-10">
            The Operating System for Care Outside the Hospital
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[84px] font-serif font-light text-[#1A2E2E] mb-10 leading-[1.05] tracking-tight">
            Nadie sabe qué pasa con el paciente <br />
            entre el <span className="italic text-[#2BB38E]">hospital y su casa.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#4A5E5E] font-light leading-relaxed mb-24">
            Una plataforma donde hospitales, aseguradores, prestadores y familias se ven, se conectan y coordinan — para que el paciente nunca esté solo.
          </p>

          {/* STATS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-slate-200 pt-16">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-light text-[#2BB38E] mb-4">67%</div>
              <div className="text-[11px] leading-relaxed uppercase tracking-widest text-[#6B7C7C] max-w-[150px]">
                de urgencias en LATAM son prevenibles
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-5xl font-light text-[#2BB38E] mb-4">85%</div>
              <div className="text-[11px] leading-relaxed uppercase tracking-widest text-[#6B7C7C] max-w-[150px]">
                de pacientes sin monitoreo entre citas
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-5xl font-light text-[#2BB38E] mb-4">$2,500</div>
              <div className="text-[11px] leading-relaxed uppercase tracking-widest text-[#6B7C7C] max-w-[150px]">
                USD costo promedio por evento prevenible
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-5xl font-light text-[#2BB38E] mb-4">0</div>
              <div className="text-[11px] leading-relaxed uppercase tracking-widest text-[#6B7C7C] max-w-[150px]">
                plataformas que integren todo el ecosistema en LATAM
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OlgaHero;