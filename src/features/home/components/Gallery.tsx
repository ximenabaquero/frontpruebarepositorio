"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import useSWR from "swr";
import Image from "next/image";
import { CheckCircle, Target, Camera } from 'lucide-react';
import { endpoints, getImageUrl } from "../../control-images/services/ClinicalImagesService";
import type { ClinicalImage } from "../../control-images/types/ClinicalImage";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" })
    .then((res) => res.json())
    .then((json) => json.data || []);

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gradients = [
  "from-emerald-400 to-blue-500",
  "from-blue-400 to-emerald-500",
  "from-emerald-500 to-blue-400",
];

export default function Gallery() {
  const { data: images, isLoading } = useSWR<ClinicalImage[]>(
    endpoints.list,
    fetcher
  );

  const [visible, setVisible] = useState<boolean[]>([]);

  useEffect(() => {
    if (images && Array.isArray(images)) {
      setVisible(images.map(() => false));
    }
  }, [images]);
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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando imágenes...</p>
          </div>
        )}

        {/* Error State - desactivado para producción */}
        {/* {error && (
          <div className="text-center py-12">
            <p className="text-red-500">Error al cargar las imágenes</p>
          </div>
        )} */}

        {/* Empty State */}
        {images && images.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-blue-100 mb-6">
              <Camera className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">¡Pronto verás resultados increíbles aquí!</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Estamos documentando las transformaciones de nuestros pacientes. ¡Sé la próxima historia de éxito!
            </p>
            <a
              href="https://wa.me/573001434089?text=Hola,%20quiero%20agendar%20mi%20valoración%20médica"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Agenda tu valoración y sé la próxima
            </a>
          </div>
        )}

        {/* Gallery Grid */}
        {images && images.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 mb-16 md:mb-20 px-4 sm:px-0">
          {images.map((item, index) => {
            const gradient = gradients[index % gradients.length];
            return (
            <div
              key={item.id}
              data-index={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="group relative"
            >
              {/* Hover Border Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
              
              {/* Card */}
              <div className={`relative h-full bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-100 p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-500 ${
                visible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}>
                
                <div className="mb-6 md:mb-7">
                  <div className="flex items-center justify-start mb-4 gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient}`}>
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm md:text-base text-gray-600 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
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
                          src={getImageUrl(item.before_image)}
                          alt={`Antes - ${item.title}`}
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
                          src={getImageUrl(item.after_image)}
                          alt={`Después - ${item.title}`}
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
          );
          })}
        </div>
        )}

        {images && images.length > 0 && (
        <div className="relative max-w-4xl mx-auto px-4 sm:px-0 mt-12">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-xl md:blur-2xl rounded-2xl md:rounded-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-emerald-100 p-8 md:p-12 text-center shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              ¿Lista para ver tu propio resultado?
            </h3>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Agenda tu valoración médica y descubre el plan personalizado para tu transformación.
            </p>
            <a
              href="https://wa.me/573001434089?text=Hola,%20quiero%20agendar%20mi%20valoración%20médica"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Agenda tu valoración médica
            </a>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
