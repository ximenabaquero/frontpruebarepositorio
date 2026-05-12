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
      className="min-h-screen flex flex-col justify-center py-20 px-10 max-w-[1200px] mx-auto relative"
    >
      {/* Etiqueta de sección */}
      <div className="text-[0.7rem] font-bold tracking-[3px] uppercase text-[#0FB888] mb-[14px]">
        La solución
      </div>

      {/* Título */}
      <h2 className="font-['Instrument_Serif',serif] text-[clamp(2rem,4vw,3rem)] text-[#0A1F1A] mb-[10px] font-normal leading-tight">
        OLGA reemplaza el silencio con <em className="text-[#0FB888] italic">coordinación en tiempo real</em>
      </h2>

      <p className="text-[#1F3A33] text-[1rem] max-w-[720px] leading-[1.7] mb-11">
        Un flujo donde cada servicio es solicitado, autorizado, agendado, ejecutado, verificado y visible — todo dentro de una sola plataforma.
      </p>

      {/* Contenedor del Flujo */}
      <div className="relative flex flex-col gap-0">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-[22px] relative py-[22px]">
            
            {/* Círculo con número */}
            <div className="w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center text-[0.9rem] font-bold text-[#FAFDFB] bg-[#0FB888] relative z-10 font-['DM_Sans',sans-serif]">
              {step.number}
            </div>

            {/* Línea conectora (No se muestra en el último paso) */}
            {index !== steps.length - 1 && (
              <div className="absolute left-[19px] top-[46px] w-[2px] h-[calc(100%-24px)] bg-gradient-to-b from-[#0FB888] to-[#0FB888]/[0.22]" />
            )}

            {/* Contenido del paso */}
            <div className="pt-2">
              <h4 className="text-[#0A1F1A] text-[1rem] font-semibold mb-1.5">
                {step.title}
              </h4>
              <p className="text-[#4A6B62] text-[0.86rem] leading-[1.6]">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SolutionSection;