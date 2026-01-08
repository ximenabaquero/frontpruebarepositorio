"use client";

import { useMemo, type CSSProperties } from "react";
import { generateWhatsAppURL } from "@/utils/whatsapp";
import Image from "next/image";
import { MessageCircle, Shield, Star, Sparkles, CheckCircle, ArrowRight, Zap, Heart } from 'lucide-react';

const mulberry32 = (seed: number) => {
  return () => {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

type ChatMessage = {
  name: string;
  time: string;
  text: string;
  highlight: string;
  side: "left" | "right";
  avatar?: string;
  rating?: number;
};

const messages: ChatMessage[] = [
  {
    name: "Carolina G.",
    time: "Hoy 10:14 a. m.",
    text: "18 días después y el resultado es genial. Me siento feliz frente al espejo, la cintura se marcó un montón.",
    highlight: "18 días después y el resultado es genial",
    side: "left",
    rating: 5,
  },
  {
    name: "María P.",
    time: "Ayer 7:52 p. m.",
    text: "Gracias por la seguridad y acompañamiento. No sentí dolor y ya veo la piel más firme desde la primera sesión.",
    highlight: "Gracias por la seguridad y acompañamiento",
    side: "left",
    rating: 5,
  },
  {
    name: "Laura C.",
    time: "Lun 4:21 p. m.",
    text: "Me siento feliz frente al espejo. La grasa localizada bajó y el abdomen está más liso sin incapacidad.",
    highlight: "Me siento feliz frente al espejo",
    side: "left",
    rating: 5,
  },
  {
    name: "Coldesthetic",
    time: "Lun 4:23 p. m.",
    text: "¡Qué alegría leer esto! Seguimos acompañándote para mantener los resultados y prevenir fibrosis.",
    highlight: "Seguimos acompañándote",
    side: "right",
  },
];

const Highlighted = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const parts = text.split(highlight);
  return (
    <>
      {parts[0]}
      <span className="font-bold bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
        {highlight}
      </span>
      {parts[1]}
    </>
  );
};

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < rating ? 'fill-emerald-400 text-emerald-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

export default function Testimonials() {
  const delays = useMemo(() => messages.map((_, idx) => `${idx * 0.12}s`), []);
  const bubbleStyles = useMemo<CSSProperties[]>(() => {
    const rand = mulberry32(123456);
    return Array.from({ length: 6 }, () => {
      const width = rand() * 60 + 30;
      const height = rand() * 60 + 30;
      const left = rand() * 100;
      const top = rand() * 100;
      return {
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}%`,
        top: `${top}%`,
      };
    });
  }, []);

  return (
    <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/20 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/15 via-transparent to-transparent"></div>
      </div>

      {/* Floating chat bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbleStyles.map((style, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-emerald-300/10 border border-emerald-200/20"
            style={style}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20 px-4">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 md:mb-8 shadow-sm border border-emerald-100">
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Testimonios Reales
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            <span className="text-gray-900">Testimonios en</span>{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              WhatsApp
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
            Conversaciones reales que muestran resultados, acompañamiento médico y seguridad en cada paso del proceso.
          </p>
        </div>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto">
          {/* Chat Header */}
          <div className="rounded-t-2xl md:rounded-t-3xl bg-gradient-to-r from-emerald-500 to-blue-600 px-4 sm:px-6 py-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <Image
                      src="/coldestheticlogo.png"
                      alt="Coldesthetic"
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white"></div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg md:text-xl">Coldesthetic</h3>
                <p className="text-white/90 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  <span>En línea • Cifrado de extremo a extremo</span>
                </p>
              </div>
              
              <div className="flex items-center gap-3 text-white/90">
                <div className="hidden sm:flex items-center gap-3">
                  <MessageCircle className="w-5 h-5" />
                  <Shield className="w-5 h-5" />
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Chat Body */}
          <div className="bg-gradient-to-br from-gray-50 to-white border-x border-gray-100 px-4 sm:px-6 py-6 md:py-8 space-y-4 md:space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={`${msg.name}-${msg.time}`}
                className={`flex ${msg.side === "right" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`group relative max-w-md rounded-2xl px-4 py-3 md:px-5 md:py-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
                    msg.side === "right"
                      ? "bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100"
                      : "bg-white border border-gray-100"
                  }`}
                  style={{ animationDelay: delays[idx] }}
                >
                  {/* Message Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.side === "right" 
                        ? "bg-gradient-to-r from-emerald-500 to-blue-600" 
                        : "bg-gradient-to-r from-gray-200 to-gray-300"
                    }`}>
                      {msg.side === "right" ? (
                        <span className="w-8 h-8 rounded-full overflow-hidden bg-white">
                          <Image
                            src="/coldestheticlogo.png"
                            alt="Coldesthetic"
                            width={32}
                            height={32}
                            className="w-full h-full object-contain"
                          />
                        </span>
                      ) : (
                        <span className="text-gray-600 text-sm font-bold">{msg.name.charAt(0)}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${
                          msg.side === "right" ? "text-emerald-700" : "text-gray-800"
                        }`}>
                          {msg.name}
                        </span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      {msg.rating && <RatingStars rating={msg.rating} />}
                    </div>
                  </div>

                  {/* Message Text */}
                  <p className={`leading-relaxed text-sm md:text-base ${
                    msg.side === "right" ? "text-gray-700" : "text-gray-600"
                  }`}>
                    <Highlighted text={msg.text} highlight={msg.highlight} />
                  </p>

                  {/* Message Status */}
                  {msg.side === "right" && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-emerald-100">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span>Entregado</span>
                      </div>
                      <Heart className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Footer / CTA - CORRECCIÓN APLICADA AQUÍ */}
          <div className="rounded-b-2xl md:rounded-b-3xl bg-gradient-to-r from-white to-emerald-50 border border-gray-100 border-t-0 px-4 sm:px-6 py-6 md:py-8 shadow-lg">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 mb-2 justify-center lg:justify-start">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-900 font-semibold text-lg">
                    ¿Lista para tu resultado?
                  </span>
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  Únete a cientos de pacientes satisfechas que ya lograron su transformación
                </p>
              </div>
              
              {/* LÍNEA CORREGIDA: Cambiado "testimonios" por "general" */}
              <a
                href={generateWhatsAppURL("general")}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                <span className="text-sm md:text-base">Hablar con Coldesthetic</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 md:w-4 md:h-4 text-emerald-500" />
                  <span>100% seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                  <span>Resultados garantizados</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                  <span>Atención personalizada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}