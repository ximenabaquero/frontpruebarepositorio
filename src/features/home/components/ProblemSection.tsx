import React from 'react';

// El SVG wrapper no pone fill — cada symbol define el suyo propio
const Ico = ({ id }: { id: string }) => (
  <svg className="w-5 h-5">
    <use href={`#${id}`} />
  </svg>
);

const ProblemSection = () => {
  const problems = [
    { id: 'i-mail',      title: 'Correos electrónicos',      desc: 'Solicitudes de autorización, aceptaciones, y reportes que llegan días después — si es que llegan.' },
    { id: 'i-msg',       title: 'Grupos de WhatsApp',        desc: 'Auditores, coordinadores y prestadores intercambian información crítica en chats que se pierden entre mensajes.' },
    { id: 'i-sheet',     title: 'Cuadros de turnos en Excel', desc: 'La programación de visitas vive en hojas de cálculo que nadie más puede ver en tiempo real.' },
    { id: 'i-phone',     title: 'Llamadas sin registro',     desc: 'Coordinaciones telefónicas que no quedan documentadas. Si alguien pregunta qué pasó, nadie tiene el dato.' },
    { id: 'i-ghost',     title: 'Visitas fantasma',          desc: 'Servicios que se reportan como prestados pero nadie verifica si el profesional realmente llegó al domicilio.' },
    { id: 'i-hourglass', title: 'Pérdida de trazabilidad',   desc: 'El paciente desaparece del radar clínico. Nadie sabe si mejoró, empeoró, o necesita intervención urgente.' },
  ];

  return (
    <section id="problem" className="bg-white py-24 px-6">

      {/* ── SVG Sprite (oculto) ── */}
      <svg aria-hidden="true" style={{ display: 'none' }}>
        {/* Correos */}
        <symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 7l10 7 10-7" />
        </symbol>

        {/* WhatsApp — logo oficial fill */}
        <symbol id="i-msg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.849L0 24l6.335-1.51A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.368l-.36-.214-3.724.888.923-3.629-.234-.373A9.784 9.784 0 012.182 12C2.182 6.697 6.697 2.182 12 2.182S21.818 6.697 21.818 12 17.303 21.818 12 21.818z" />
        </symbol>

        {/* Excel / tabla */}
        <symbol id="i-sheet" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </symbol>

        {/* Teléfono */}
        <symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </symbol>

        {/* Fantasma */}
        <symbol id="i-ghost" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 10h.01M15 10h.01M12 2a8 8 0 018 8v10l-3-2-2 2-2-2-2 2-2-2-3 2V10a8 8 0 018-8z" />
        </symbol>

        {/* Reloj de arena */}
        <symbol id="i-hourglass" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 22h14M5 2h14" />
          <path d="M17 22v-4.172a2 2 0 00-.586-1.414L12 12M7 22v-4.172a2 2 0 01.586-1.414L12 12" />
          <path d="M7 2v4.172a2 2 0 00.586 1.414L12 12M17 2v4.172a2 2 0 01-.586 1.414L12 12" />
        </symbol>
      </svg>

      <div className="max-w-7xl mx-auto">

        {/* Cabecera */}
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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          {problems.map((prob, index) => (
            <div
              key={index}
              className="group bg-[#F8FAFC] border border-slate-100 rounded-[28px] p-8 transition-all duration-300 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:border-[#0FB888]/20"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm text-[#0FB888] flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#0FB888] group-hover:text-white">
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

        {/* Silence Box */}
        <div className="relative overflow-hidden bg-[#0A1F1A] rounded-[40px] p-10 md:p-16 text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0FB888]/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0FB888]/5 rounded-full blur-3xl -ml-32 -mb-32" />
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
