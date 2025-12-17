"use client";

import { Zap, Sparkles, Droplets, Scissors, Activity, Eye } from 'lucide-react';
import { useState } from 'react';

const services = [
  {
    title: "Lipólisis láser",
    description: "Moldea y elimina grasa localizada con energía láser de precisión, sin cirugía ni incapacidad.",
    benefit: "Resultados visibles desde la primera sesión",
    icon: <Zap className="w-6 h-6" />,
    gradient: "from-pink-400 to-rose-500",
    color: "pink",
    highlight: true,
  },
  {
    title: "Tensamax",
    description: "Tecnología avanzada que estimula colágeno y elastina para una piel más firme y definida.",
    benefit: "Efecto tensor inmediato y progresivo",
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-purple-400 to-pink-500",
    color: "purple",
  },
  {
    title: "Ácido hialurónico",
    description: "Hidratación profunda y volumen natural para armonizar rasgos sin perder expresividad.",
    benefit: "Resultados naturales y seguros",
    icon: <Droplets className="w-6 h-6" />,
    gradient: "from-blue-400 to-cyan-500",
    color: "blue",
  },
  {
    title: "Hilos tensores",
    description: "Reafirma y levanta tejidos con bioestimulación de colágeno, sin quirófano.",
    benefit: "Efecto lifting y estimulación de colágeno",
    icon: <Scissors className="w-6 h-6" />,
    gradient: "from-emerald-400 to-teal-500",
    color: "emerald",
  },
  {
    title: "Plasma rico en plaquetas",
    description: "Regenera y mejora textura cutánea con tus propios factores de crecimiento.",
    benefit: "Mejora de textura y luminosidad",
    icon: <Activity className="w-6 h-6" />,
    gradient: "from-amber-400 to-orange-500",
    color: "amber",
  },
  {
    title: "Botox",
    description: "Suaviza líneas de expresión manteniendo gestos naturales con técnica precisa.",
    benefit: "Resultados naturales y controlados",
    icon: <Eye className="w-6 h-6" />,
    gradient: "from-violet-400 to-purple-500",
    color: "violet",
  },
];

export default function Services() {
  // Cambiamos el tipo a number | null para poder almacenar el índice
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative py-24 bg-gradient-to-b from-white to-pink-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-pink-100/30 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-rose-100/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-64 bg-gradient-to-r from-pink-200/10 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-6 shadow-sm border border-pink-100">
            <span className="text-sm font-semibold bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
              Tecnología Avanzada
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900">Nuestros</span>{' '}
            <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
              Servicios
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tratamientos médicos con tecnología avanzada, enfoque personalizado y resultados visibles desde la primera sesión.
          </p>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`group relative h-full transition-all duration-500 ${
                  hoveredCard === index ? 'transform -translate-y-2' : ''
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Background */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Card */}
                <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:border-pink-100">
                  {/* Icon */}
                  <div className={`mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <div className="text-white">
                      {service.icon}
                    </div>
                  </div>

                  {/* Badge */}
                  {service.highlight && (
                    <div className="absolute top-6 right-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur animate-pulse"></div>
                        <span className="relative px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-full">
                          MÁS POPULAR
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-pink-500 transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Benefit */}
                  <div className="mt-auto pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`}></div>
                      <span className={`font-semibold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                        {service.benefit}
                      </span>
                    </div>
                  </div>

                  {/* Hover effect line */}
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${service.gradient} group-hover:w-3/4 transition-all duration-500 rounded-full`}></div>
                </div>

                {/* Floating decorative element */}
                <div className={`absolute -top-2 -right-2 w-20 h-20 rounded-full bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="inline-block bg-gradient-to-r from-white to-pink-50 rounded-2xl p-1 shadow-lg">
            <div className="bg-white rounded-xl px-8 py-6">
              <p className="text-gray-700 mb-6 text-lg font-medium">
                ¿No estás segura de cuál tratamiento es ideal para ti?
              </p>
              <a
                href="#contacto"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <span>Agenda una valoración personalizada</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}