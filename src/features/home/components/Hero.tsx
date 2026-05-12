import React from 'react';

const OlgaHero = () => {
  return (
    <div id='Inicio' className="relative min-h-screen font-sans text-white overflow-hidden flex items-center">
      
      {/* BACKGROUND IMAGE WITH OVERLAY */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#1A2E2E]/85 backdrop-blur-[2px]"></div>
      </div>

      {/* HERO SECTION CONTENT */}
      <section className="relative z-10 w-full pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* LEFT SIDE: TITLES AND SUBTITLES */}
            <div className="lg:col-span-7 text-left">
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2BB38E] mb-6">
                The Operating System for Care Outside the Hospital
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-[72px] font-serif font-light text-white mb-8 leading-[1.1] tracking-tight">
                Nadie sabe qué pasa con el paciente <br />
                entre el <span className="italic text-[#2BB38E]">hospital y su casa.</span>
              </h1>

              <p className="max-w-xl text-lg md:text-xl text-slate-200 font-light leading-relaxed">
                Una plataforma donde hospitales, aseguradores, prestadores y familias se ven, se conectan y coordinan — para que el paciente nunca esté solo.
              </p>
            </div>

            {/* RIGHT SIDE: STATS */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-[32px] border border-white/10 shadow-2xl">
                
                <div className="flex flex-col text-left">
                  <div className="text-4xl md:text-5xl font-light text-[#2BB38E] mb-3">67%</div>
                  <div className="text-[10px] leading-relaxed uppercase tracking-widest text-slate-300">
                    de urgencias en LATAM son prevenibles
                  </div>
                </div>

                <div className="flex flex-col text-left">
                  <div className="text-4xl md:text-5xl font-light text-[#2BB38E] mb-3">85%</div>
                  <div className="text-[10px] leading-relaxed uppercase tracking-widest text-slate-300">
                    de pacientes sin monitoreo entre citas
                  </div>
                </div>

                <div className="flex flex-col text-left">
                  <div className="text-4xl md:text-5xl font-light text-[#2BB38E] mb-3">$2,500</div>
                  <div className="text-[10px] leading-relaxed uppercase tracking-widest text-slate-300">
                    USD costo promedio por evento prevenible
                  </div>
                </div>

                <div className="flex flex-col text-left">
                  <div className="text-4xl md:text-5xl font-light text-[#2BB38E] mb-3">0</div>
                  <div className="text-[10px] leading-relaxed uppercase tracking-widest text-slate-300">
                    plataformas que integren todo el ecosistema en LATAM
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default OlgaHero;