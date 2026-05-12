import React from 'react';

const SolutionSection = () => {
  const steps = [
    {
      number: 1,
      title: "Solicitud y autorización",
      desc: "El hospital solicita servicios domiciliarios. El asegurador autoriza dentro de la plataforma. Sin correos, sin esperas.",
    },
    {
      number: 2,
      title: "Agendamiento inteligente",
      desc: "OLGA conecta al paciente con el prestador adecuado según disponibilidad, ubicación y especialidad. El prestador acepta o rechaza en la app.",
    },
    {
      number: 3,
      title: "Ejecución verificada",
      desc: "El profesional llega al domicilio. GPS confirma ubicación. Registra servicio con formulario estructurado. Captura signos vitales. El paciente firma digitalmente.",
    },
    {
      number: 4,
      title: "Visibilidad instantánea",
      desc: "Todos los actores ven el resultado en tiempo real: el hospital sabe que la visita ocurrió, el asegurador tiene evidencia verificable, la familia confirma el servicio.",
    },
    {
      number: 5,
      title: "Acción proactiva",
      desc: "Si los signos vitales muestran deterioro o un servicio no se cumplió, OLGA genera alertas automáticas. El equipo clínico actúa antes de que el paciente llegue a urgencias.",
    },
  ];

  return (
    <section 
      id="solution" 
      className="py-24 px-6 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Etiqueta de sección */}
      <div className="inline-block px-3 py-1 bg-[#0FB888]/10 text-[#0FB888] rounded-full text-[10px] font-bold tracking-[2px] uppercase mb-6">
        La solución
      </div>

      {/* Título */}
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#0A1F1A] mb-8 font-light leading-tight">
        OLGA reemplaza el silencio con <br />
        <em className="text-[#0FB888] italic">coordinación en tiempo real</em>
      </h2>

      <p className="text-[#4A6B62] text-lg md:text-xl max-w-3xl leading-relaxed font-light mb-20">
        Un flujo donde cada servicio es solicitado, autorizado, agendado, ejecutado, verificado y visible — todo dentro de una sola plataforma.
      </p>

      {/* Contenedor del Flujo Horizontal */}
      <div className="relative">
        {/* Línea de fondo (Desktop) */}
        <div className="absolute top-6 left-0 w-full h-[2px] bg-slate-100 hidden lg:block z-0" />

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-6 relative z-10 overflow-x-auto pb-8 scrollbar-hide">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 min-w-[280px] relative group">
              
              {/* Círculo con número y Línea conectora interna */}
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white bg-[#0FB888] shadow-lg shadow-[#0FB888]/20 group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>
                {/* Línea que conecta al siguiente (Solo visible en desktop) */}
                {index !== steps.length - 1 && (
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-[#0FB888] to-slate-100 hidden lg:block" />
                )}
              </div>

              {/* Contenido del paso */}
              <div className="pr-4">
                <h4 className="text-[#0A1F1A] text-xl font-bold mb-4 tracking-tight">
                  {step.title}
                </h4>
                <div className="w-10 h-1 bg-[#0FB888]/20 mb-4 rounded-full" />
                <p className="text-[#4A6B62] text-sm leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              {/* Línea vertical para móviles */}
              {index !== steps.length - 1 && (
                <div className="absolute left-6 top-12 w-[2px] h-12 bg-gradient-to-b from-[#0FB888] to-transparent lg:hidden" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;