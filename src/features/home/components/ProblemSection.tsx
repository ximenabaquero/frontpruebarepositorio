import React from 'react';

const Ico = ({ id }: { id: string }) => (
  <svg className="w-5 h-5 fill-none stroke-currentColor stroke-[1.5] stroke-linecap-round stroke-linejoin-round">
    <use href={`#${id}`} />
  </svg>
);

const ProblemSection = () => {
  const problems = [
    { id: 'i-mail', title: 'Correos electrónicos', desc: 'Solicitudes de autorización, aceptaciones, y reportes que llegan días después — si es que llegan.' },
    { id: 'i-msg', title: 'Grupos de WhatsApp', desc: 'Auditores, coordinadores y prestadores intercambian información crítica en chats que se pierden entre mensajes.' },
    { id: 'i-sheet', title: 'Cuadros de turnos en Excel', desc: 'La programación de visitas vive en hojas de cálculo que nadie más puede ver en tiempo real.' },
    { id: 'i-phone', title: 'Llamadas sin registro', desc: 'Coordinaciones telefónicas que no quedan documentadas. Si alguien pregunta qué pasó, nadie tiene el dato.' },
    { id: 'i-ghost', title: 'Visitas fantasma', desc: 'Servicios que se reportan como prestados pero nadie verifica si el profesional realmente llegó al domicilio.' },
    { id: 'i-hourglass', title: 'Pérdida de trazabilidad', desc: 'El paciente desaparece del radar clínico. Nadie sabe si mejoró, empeoró, o necesita intervención urgente.' },
  ];

  return (
    <section id="problem" className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabecera de la sección */}
        <div className="mb-16">
          <div className="inline-block px-3 py-1 bg-[#0FB888]/10 text-[#0FB888] rounded-full text-[10px] font-bold tracking-[2px] uppercase mb-6">
            El problema
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#0A1F1A] mb-8 font-light leading-tight">
            El <em className="text-[#0FB888] italic">Silencio Clínico</em> deteriora pacientes
          </h2>
          <p className="text-[#4A6B62] text-lg md:text-xl max-w-3xl leading-relaxed font-light">
            Cuando un paciente sale del hospital, todos los actores quedan ciegos. La comunicación entre ellos se reduce a herramientas que no fueron diseñadas para coordinar cuidado de salud.
          </p>
        </div>

        {/* Chaos Grid - Tarjetas Modernas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {problems.map((prob, index) => (
            <div 
              key={index} 
              className="group bg-[#F8FAFC] border border-slate-100 rounded-[28px] p-8 transition-all duration-300 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:border-[#0FB888]/20"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm text-[#0FB888] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#0FB888] group-hover:text-white">
                <Ico id={prob.id} />
              </div>
              <h4 className="text-[#0A1F1A] text-lg font-bold mb-3 tracking-tight">
                {prob.title}
              </h4>
              <p className="text-[#4A6B62] text-sm leading-relaxed font-normal">
                {prob.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Silence Box - Impacto Visual */}
        <div className="relative overflow-hidden bg-[#0A1F1A] rounded-[40px] p-10 md:p-16 text-center shadow-2xl">
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0FB888]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0FB888]/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <h3 className="relative z-10 font-serif text-3xl md:text-4xl text-white mb-6 leading-tight font-light">
            Hospital → Alta → <span className="text-[#FF6B6B] italic font-normal">Silencio</span> → Urgencias
          </h3>
          <p className="relative z-10 text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            El paciente se deteriora en silencio. La familia está sola. El asegurador paga sin verificar. 
            El hospital no sabe qué pasó. Todos operan en la oscuridad.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;