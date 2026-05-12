import React from 'react';

// Componente Interno de Iconos para asegurar independencia
const Ico = ({ id, className = "w-6 h-6" }: { id: string, className?: string }) => (
  <svg className={`${className} fill-none stroke-currentColor stroke-[1.75]`} strokeLinecap="round" strokeLinejoin="round">
    <use href={`#${id}`} />
  </svg>
);

const FeaturesSection = () => {
  const features = [
    { id: "i-pin", title: "Geofencing", desc: "Verificación GPS automática de que el profesional llegó al domicilio del paciente." },
    { id: "i-pencil", title: "Firma digital", desc: "El paciente confirma cada servicio recibido directamente en la plataforma." },
    { id: "i-bell", title: "Alertas clínicas", desc: "Semáforo Verde/Amarillo/Rojo con escalamiento automático si hay deterioro." },
    { id: "i-bars", title: "Dashboards en tiempo real", desc: "Cada actor ve lo que necesita. Métricas, servicios, pacientes, costos." },
    { id: "i-link", title: "Comunicación bidireccional", desc: "Hospital ↔ Asegurador ↔ Prestador ↔ Paciente. Todo trazable, todo documentado." },
    { id: "i-shield-check", title: "Anti-fraude", desc: "Detección automática de visitas fantasma, servicios simultáneos, y anomalías." },
    { id: "i-calendar", title: "Agendamiento inteligente", desc: "Matching paciente-prestador por disponibilidad, ubicación y especialidad." },
    { id: "i-smartphone", title: "App móvil (PWA)", desc: "Los profesionales en campo gestionan todo desde su celular. Sin instalar nada." },
    { id: "i-star", title: "Scoring de prestadores", desc: "Calidad medible: tiempo de respuesta, completitud, satisfacción, compliance GPS." }
  ];

  return (
    <section className="py-24 bg-[#0A1F1A] text-white overflow-hidden relative" id="features">
      {/* Efectos de fondo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0FB888]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16">
          <div className="inline-block text-[#0FB888] text-[0.7rem] font-bold tracking-[3px] uppercase mb-4">
            Capacidades de la plataforma
          </div>
          
          <h2 className="font-['Instrument_Serif',serif] text-[clamp(2.2rem,5vw,3.8rem)] text-white mb-6 font-normal leading-[1.1]">
            Todo conectado. Todo <em className="text-[#0FB888] italic">verificable.</em>
          </h2>
          
          <p className="max-w-2xl text-white/60 text-[1.1rem] leading-relaxed font-light">
            Comunicación bidireccional, verificación automática, y visibilidad en tiempo real para cada actor del ecosistema.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              className="group bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-[#0FB888]/30 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0FB888] text-white flex items-center justify-center mb-6 shadow-lg shadow-[#0FB888]/20 group-hover:scale-110 transition-transform duration-500">
                <Ico id={feat.id} className="w-6 h-6" />
              </div>
              
              <h4 className="text-xl font-bold text-white mb-3 tracking-tight">
                {feat.title}
              </h4>
              
              <p className="text-white/40 text-[0.95rem] leading-relaxed group-hover:text-white/70 transition-colors duration-500">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;