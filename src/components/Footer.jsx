"use client";

import { Heart, MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Instagram, ArrowUp } from 'lucide-react';
import { useState } from 'react';

const quickLinks = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Servicios', href: '#servicios' },
  { name: 'Resultados', href: '#resultados' },
  { name: 'Testimonios', href: '#testimonios' },
  { name: 'Educación', href: '#educacion' },
  { name: 'Contacto', href: '#contacto' },
];

const services = [
  { name: 'Lipólisis Láser' },
  { name: 'Tensamax' },
  { name: 'Ácido Hialurónico' },
  { name: 'Hilos Tensores' },
  { name: 'Plasma Rico en Plaquetas' },
  { name: 'Botox' },
];

const contactInfo = [
  { icon: <Phone className="w-4 h-4" />, text: '+57 (322) 404-2286', href: 'tel:+573224042286' },
  { icon: <Mail className="w-4 h-4" />, text: 'info@coldesthetic.com', href: 'mailto:info@coldesthetic.com' },
  { icon: <MapPin className="w-4 h-4" />, text: 'Bogotá, Colombia', href: '#' },
  { icon: <Clock className="w-4 h-4" />, text: 'Lun-Vie: 9AM - 7PM | Sáb: 9AM - 2PM', href: '#' },
];

const socialLinks = [
  { 
    icon: <MessageCircle className="w-5 h-5" />, 
    href: 'https://wa.me/573224042286',
    color: 'bg-emerald-500 hover:bg-emerald-600',
    name: 'WhatsApp'
  },
  { 
    icon: <Facebook className="w-5 h-5" />, 
    href: 'https://facebook.com/coldesthetic',
    color: 'bg-blue-600 hover:bg-blue-700',
    name: 'Facebook'
  },
  { 
    icon: <Instagram className="w-5 h-5" />, 
    href: 'https://www.instagram.com/perfe_stetic',
    color: 'bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700',
    name: 'Instagram'
  },
];

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear());

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-600 to-emerald-500"></div>

      {/* Main footer content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          
          {/* Brand & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">
                  Coldesthetic
                </h2>
                <p className="text-sm text-gray-300">Estética Médica Avanzada</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              Especialistas en lipólisis láser sin cirugía, con tecnología avanzada y resultados visibles desde la primera sesión.
            </p>
            
            {/* Social media */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-3 border-b border-gray-700 flex items-center gap-2">
              <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                Enlaces Rápidos
              </span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowUp className="w-3 h-3 rotate-90 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-3 border-b border-gray-700">
              <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                Nuestros Servicios
              </span>
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href="#servicios"
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>{service.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-3 border-b border-gray-700">
              <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                Contacto
              </span>
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index}>
                  <a
                    href={info.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-start gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-blue-600 transition-all">
                      {info.icon}
                    </div>
                    <span className="text-sm md:text-base leading-relaxed">{info.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter & CTA */}
        <div className="mb-10 md:mb-16">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">¿Lista para comenzar?</h3>
                <p className="text-gray-300">Recibe asesoría personalizada sin compromiso</p>
              </div>
              <a
                href="https://wa.me/573224042286"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Agendar Consulta Gratis</span>
                <ArrowUp className="w-4 h-4 rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Back to Top */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-700">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {currentYear} Coldesthetic. Todos los derechos reservados.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Diseñado con <Heart className="w-3 h-3 inline text-emerald-400" /> para tu bienestar
            </p>
          </div>
          
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
            aria-label="Volver arriba"
          >
            <span className="text-sm">Volver arriba</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 group-hover:from-emerald-500 group-hover:to-blue-600 flex items-center justify-center transition-all">
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
    </footer>
  );
}