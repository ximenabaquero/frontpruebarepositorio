"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Brain, Shield, Sparkles, AlertCircle, Heart, Zap, ArrowRight } from 'lucide-react';

const topics = [
  {
    title: "¿Cómo se forma la fibrosis?",
    body: "Tras un procedimiento, el tejido se inflama y puede generar fibras duras si no hay drenaje, compresión adecuada o movimiento suave. El control médico y el masaje correcto evitan que ese tejido cicatrice de forma irregular.",
    icon: <AlertCircle className="w-6 h-6" />,
    gradient: "from-emerald-400 to-blue-500",
    tag: "Cuidado Post-tratamiento"
  },
  {
    title: "¿Por qué la grasa localizada no desaparece solo con ejercicio?",
    body: "Los adipocitos en ciertas zonas tienen más receptores para almacenar que para liberar grasa. El ejercicio ayuda a reducir volumen general, pero la distribución depende de receptores hormonales y genética; por eso necesitamos tecnologías focalizadas como la lipólisis láser.",
    icon: <Brain className="w-6 h-6" />,
    gradient: "from-blue-400 to-emerald-500",
    tag: "Ciencia Médica"
  },
  {
    title: "Beneficios de la faja en post-lipólisis",
    body: "La compresión uniforme reduce inflamación, ayuda a que la piel se adhiera al nuevo contorno y disminuye el riesgo de seromas y fibrosis. Usarla según indicación médica acelera una recuperación más segura y estética.",
    icon: <Shield className="w-6 h-6" />,
    gradient: "from-blue-400 to-emerald-500",
    tag: "Recuperación Óptima"
  },
];

export default function Education() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(() => topics.map(() => false));
  const [floatingElements, setFloatingElements] = useState<Array<{
    width: number;
    height: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
  }>>([]);

  // Generar elementos flotantes solo en el cliente
  useEffect(() => {
    setFloatingElements(
      [...Array(6)].map((_, i) => ({
        width: Math.random() * 60 + 20,
        height: Math.random() * 60 + 20,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: i * 0.5,
        duration: Math.random() * 10 + 10,
      }))
    );
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            setVisibleCards(prev => prev.map((item, i) => i === index ? true : item));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background with gradient and effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent"></div>
      </div>
      
      {/* Animated floating elements - SOLO en el cliente */}
      {floatingElements.length > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingElements.map((element, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-emerald-300/10 animate-float"
              style={{
                width: `${element.width}px`,
                height: `${element.height}px`,
                left: `${element.left}%`,
                top: `${element.top}%`,
                animationDelay: `${element.delay}s`,
                animationDuration: `${element.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20 px-4">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 md:mb-8 shadow-sm border border-emerald-100">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Educación Médica
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            <span className="text-gray-900">Educación</span>{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              y Cuidado
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
            Explicaciones claras, basadas en práctica médica, para que tomes decisiones seguras y tengas una recuperación tranquila.
          </p>
        </div>

        {/* Education Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20 px-4 sm:px-0">
          {topics.map((topic, index) => (
            <div
              key={topic.title}
              data-index={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="group relative"
            >
              {/* Hover Border Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${topic.gradient} rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
              
              {/* Card */}
              <div className={`relative h-full bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-100 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 ${
                visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}>
                
                {/* Icon Container */}
                <div className={`mb-6 md:mb-8 inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${topic.gradient} shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <div className="text-white">
                    {topic.icon}
                  </div>
                </div>

                {/* Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-full border border-emerald-100 mb-4">
                  <Heart className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs font-bold tracking-wider text-emerald-700">
                    {topic.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {topic.title}
                </h3>

                {/* Body */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {topic.body}
                </p>

                {/* Decorative Divider */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 group-hover:w-2/3 transition-all duration-500 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative max-w-3xl mx-auto px-4 sm:px-0">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-xl md:blur-2xl rounded-2xl md:rounded-3xl"></div>
          
          {/* Main CTA Card */}
          <div className="relative bg-gradient-to-br from-white via-white to-emerald-50/50 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white/80 shadow-xl md:shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-600 to-emerald-500"></div>
            
            <div className="relative z-10 p-6 md:p-8 lg:p-10 text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              {/* Title */}
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                ¿Tienes más preguntas?
              </h3>
              
              {/* Description */}
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
                Nuestro equipo médico está listo para resolver todas tus dudas y guiarte hacia los mejores resultados.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#contacto"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Zap className="w-5 h-5" />
                  <span>Consulta con nuestro médico</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a
                  href="#faq"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 text-sm md:text-base"
                >
                  <span>Ver más preguntas frecuentes</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating animation CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
