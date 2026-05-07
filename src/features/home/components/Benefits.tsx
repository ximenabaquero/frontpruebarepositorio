"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { generateWhatsAppURL } from "@/utils/whatsapp";
import { Target, Heart, Eye, Clock, Sparkles, CheckCircle, Zap, Shield, ArrowRight } from 'lucide-react';

type Benefit = {
  title: string;
  description: string;
  tag: string;
  lucideIcon: React.ReactNode;
  gradient: string;
};

const benefits: Benefit[] = [
  {
    title: "Tecnología avanzada",
    description: "Láser lipólisis + láser diodo + soft laser para esculpir con precisión, estimular colágeno y proteger la piel.",
    tag: "Precisión láser",
    lucideIcon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />,
    gradient: "from-teal-400 to-cyan-500",
  },
  {
    title: "Acompañamiento médico",
    description: "Protocolos personalizados, seguimiento cercano y prevención de fibrosis para una recuperación guiada y segura.",
    tag: "Seguimiento médico",
    lucideIcon: <Heart className="w-5 h-5 sm:w-6 sm:h-6" />,
    gradient: "from-cyan-400 to-teal-500",
  },
  {
    title: "Resultados visibles",
    description: "Cambios desde la primera sesión: menos volumen, mejor definición y piel más firme.",
    tag: "Impacto inmediato",
    lucideIcon: <Eye className="w-5 h-5 sm:w-6 sm:h-6" />,
    gradient: "from-teal-400 to-cyan-500",
  },
  {
    title: "Recuperación controlada",
    description: "Procedimiento mínimamente invasivo con recuperación guiada. Retoma tus actividades progresivamente.",
    tag: "Recuperación guiada",
    lucideIcon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
    gradient: "from-cyan-400 to-teal-500",
  },
];

const scrollToSection = (sectionId: string, event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export default function Benefits() {
  const [visible, setVisible] = useState<boolean[]>(() => benefits.map(() => false));
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            setVisible((prev) =>
              prev.map((item, i) => (i === index ? true : item))
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    cardRefs.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-white to-emerald-50/30">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 w-40 h-40 md:w-60 md:h-60 rounded-full bg-emerald-200/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-5 w-40 h-40 md:w-60 md:h-60 rounded-full bg-blue-200/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20 px-4">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 md:mb-8 shadow-sm border border-emerald-100">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Beneficios Exclusivos
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            <span className="text-gray-900">¿Por qué elegir</span>{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent block sm:inline">
              Coldesthetic?
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
            Cada tratamiento está respaldado por protocolo médico, tecnología certificada y
            <span className="font-semibold text-emerald-700"> acompañamiento personalizado en cada etapa</span>.
          </p>
        </div>

        {/* Benefits Grid — 2 cols on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20 px-4 sm:px-0">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              data-index={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="group relative"
            >
              {/* Hover Border Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${benefit.gradient} rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>

              {/* Card */}
              <div className={`relative h-full flex flex-col bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-100 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                visible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}>

                {/* Icon */}
                <div className="relative mb-5 flex justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl md:rounded-2xl blur-xl opacity-50"></div>
                  <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500`}>
                    <div className="text-white">{benefit.lucideIcon}</div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  {benefit.description}
                </p>

                {/* Tag pill — cierre visual abajo */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-teal-200 bg-teal-50">
                    <CheckCircle className="w-3 h-3 text-teal-500 shrink-0" />
                    <span className="text-xs font-bold tracking-wider text-teal-700 uppercase">
                      {benefit.tag}
                    </span>
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${benefit.gradient} group-hover:w-2/3 transition-all duration-500 rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-0">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-xl md:blur-2xl rounded-2xl md:rounded-3xl"></div>
          
          {/* Main CTA Card */}
          <div className="relative bg-gradient-to-br from-white via-white to-emerald-50/50 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white/80 shadow-xl md:shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-600 to-emerald-500"></div>
            
            <div className="relative z-10 p-6 md:p-8 lg:p-12 text-center">
              {/* Icons */}
              <div className="inline-flex items-center gap-3 mb-4 md:mb-6">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              </div>
              
              {/* Title */}
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                ¿Lista para tu transformación?
              </h3>
              
              {/* Description */}
              <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
                Agenda tu valoración y diseñemos un plan preciso, con resultados visibles y recuperación guiada.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={generateWhatsAppURL("benefits")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  <span>Contactar por WhatsApp</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a
                  href="#contacto"
                  onClick={(event) => scrollToSection('contacto', event)}
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 text-sm md:text-base"
                >
                  <span>O llámanos</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
