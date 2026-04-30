"use client";

import Image from "next/image";
import { generateWhatsAppURL } from "@/utils/whatsapp";
import { Sparkles, ArrowRight, Shield, Clock, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const benefits = [
    { icon: <Shield size={20} />, text: "Tecnología láser certificada" },
    { icon: <Clock size={20} />, text: "Procedimiento médico especializado" },
    { icon: <CheckCircle size={20} />, text: "Recuperación controlada" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-emerald-200/20 to-blue-200/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-gradient-to-l from-emerald-200/20 to-blue-200/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-emerald-100/30"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className={`space-y-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm border border-teal-100 text-xs sm:text-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500 flex-shrink-0" />
              <span className="font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Tecnología Médica Avanzada
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="block text-gray-900">Lipólisis láser</span>
              <span className="block bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 bg-clip-text text-transparent mt-1 sm:mt-2">
                asistida por tecnología
              </span>
            </h1>

            {/* Subtitle */}
            <div className="space-y-3 sm:space-y-4">
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                <span className="font-semibold text-teal-600">Procedimiento mínimamente invasivo</span> para reducción de grasa localizada. 
                Estimulamos la producción de colágeno y promovemos el contorno corporal con tecnología láser médica certificada.
              </p>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-teal-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-teal-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="text-teal-500">{benefit.icon}</div>
                    <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6">
              <a
                href={generateWhatsAppURL("hero")}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:from-teal-500 hover:to-cyan-600 text-sm sm:text-base"
              >
                <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>Agenda tu valoración</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
           
            </div>

            {/* Trust indicators */}
            <div className="pt-6 md:pt-8 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></div>
                  <span>100% Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0"></div>
                  <span>Tecnología certificada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></div>
                  <span>Resultados garantizados</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className={`relative flex items-end transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative w-full">
              {/* Main image */}
              <Image
                src="/mainfigurecoldesthetic.png"
                alt="Coldesthetic - Lipólisis láser sin cirugía"
                width={900}
                height={900}
                className="w-full h-auto max-h-[85vh] object-contain drop-shadow-xl"
                priority
              />

              {/* Floating card 1 - bottom left - Hidden on mobile, visible on tablet+ */}
              <div className="hidden sm:block absolute bottom-[15%] -left-2 md:bottom-[18%] md:-left-4 bg-gradient-to-br from-white/80 to-teal-50/70 backdrop-blur-md rounded-xl md:rounded-2xl p-2.5 md:p-3.5 shadow-lg border border-teal-200/50">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-semibold text-gray-800">Tecnología láser</div>
                    <div className="text-xs text-teal-600">Asistida por médico</div>
                  </div>
                </div>
              </div>

              {/* Floating card 2 - top right */}
              <div className="absolute top-[8%] sm:top-[12%] -right-2 md:-right-4 bg-gradient-to-br from-white/80 to-cyan-50/70 backdrop-blur-md rounded-xl md:rounded-2xl p-2.5 md:p-3.5 shadow-lg border border-cyan-200/50">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-sm">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-semibold text-gray-800">Reducción localizada</div>
                    <div className="text-xs text-cyan-600">Contorno controlado</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-emerald-300 flex justify-center">
          <div className="w-1 h-3 bg-emerald-400 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}
