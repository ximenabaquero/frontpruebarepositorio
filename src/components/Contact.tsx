"use client";

import { generateWhatsAppURL } from "@/utils/whatsapp";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { MessageCircle, Phone, MapPin, Mail, Clock, Sparkles, Heart, ArrowRight, Facebook, Instagram } from 'lucide-react';

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const socialLinks = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/573224042286',
    icon: <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />,
    color: 'bg-gradient-to-br from-emerald-500 to-green-400',
    description: '+57 (322) 404-2286',
    gradient: 'from-emerald-400 to-green-500'
  },
  {
    name: 'Teléfono',
    href: 'tel:+573224042286',
    icon: <Phone className="w-6 h-6 md:w-7 md:h-7" />,
    color: 'bg-gradient-to-br from-blue-500 to-emerald-400',
    description: 'Llamada directa',
    gradient: 'from-blue-400 to-emerald-500'
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/perfe_stetic?igsh=MXNuMzI2ZmwxenJtbw==',
    icon: <Instagram className="w-6 h-6 md:w-7 md:h-7" />,
    color: 'bg-gradient-to-br from-emerald-500 to-blue-600',
    description: '@perfe_stetic',
    gradient: 'from-emerald-400 to-blue-600'
  }
];

export default function Contact() {
  const [visible, setVisible] = useState<boolean[]>(() => socialLinks.map(() => false));
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const floatStyles = useMemo<CSSProperties[]>(() => {
    const rand = mulberry32(987654);
    return Array.from({ length: 8 }, () => {
      const size = rand() * 60 + 20;
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
            const index = Number((entry.target as HTMLElement).dataset.index);
            setVisible((prev) => prev.map((v, i) => (i === index ? true : v)));
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
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent"></div>
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
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Conéctate con Nosotros
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            <span className="text-gray-900">Contáctanos</span>{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Hoy
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
            Estamos aquí para resolver tus dudas y diseñar un plan con precisión médica y calidez humana.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20 px-4 sm:px-0">
          {socialLinks.map((link, index) => (
            <div
              key={link.name}
              data-index={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="group relative"
            >
              {/* Hover Border Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${link.gradient} rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
              
              {/* Card */}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative block h-full bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-100 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 text-center ${
                  visible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Icon Container */}
                <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl mx-auto mb-6 ${link.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {link.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {link.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-5">
                  {link.description}
                </p>

                {/* CTA Button */}
                <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm md:text-base">
                  <span>Contactar ahora</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Hover Indicator */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 group-hover:w-2/3 transition-all duration-500 rounded-full"></div>
              </a>
            </div>
          ))}
        </div>

        {/* Information & CTA Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-20 px-4 sm:px-0">
          {/* Left Column - Information */}
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-100 p-6 md:p-8 shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-emerald-500" />
                <span>Información de Contacto</span>
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Teléfono</h4>
                    <a href="tel:+573224042286" className="text-gray-600 hover:text-emerald-600 transition-colors">
                      +57 (322) 404-2286
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <a href="mailto:info@coldesthetic.com" className="text-gray-600 hover:text-emerald-600 transition-colors">
                      info@coldesthetic.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Horario de Atención</h4>
                    <p className="text-gray-600">Lunes a Viernes: 9:00 AM - 7:00 PM</p>
                    <p className="text-gray-600">Sábados: 9:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-100 p-6 md:p-8 shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-blue-500" />
                <span>Síguenos</span>
              </h3>
              
              <div className="flex gap-4 justify-center md:justify-start">
                <a
                  href="https://facebook.com/coldesthetic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
                >
                  <Facebook className="w-6 h-6 text-blue-600" />
                </a>
                
                <a
                  href="https://www.instagram.com/perfe_stetic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 flex items-center justify-center hover:from-emerald-200 hover:to-blue-200 transition-colors"
                >
                  <Instagram className="w-6 h-6 text-emerald-600" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - CTA */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-xl md:blur-2xl rounded-2xl md:rounded-3xl"></div>
            
            {/* Main CTA Card */}
            <div className="relative bg-gradient-to-br from-white via-white to-emerald-50/50 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white/80 shadow-xl md:shadow-2xl overflow-hidden h-full">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-600 to-emerald-500"></div>
              
              <div className="relative z-10 p-6 md:p-8 lg:p-10 h-full flex flex-col">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 mb-6 self-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4 text-center">
                  ¡Comienza tu transformación hoy!
                </h3>
                
                {/* Description */}
                <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed text-center">
                  Agenda tu consulta gratuita y descubre cómo la lipólisis láser y nuestros protocolos médicos pueden cambiar tu perfil corporal.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 mt-auto">
                  <a
                    href={generateWhatsAppURL("contact")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-400 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                    <span>Consulta gratuita por WhatsApp</span>
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  
                  <a
                    href="tel:+573224042286"
                    className="group w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Phone className="w-5 h-5 md:w-6 md:h-6" />
                    <span>Llamar ahora</span>
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  );
}