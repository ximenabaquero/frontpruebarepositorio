import React from 'react';

const Ico = ({ id, className = "w-4 h-4", style }: { id: string, className?: string, style?: React.CSSProperties }) => (
  <svg className={`${className} fill-none stroke-currentColor stroke-[1.75]`} style={style}>
    <use href={`#${id}`} />
  </svg>
);

const Benefit = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 min-w-[40px] rounded-lg bg-[#0FB888]/10 text-[#0FB888] flex items-center justify-center">
      <Ico id={icon} className="w-5 h-5" />
    </div>
    <div>
      <h5 className="text-[#0A1F1A] text-[0.95rem] font-bold mb-1">{title}</h5>
      <p className="text-[#4A6B62] text-[0.85rem] leading-snug">{desc}</p>
    </div>
  </div>
);

const OlgaPlatform = () => {
  return (
    <div className="bg-white">
      {/* PLATFORM SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto" id="platform">
        <div className="inline-block px-3 py-1 rounded-full bg-[#0FB888]/10 text-[#0FB888] text-[0.7rem] font-black uppercase tracking-[0.3em] mb-6">
          La plataforma
        </div>
        <h2 className="text-5xl md:text-6xl font-serif italic text-gray-900 mb-20 leading-[1.1]">
          Lo que ve cada actor en <span className="text-[#0FB888] not-italic font-sans uppercase tracking-tighter">OLGA</span>
        </h2>

        {/* PAYER BLOCK */}
        <div className="mb-32">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-[#0A1F1A] text-white flex items-center justify-center shadow-xl shadow-black/10">
              <Ico id="i-shield" className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#0A1F1A]">Asegurador (EPS / Prepagada)</div>
              <div className="text-[#4A6B62] text-sm">Verificación en tiempo real · Eliminación de fraude · Visibilidad poblacional</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 bg-[#1A2E29] rounded-[2rem] p-6 border border-white/5 shadow-2xl">
              <div className="flex gap-1.5 mb-6 opacity-30">
                <div className="w-2 h-2 rounded-full bg-white" /><div className="w-2 h-2 rounded-full bg-white" /><div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="text-[#0FB888] text-[9px] font-black uppercase mb-1">Verificados hoy</div>
                  <div className="text-2xl font-bold text-white leading-none">142</div>
                  <div className="text-[9px] text-white/40 mt-1">servicios confirmados</div>
                  <div className="h-1 bg-white/10 rounded-full mt-3 overflow-hidden"><div className="h-full bg-[#0FB888] w-[94%]" /></div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="text-red-400 text-[9px] font-black uppercase mb-1">Alertas fraude</div>
                  <div className="text-2xl font-bold text-white leading-none">3</div>
                  <div className="text-[9px] text-white/40 mt-1 text-red-400/60">flagged para revisión</div>
                  <div className="h-1 bg-white/10 rounded-full mt-3 overflow-hidden"><div className="h-full bg-red-400 w-[12%]" /></div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="text-teal-300 text-[9px] font-black uppercase mb-1">Urgencias evitadas</div>
                  <div className="text-2xl font-bold text-white leading-none">28</div>
                  <div className="text-[9px] text-white/40 mt-1">este mes</div>
                  <div className="h-1 bg-white/10 rounded-full mt-3 overflow-hidden"><div className="h-full bg-teal-300 w-[72%]" /></div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="text-orange-300 text-[9px] font-black uppercase mb-1">Ahorro</div>
                  <div className="text-2xl font-bold text-white leading-none">$86M</div>
                  <div className="text-[9px] text-white/40 mt-1 text-orange-300/60">COP este trimestre</div>
                  <div className="h-1 bg-white/10 rounded-full mt-3 overflow-hidden"><div className="h-full bg-orange-300 w-[68%]" /></div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                  <div className="text-white/40 text-[9px] font-black uppercase mb-4">Mapa de verificación GPS</div>
                  <div className="h-20 bg-[#0FB888]/10 rounded-xl flex items-center justify-center gap-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0FB888] shadow-[0_0_8px_rgba(61,219,167,.6)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0FB888] shadow-[0_0_8px_rgba(61,219,167,.6)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,138,138,.6)]" />
                  </div>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                  <div className="text-white/40 text-[9px] font-black uppercase mb-4">Facturación verificada</div>
                  <ul className="text-[11px] text-white/70 space-y-2">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0FB888]"/> 142 verificados — listos para facturar</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400"/> 8 pendientes firma paciente</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0FB888]"/> $18.4M COP facturable</li>
                    <li className="flex items-center gap-2 text-[#0FB888] font-bold"><span className="w-1.5 h-1.5 rounded-full bg-[#0FB888]"/> 100% soportado con evidencia</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <Benefit icon="i-check" title="Cero visitas fantasma" desc="Cada servicio verificado con GPS, timestamp, firma digital y evidencia clínica fotográfica." />
              <Benefit icon="i-dollar" title="Facturación con evidencia" desc="Cada servicio soportado con verificación GPS, firma digital y registro clínico. Sin discusiones." />
              <Benefit icon="i-search" title="Detección de fraude" desc="Alertas automáticas: GPS que nunca llegó, servicios simultáneos, notas sin visita." />
              <Benefit icon="i-bars" title="Vigilancia poblacional proactiva" desc="Dashboard de toda la población domiciliaria. Riesgo, adherencia, costos en tiempo real." />
              <Benefit icon="i-trending" title="Reducción de siniestralidad" desc="Menos reingresos a urgencias = menor costo por afiliado." />
            </div>
          </div>
        </div>

        {/* HOSPITAL BLOCK */}
        <div className="mb-32">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-[#0FB888] text-white flex items-center justify-center">
              <Ico id="i-hospital" className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#0A1F1A]">Hospital / Clínica</div>
              <div className="text-[#4A6B62] text-sm">Visibilidad post-alta · Giro cama · Continuidad del cuidado</div>
            </div>
          </div>
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 border border-[#0A1F1A]/5 shadow-xl">
              <div className="flex gap-1.5 mb-6 opacity-10">
                <div className="w-2 h-2 rounded-full bg-black" /><div className="w-2 h-2 rounded-full bg-black" /><div className="w-2 h-2 rounded-full bg-black" />
              </div>
              <div className="bg-[#0A1F1A]/[0.02] rounded-2xl p-5 border border-black/5 mb-4">
                <div className="text-[#0FB888] text-[10px] font-black uppercase mb-4">Pacientes post-alta en seguimiento</div>
                <ul className="space-y-4 text-xs font-medium">
                  <li className="flex items-center justify-between border-b border-black/[0.03] pb-3">
                    <span className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#0FB888]"/> María G. — Estable — Día 12</span>
                    <span className="opacity-40 text-[10px]">Hace 2h</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-black/[0.03] pb-3">
                    <span className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-yellow-400"/> Carlos R. — Vigilar — Día 5</span>
                    <span className="text-red-500 font-bold">PA elevada</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-black/[0.03] pb-3">
                    <span className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#0FB888]"/> Ana P. — Estable — Día 21</span>
                    <span className="opacity-40 text-[10px]">Alta lista</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-3 font-bold text-red-600 animate-pulse"><span className="w-2 h-2 rounded-full bg-red-600"/> Luis M. — Urgente — Día 3</span>
                    <span className="opacity-40 text-[10px]">Equipo contactado</span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0A1F1A]/[0.04] p-5 rounded-2xl">
                  <div className="text-[#4A6B62] text-[9px] font-black uppercase mb-1 text-indigo-500">Reingreso 30d</div>
                  <div className="text-3xl font-bold text-[#0A1F1A]">6.4%</div>
                  <div className="text-[10px] text-[#4A6B62] mt-1">vs. 28.9% promedio nacional</div>
                </div>
                <div className="bg-[#0A1F1A]/[0.04] p-5 rounded-2xl">
                  <div className="text-[#0FB888] text-[9px] font-black uppercase mb-1">Plan de cuidado</div>
                  <div className="text-3xl font-bold text-[#0A1F1A]">91%</div>
                  <div className="text-[10px] text-[#4A6B62] mt-1">servicios completados a tiempo</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <Benefit icon="i-eye" title="El paciente nunca desaparece" desc="Visibilidad continua después del alta. Semáforo clínico Verde/Amarillo/Rojo." />
              <Benefit icon="i-refresh" title="Mayor giro cama" desc="Alta temprana segura con seguimiento garantizado. Libera camas para pacientes agudos." />
              <Benefit icon="i-clipboard" title="Cumplimiento del plan de cuidado" desc="Ver en tiempo real si los servicios ordenados se están cumpliendo." />
              <Benefit icon="i-zap" title="Alertas antes del reingreso" desc="Intervenir antes de que el paciente se deteriore y vuelva a urgencias." />
              <Benefit icon="i-trending" title="Indicadores de calidad" desc="Tasa de reingreso, adherencia, outcomes clínicos — documentados automáticamente." />
            </div>
          </div>
        </div>

        {/* PROVIDER BLOCK */}
        <div className="mb-32 bg-[#F0FBF6] rounded-[3rem] p-10 md:p-16 border border-[#0FB888]/10">
          <div className="flex items-center gap-5 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-[#0FB888] text-white flex items-center justify-center"><Ico id="i-stethoscope" className="w-7 h-7" /></div>
            <div>
              <div className="text-xl font-bold text-[#0A1F1A]">Prestador Extramural (IPS Domiciliaria)</div>
              <div className="text-[#4A6B62] text-sm">Dashboard de operaciones + App móvil para profesionales en campo</div>
            </div>
          </div>
          
          <div className="text-[#0FB888] text-[0.65rem] font-black uppercase tracking-[0.3em] mb-8">Dashboard de operaciones</div>
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 bg-[#0A1F1A] rounded-[2rem] p-6 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-[#0FB888] text-[9px] font-bold uppercase mb-1">En campo hoy</div>
                  <div className="text-xl font-bold text-white leading-none">24</div>
                  <div className="text-[9px] text-white/30 mt-1 leading-tight">profesionales activos</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-indigo-400 text-[9px] font-bold uppercase mb-1">Visitas</div>
                  <div className="text-xl font-bold text-white leading-none">87</div>
                  <div className="text-[9px] text-white/30 mt-1 leading-tight">programadas — 52 completadas</div>
                  <div className="h-1 bg-white/10 rounded-full mt-3 overflow-hidden"><div className="h-full bg-teal-400 w-[60%]" /></div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-orange-400 text-[9px] font-bold uppercase mb-1">Compliance</div>
                  <div className="text-xl font-bold text-white leading-none">94%</div>
                  <div className="text-[9px] text-white/30 mt-1 leading-tight">GPS verificado a tiempo</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-[#0FB888] text-[9px] font-bold uppercase mb-1">Score</div>
                  <div className="text-xl font-bold text-white leading-none">4.7</div>
                  <div className="text-[9px] text-white/30 mt-1 leading-tight">satisfacción paciente</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                  <div className="text-white/30 text-[9px] font-black uppercase mb-4">Estado del equipo</div>
                  <ul className="text-[10px] text-white/70 space-y-2.5">
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#0FB888] shadow-[0_0_6px_#0FB888]"/> Sandra M. — En ruta visita 3/5</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#0FB888] shadow-[0_0_6px_#0FB888]"/> Jorge L. — En domicilio (GPS)</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400"/> Diana R. — Retrasada 15 min</li>
                  </ul>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-white/70">
                  <div className="text-white/30 text-[9px] font-black uppercase mb-4">Facturación</div>
                  <ul className="text-[10px] space-y-2.5">
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#0FB888]"/> 142 servicios listos para cobrar</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#0FB888]"/> $18.4M COP facturable</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#0FB888]"/> 0 rechazados — 100% verificado</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <Benefit icon="i-smartphone" title="Gestión centralizada" desc="Todo su equipo visible en una pantalla. Quién está dónde, qué falta, qué va retrasado." />
              <Benefit icon="i-dollar" title="Facturación sin fricción" desc="Cada servicio tiene evidencia verificable. Cobren todo lo que prestan." />
              <Benefit icon="i-pin" title="Bajo costo de adquisición" desc="Reciban pacientes desde la plataforma sin invertir en marketing ni relacionamiento." />
              <Benefit icon="i-star" title="Reputación medible" desc="Score de calidad visible para aseguradores. Los mejores prestadores ganan más pacientes." />
            </div>
          </div>

          <div className="text-[#0FB888] text-[0.65rem] font-black uppercase tracking-[0.3em] mb-12 mt-20 text-center">App del profesional en campo</div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="w-[260px] h-[480px] bg-[#0A1F1A] rounded-[3rem] border-[8px] border-[#1f3a33] p-6 shadow-2xl flex flex-col relative overflow-hidden">
               <div className="text-white text-xs font-bold mb-6">Visitas de hoy</div>
               <div className="bg-white/5 p-4 rounded-2xl mb-3">
                 <div className="flex justify-between text-[11px] text-white font-bold"><span>María García</span> <span className="text-[#0FB888]">9:00 AM</span></div>
                 <div className="text-[9px] text-white/30 mt-1">Cra 45 #32-12</div>
               </div>
               <div className="bg-white/10 p-4 rounded-2xl mb-3 border border-[#0FB888]/40 shadow-lg shadow-[#0FB888]/10 ring-1 ring-[#0FB888]/20">
                 <div className="flex justify-between text-[11px] text-white font-bold"><span>Carlos Ruiz</span> <span className="text-orange-400 animate-pulse uppercase">Ahora</span></div>
                 <div className="text-[9px] text-white/30 mt-1">Cll 52 #28-45</div>
                 <button className="w-full mt-4 bg-[#0FB888] text-white text-[10px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2">
                   Iniciar Visita <Ico id="i-arrow-right" className="w-3 h-3" />
                 </button>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl opacity-40">
                 <div className="flex justify-between text-[11px] text-white font-bold"><span>Ana Pérez</span> <span className="text-white/30">2:30 PM</span></div>
               </div>
            </div>

            <div className="w-[260px] h-[480px] bg-white rounded-[3rem] border-[8px] border-[#e2f0e9] p-6 shadow-2xl flex flex-col relative overflow-hidden mt-8 md:mt-16">
              <div className="text-[#0A1F1A] text-xs font-bold mb-4">Visita activa — Carlos Ruiz</div>
              <div className="bg-[#0FB888]/10 p-3 rounded-2xl flex items-center gap-2 mb-4 text-[#0FB888] font-bold text-[10px]">
                <Ico id="i-check" className="w-3.5 h-3.5" /> GPS Verificado
              </div>
              <div className="bg-[#0A1F1A]/[0.03] p-4 rounded-2xl mb-4">
                 <div className="text-[9px] font-black text-gray-400 uppercase mb-3">Signos vitales</div>
                 <div className="flex justify-between text-center">
                    <div><div className="text-xs font-bold text-[#0A1F1A]">128/82</div><div className="text-[8px] opacity-40 font-bold uppercase">PA</div></div>
                    <div><div className="text-xs font-bold text-[#0A1F1A]">72</div><div className="text-[8px] opacity-40 font-bold uppercase">FC</div></div>
                    <div><div className="text-xs font-bold text-[#0FB888]">96%</div><div className="text-[8px] opacity-40 font-bold uppercase">SpO2</div></div>
                 </div>
              </div>
              <div className="bg-[#0A1F1A]/[0.02] p-4 rounded-2xl mb-6">
                <div className="text-[9px] font-black text-gray-400 uppercase mb-2">Notas clínicas</div>
                <div className="h-4 bg-black/[0.05] rounded-full w-3/4 mb-1" />
                <div className="h-4 bg-black/[0.05] rounded-full w-1/2" />
              </div>
              <div className="mt-auto space-y-2">
                <button className="w-full bg-[#0A1F1A] text-white text-[10px] font-bold py-3 rounded-2xl flex items-center justify-center gap-2">
                  Capturar Firma <Ico id="i-pencil" className="w-3 h-3" />
                </button>
                <button className="w-full border border-black/10 text-[#0A1F1A] text-[10px] font-bold py-3 rounded-2xl">
                  Completar Visita
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PATIENT BLOCK */}
        <div className="pb-24">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-[#0A1F1A] text-white flex items-center justify-center shadow-lg"><Ico id="i-home" className="w-7 h-7" /></div>
            <div>
              <div className="text-xl font-bold text-[#0A1F1A]">Paciente y Familia</div>
              <div className="text-[#4A6B62] text-sm">Visibilidad · Tranquilidad · Acompañamiento continuo</div>
            </div>
          </div>
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
              <div className="w-[260px] h-[480px] bg-white rounded-[3rem] border-[8px] border-[#e2f0e9] p-6 shadow-2xl relative">
                <div className="text-[#0A1F1A] text-xs font-bold mb-6">Bienvenido, Carlos</div>
                <div className="bg-white p-5 rounded-[2rem] border border-[#0FB888]/20 shadow-lg shadow-[#0FB888]/5 text-center mb-6">
                   <div className="text-[9px] text-[#0FB888] font-black tracking-widest uppercase mb-3">Tu estado</div>
                   <div className="w-4 h-4 rounded-full bg-[#0FB888] mx-auto mb-3 shadow-[0_0_12px_#0FB888]" />
                   <div className="text-[10px] text-[#4A6B62] font-medium leading-relaxed">Estable — Signos vitales normales</div>
                </div>
                <div className="bg-[#0A1F1A]/[0.03] p-5 rounded-2xl mb-4 border border-black/[0.03]">
                  <div className="text-orange-500 text-[8px] font-black uppercase mb-1">Próxima visita</div>
                  <div className="text-xs font-bold text-[#0A1F1A]">Enfermería — Mañana 9 AM</div>
                  <div className="text-[9px] text-[#4A6B62] mt-1">Sandra M. — Enfermera</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-black/5 mb-6">
                  <div className="text-[8px] font-black text-gray-400 uppercase mb-3">Servicios recientes</div>
                  <ul className="text-[10px] space-y-3 font-medium">
                    <li className="flex justify-between items-center text-[#0A1F1A]"><span><span className="text-[#0FB888] mr-2">●</span>Resultados de lab</span><span className="text-[8px] font-black opacity-30 uppercase">Hoy</span></li>
                    <li className="flex justify-between items-center text-[#0A1F1A]"><span><span className="text-[#0FB888] mr-2">●</span>Visita enfermería</span><span className="text-[8px] font-black opacity-30 uppercase">Ayer</span></li>
                    <li className="flex justify-between items-center text-[#0A1F1A]"><span><span className="text-[#0FB888] mr-2">●</span>Medicamentos</span><span className="text-[8px] font-black opacity-30 uppercase">Lun</span></li>
                  </ul>
                </div>
                <button className="w-full bg-[#0FB888] text-white text-[10px] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#0FB888]/20">
                  <Ico id="i-phone-call" className="w-4 h-4" /> Contactar Equipo OLGA
                </button>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
              <Benefit icon="i-users" title="Nunca más solos" desc="Saben exactamente qué pasa con su familiar: próxima visita, quién viene, qué resultados hay." />
              <Benefit icon="i-circle-dot" title="Semáforo de salud" desc="Estado del paciente visible. Verde = tranquilidad. Amarillo = atención. Rojo = equipo en camino." />
              <Benefit icon="i-phone-call" title="Un toque para ayuda" desc="Contacto directo con el equipo clínico. Sin buscar números, sin esperas, sin incertidumbre." />
              <Benefit icon="i-trending" title="Mejor recuperación" desc="Pacientes monitoreados se recuperan más rápido, con menos complicaciones y menos reingresos." />
              <Benefit icon="i-heart" title="Confirmación de servicios" desc="La familia sabe que el profesional vino, qué hizo, y qué encontró. Transparencia total." />
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};


export default OlgaPlatform;