import React from 'react';

const Ico = ({ id }: { id: string }) => (
  <svg className="w-[1.15rem] h-[1.15rem] fill-none stroke-currentColor stroke-[1.75] stroke-linecap-round stroke-linejoin-round">
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
    <section id="problem" className="bg-[#F0FBF6] rounded-[24px] my-10 px-6 py-20 md:px-12 max-w-7xl mx-auto">
      {/* Etiqueta de sección */}
      <div className="text-[0.7rem] font-bold tracking-[3px] uppercase text-[#0FB888] mb-[14px]">
        El problema
      </div>

      {/* Título Principal */}
      <h2 className="font-['Instrument_Serif',serif] text-[clamp(2rem,4vw,3rem)] text-[#0A1F1A] mb-[14px] font-normal leading-tight">
        El <em className="text-[#0FB888] italic">Silencio Clínico</em> deteriora pacientes
      </h2>

      <p className="text-[#1F3A33] text-base md:text-[1rem] max-w-[720px] leading-[1.7] mb-11">
        Cuando un paciente sale del hospital, todos los actores quedan ciegos. La comunicación entre ellos se reduce a herramientas que no fueron diseñadas para coordinar cuidado de salud.
      </p>

      {/* Chaos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {problems.map((prob, index) => (
          <div 
            key={index} 
            className="bg-white/10 border border-[#0A1F1A]/10 rounded-[14px] p-[22px] transition-colors duration-200 hover:border-[#0FB888]/20 group"
          >
            <div className="w-9 h-9 rounded-[10px] bg-[#0FB888]/10 text-[#0FB888] flex items-center justify-center mb-[14px]">
              <Ico id={prob.id} />
            </div>
            <h4 className="text-[#0A1F1A] text-[0.92rem] font-semibold mb-1.5">
              {prob.title}
            </h4>
            <p className="text-[#4A6B62] text-[0.82rem] font-medium leading-[1.55]">
              {prob.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Silence Box */}
      <div className="bg-gradient-to-br from-[#3DDBA7]/[0.04] to-[#3DDBA7]/[0.01] border border-[#0FB888]/[0.22] rounded-[18px] p-9 text-center">
        <h3 className="font-['Instrument_Serif',serif] text-[1.9rem] text-[#0A1F1A] mb-2.5 leading-[1.3] font-normal">
          Hospital → Alta → <span className="text-[#E85D5D] italic font-medium">Silencio</span> → Urgencias
        </h3>
        <p className="text-[#4A6B62] text-[0.92rem] max-w-[640px] mx-auto leading-[1.65]">
          El paciente se deteriora en silencio. La familia está sola. El asegurador paga sin verificar. 
          El hospital no sabe qué pasó. Todos operan en la oscuridad.
        </p>
      </div>
    </section>
  );
};

export default ProblemSection;