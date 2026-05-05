"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useMemo, useRef } from "react";
import useSWR from "swr";
import Image from "next/image";
import { CheckCircle, Camera, ChevronLeft, ChevronRight, Target } from "lucide-react";
import { endpoints, getImageUrl } from "../../control-images/services/ClinicalImagesService";
import type { ClinicalImage } from "../../control-images/types/ClinicalImage";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" })
    .then((res) => res.json())
    .then((json) => json.data || []);

const gradients = [
  "from-emerald-400 to-blue-500",
  "from-blue-400 to-emerald-500",
  "from-emerald-500 to-blue-400",
];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Gallery() {
  const { data: images, isLoading } = useSWR<ClinicalImage[]>(endpoints.list, fetcher);

  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", slidesToScroll: 1 },
    [autoplay.current]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const floatStyles = useMemo(() => {
    const rand = mulberry32(456789);
    return Array.from({ length: 8 }, () => ({
      width: `${rand() * 80 + 20}px`,
      height: `${rand() * 80 + 20}px`,
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
    }));
  }, []);

  // Re-init when images load
  useEffect(() => {
    if (emblaApi && images?.length) emblaApi.reInit();
  }, [emblaApi, images]);

  return (
    <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/20 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/10 via-transparent to-transparent" />
      </div>

      {/* Floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatStyles.map((style, i) => (
          <div key={i} className="absolute rounded-full bg-emerald-300/10" style={style} />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 px-4">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm border border-emerald-100">
            <Camera className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Resultados Verificados
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            <span className="text-gray-900">Resultados</span>{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Reales
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
            Descubre las transformaciones increíbles que hemos logrado con nuestros pacientes
            mediante tecnología láser de precisión.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando imágenes...</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && images && images.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-blue-100 mb-6">
              <Camera className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              ¡Pronto verás resultados increíbles aquí!
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Estamos documentando las transformaciones de nuestros pacientes. ¡Sé la próxima
              historia de éxito!
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

        {/* Carrusel */}
        {images && images.length > 0 && (
          <div className="relative mb-16 md:mb-20">
            {/* Viewport */}
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-6 md:gap-8 px-4 sm:px-0">
                {images.map((item, index) => {
                  const gradient = gradients[index % gradients.length];
                  return (
                    <div
                      key={item.id}
                      className="flex-[0_0_90%] sm:flex-[0_0_70%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 group relative"
                    >
                      {/* Hover glow */}
                      <div
                        className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500`}
                      />
                      {/* Card */}
                      <div className="relative h-full bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-100 p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-500">
                        {/* Title */}
                        <div className="flex items-center gap-3 mb-6">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} shrink-0`}
                          >
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Before / After */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                              <span className="px-3 py-1 text-[10px] font-bold bg-gray-700 text-white rounded-full shadow-md">
                                ANTES
                              </span>
                            </div>
                            <div className="relative overflow-hidden rounded-xl h-44 md:h-52 shadow-inner bg-gray-100">
                              <Image
                                src={getImageUrl(item.before_image)}
                                alt={`Antes - ${item.title}`}
                                width={300}
                                height={416}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                            </div>
                          </div>
                          <div className="relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                              <span className="px-3 py-1 text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-full shadow-md">
                                DESPUÉS
                              </span>
                            </div>
                            <div className="relative overflow-hidden rounded-xl h-44 md:h-52 shadow-inner bg-emerald-50">
                              <Image
                                src={getImageUrl(item.after_image)}
                                alt={`Después - ${item.title}`}
                                width={300}
                                height={416}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-xs font-medium text-emerald-700">Verificado</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                            <Camera className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-xs font-medium text-blue-700">Sin edición</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Botones de navegación */}
            <button
              onClick={scrollPrev}
              aria-label="Anterior"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-5 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Siguiente"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-5 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* CTA */}
        {images && images.length > 0 && (
          <div className="relative max-w-4xl mx-auto px-4 sm:px-0 mt-4">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-2xl rounded-3xl" />
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
