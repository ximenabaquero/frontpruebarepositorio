import React from 'react';

// 1. Contratos claros. Si no defines la forma de tus datos, estás programando a ciegas.
interface Metric {
  id: string;
  value: string;
  label: string;
}

// 2. Extraer datos estáticos. Dejar esto dentro del componente hace que React 
// reasigne memoria en cada renderizado. Ineficiencia pura.
const HERO_METRICS: Metric[] = [
  {
    id: 'metric-preventable-er',
    value: 'USD 14.5B',
    label: 'en cuidado domiciliario pagados sin verificación electrónica en NY en un año'
  },
  {
    id: 'metric-unmonitored',
    value: '10%',
    label: 'de pacientes reingresan al hospital dentro de los 30 días post-alta en Colombia'
  },
  { 
    id: 'metric-cost', 
    value: '$2,500', 
    label: 'USD costo promedio por evento prevenible' 
  },
  { 
    id: 'metric-integration', 
    value: '0', 
    label: 'plataformas que integren todo el ecosistema en LATAM' 
  },
];

const OlgaHero: React.FC = () => {
  return (
    <div id="Inicio" className="relative min-h-screen font-sans text-white overflow-hidden flex items-center">
      
      {/* BACKGROUND IMAGE WITH OVERLAY */}
      {/* aria-hidden="true" porque esta imagen es puramente decorativa. No satures a los screen readers. */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('C:\\Proyectos\\Olga\\olga-demo-front\\public\\imagenhero.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#1A2E2E]/85 backdrop-blur-[2px]" />
      </div>

      {/* HERO SECTION CONTENT */}
      <section className="relative z-10 w-full pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* LEFT SIDE: TITLES AND SUBTITLES */}
            <div className="lg:col-span-7 text-left">
              {/* Cambiado de div a p. Un subtítulo descriptivo es un párrafo, no un contenedor genérico. */}
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2BB38E] mb-6">
                The Operating System for Care Outside the Hospital
              </p>
              
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
              {/* HTML Semántico: Un grupo de términos y descripciones (estadísticas) pertenece a un Definition List (<dl>), no a un div. */}
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-[32px] border border-white/10 shadow-2xl">
                {HERO_METRICS.map((metric) => (
                  <div key={metric.id} className="flex flex-col text-left">
                    {/* <dt> define el término (label) y <dd> el dato (value). Flex-col + order invierte el orden visual sin romper la semántica. */}
                    <dt className="order-2 text-[10px] leading-relaxed uppercase tracking-widest text-slate-300 mt-3">
                      {metric.label}
                    </dt>
                    <dd className={`order-1 font-light text-[#2BB38E] m-0 ${metric.value.length > 6 ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'}`}>
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default OlgaHero;