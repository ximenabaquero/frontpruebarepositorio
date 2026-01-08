"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Star, CheckCircle, Target, Camera } from 'lucide-react';

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const beforeAfterGallery = [
  {
    id: 1,
    before: "/antes-despues/imagen1-antes.jpg",
    after: "/antes-despues/imagen1-despues.jpg",
    area: "Moldeamiento Corporal",
    duration: "Reducción de grasa localizada",
    result: "4.5 cm menos",
    gradient: "from-emerald-400 to-blue-500",
  },
  {
    id: 2,
    before: "/antes-despues/imagen2-antes.jpg",
    after: "/antes-despues/imagen2-despues.jpg",
    area: "Esculpido de Cintura",
    duration: "Reducción de abdomen",
    result: "6.2 cm menos",
    gradient: "from-blue-400 to-emerald-500",
  },
  {
    id: 3,
    before: "/antes-despues/imagen3-antes.jpg",
    after: "/antes-despues/imagen3-despues.jpg",
    area: "Firmeza Cutánea",
    duration: "Reducción y reafirmación",
    result: "Piel 82% más firme",
    gradient: "from-blue-400 to-emerald-500",
  },
];

export default function Gallery() {
  const [visible, setVisible] = useState<boolean[]>(() => beforeAfterGallery.map(() => false));
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const floatStyles = useMemo<CSSProperties[]>(() => {
    const rand = mulberry32(456789);
    return Array.from({ length: 8 }, () => {
      const size = rand() * 80 + 20;
      const left = rand() * 100;
      const top = rand() * 100;
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: `${top}%`,
      };
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setVisible((prev) => prev.map((v, i) => (i === idx ? true : v)));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    cardsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/20 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/10 via-transparent to-transparent"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatStyles.map((style, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-emerald-300/10"
            style={style}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20 px-4">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 md:mb-8 shadow-sm border border-emerald-100">
            <Camera className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Resultados Verificados
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            <span className="text-gray-900">Resultados</span>{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Reales
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
            Descubre las transformaciones increíbles que hemos logrado con nuestros pacientes mediante tecnología láser de precisión.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 mb-16 md:mb-20 px-4 sm:px-0">
          {beforeAfterGallery.map((item, index) => (
            <div
              key={item.id}
              data-index={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="group relative"
            >
              {/* Hover Border Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
              
              {/* Card */}
              <div className={`relative h-full bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-100 p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-500 ${
                visible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}>
                
                {/* Card Header - REORGANIZADO */}
                <div className="mb-6 md:mb-7">
                  {/* Area title with icon - AHORA EN LÍNEA */}
                  <div className="flex items-center justify-start mb-4 gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.gradient}`}>
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                        {item.area}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 mt-1">
                        {item.duration}
                      </p>
                    </div>
                  </div>
                  
                  {/* Result Badge - SEPARADO CLARAMENTE */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-full border border-emerald-100 shadow-sm">
                    <Star className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-700">
                      {item.result}
                    </span>
                  </div>
                </div>

                {/* Before/After Comparison - ESPACIADO ADECUADO */}
                <div className="mb-6 md:mb-7 relative">
                  <div className="grid grid-cols-2 gap-4 md:gap-5">
                    {/* Before */}
                    <div className="relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="px-3 py-1 text-xs font-bold bg-gray-700 text-white rounded-full shadow-md">
                          ANTES
                        </span>
                      </div>
                      <div className="relative overflow-hidden rounded-xl md:rounded-2xl h-44 md:h-52 shadow-inner bg-gradient-to-br from-gray-100 to-gray-200">
                        <Image
                          src={item.before}
                          alt={`Antes - ${item.area}`}
                          width={300}
                          height={416}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                      </div>
                    </div>

                    {/* After */}
                    <div className="relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-full shadow-md">
                          DESPUÉS
                        </span>
                      </div>
                      <div className="relative overflow-hidden rounded-xl md:rounded-2xl h-44 md:h-52 shadow-inner bg-gradient-to-br from-emerald-50 to-blue-50">
                        <Image
                          src={item.after}
                          alt={`Después - ${item.area}`}
                          width={300}
                          height={416}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Badge - POSICIONADO CLARAMENTE */}
                <div className="pt-4 md:pt-5 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-700">
                        Verificado
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                      <Camera className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-medium text-blue-700">
                        Sin edición
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 group-hover:w-2/3 transition-all duration-500 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-0">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-xl md:blur-2xl rounded-2xl md:rounded-3xl"></div>
          
          
        </div>
      </div>
    </section>
  );
}