"use client";

import {
  Shield,
  MapPin,
  Mail,
  Linkedin,
  ArrowUp,
  Activity,
  Globe,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const quickLinks = [
  { name: "Plataforma", href: "#platform" },
  { name: "Fase 2", href: "#future" },
  { name: "Contacto", href: "#contact" },
  { name: "OLGA Healthtech", href: "https://olga.health" },
];

const olgaServices = [
  { name: "Verificación GPS & Antifraude" },
  { name: "Continuidad del Cuidado" },
  { name: "Evidencia Clínica Digital" },
  { name: "Gestión de Pacientes Post-Alta" },
  { name: "Dashboard de Operaciones IPS" },
  { name: "Infraestructura Hospital at Home" },
];

const contactInfo = [
  {
    icon: <Mail className="w-4 h-4" />,
    text: "camilocortesu@gmail.com",
    href: "mailto:camilocortesu@gmail.com",
  },
  { 
    icon: <Globe className="w-4 h-4" />, 
    text: "www.olga.health", 
    href: "https://olga.health" 
  },
  { 
    icon: <MapPin className="w-4 h-4" />, 
    text: "Bogotá, Colombia", 
    href: "#" 
  },
];

const socialLinks = [
  {
    icon: <Linkedin className="w-5 h-5" />,
    href: "https://www.linkedin.com/company/olga-healthtech",
    color: "bg-[#0FB888] hover:bg-[#12d19b]",
    name: "OLGA LinkedIn",
  },
  {
    icon: <Activity className="w-5 h-5" />,
    href: "https://www.linkedin.com/in/camilocortesu/",
    color: "bg-[#0A1F1A] hover:bg-[#1A2E29] border border-white/10",
    name: "Founder LinkedIn",
  },
];

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear());

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0A1F1A] text-white overflow-hidden border-t border-white/5">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0FB888 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Acento superior esmeralda */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0FB888] to-transparent"></div>

      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Description */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-white rounded-xl p-2">
                <Image
                  src="/a-Olga.png"
                  alt="OLGA Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
      <div className="text-[1.65rem] font-extrabold tracking-[-1.5px] leading-none text-[#fff]">
        olga
      </div>
                <p className="text-[10px] text-[#0FB888] font-black uppercase tracking-[0.2em] mt-1">
                  Healthtech
                </p>
              </div>
            </div>

            <p className="text-white/60 leading-relaxed text-sm md:text-base">
              Infraestructura tecnológica para la coordinación, verificación y visibilidad total del cuidado de salud extramural en Latinoamérica.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${social.color} transition-all duration-300 hover:scale-105 shadow-lg shadow-black/20`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-['Instrument_Serif',serif] text-xl text-white mb-8 italic">
              Navegación
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/50 hover:text-[#0FB888] transition-colors duration-300 flex items-center gap-2 group text-sm"
                  >
                    <div className="w-1 h-1 rounded-full bg-[#0FB888] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="group-hover:translate-x-1 transition-transform italic">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* OLGA Core Solutions */}
          <div>
            <h3 className="font-['Instrument_Serif',serif] text-xl text-white mb-8 italic">
              Soluciones
            </h3>
            <ul className="space-y-4">
              {olgaServices.map((service, index) => (
                <li key={index} className="text-white/50 flex items-center gap-3 text-sm">
                  <Shield className="w-3 h-3 text-[#0FB888]/40" />
                  <span>{service.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-['Instrument_Serif',serif] text-xl text-white mb-8 italic">
              Contacto
            </h3>
            <ul className="space-y-6">
              {contactInfo.map((info, index) => (
                <li key={index}>
                  <a
                    href={info.href}
                    className="text-white/50 hover:text-white transition-colors duration-300 flex items-start gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0FB888]/20 group-hover:text-[#0FB888] transition-all">
                      {info.icon}
                    </div>
                    <span className="text-sm leading-relaxed truncate">
                      {info.text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Global Context Note */}
        <div className="mb-16">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h4 className="text-white font-bold mb-1">¿Listo para conectar su ecosistema?</h4>
              <p className="text-white/40 text-sm italic font-['Instrument_Serif',serif] text-lg">
                Agende una demostración técnica de la plataforma.
              </p>
            </div>
            <a
              href="mailto:camilocortesu@gmail.com"
              className="group inline-flex items-center gap-3 bg-[#0FB888] text-[#0A1F1A] font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-[#0FB888]/10"
            >
              Contactar ahora
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
          <div className="text-center md:text-left">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
              © {currentYear} OLGA Healthtech S.A.S.
            </p>
            <p className="text-white/20 text-[9px] mt-2 italic font-['Instrument_Serif',serif] text-sm">
              Infraestructura para la transparencia clínica.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-white/30 hover:text-[#0FB888] transition-colors duration-300"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Back to top</span>
            <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-[#0FB888]/10 flex items-center justify-center transition-all">
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform text-[#0FB888]" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}