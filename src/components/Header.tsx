"use client";

import React, { useState, useEffect } from 'react';

const SVG_DEFS = `
  <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></symbol>
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '#Inicio' },
    { label: 'Problema', href: '#problem' },
    { label: 'Solución', href: '#solution' },
    { label: 'Plataforma', href: '#platform' },
    { label: 'Capacidades', href: '#features' },
    { label: 'Fase 2', href: '#future' },
    { label: 'Contacto', href: '#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-[100] px-6 md:px-10 py-5 flex items-center justify-between transition-all duration-500 ${
        isScrolled || isMenuOpen
          ? "bg-white shadow-md border-b border-slate-100" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Importación de la fuente */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@800&display=swap');
      `}</style>

      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs dangerouslySetInnerHTML={{ __html: SVG_DEFS }} />
      </svg>

      {/* LOGO - FUERZA BRUTA CON INLINE STYLES */}
      <div 
        className={`transition-colors duration-300 z-[110] ${
          isScrolled || isMenuOpen ? "text-[#0A1F1A]" : "text-white"
        }`}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: '800',
          letterSpacing: '-1.5px',
          fontSize: '1.65rem',
          lineHeight: '1',
          display: 'block'
        }}
      >
        <span>o</span>lga
      </div>

      {/* NAVEGACIÓN CENTRAL */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden xl:block">
        <nav className="flex items-center gap-1 bg-white border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-full px-2 py-1.5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative text-[#4A6B62] no-underline text-[0.82rem] font-semibold px-5 py-2 rounded-full transition-all duration-300 hover:text-[#0FB888] group"
            >
              <span className="relative z-10">{link.label}</span>
              <span className="absolute inset-0 bg-[#0FB888]/5 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 ease-out"></span>
            </a>
          ))}
        </nav>
      </div>

      {/* ACCIONES */}
      <div className="flex items-center gap-5 z-[110]">
        <a
          href="/login"
          className="hidden sm:inline-flex items-center bg-[#0FB888] text-white no-underline text-[0.85rem] font-bold px-6 py-2.5 rounded-full shadow-lg shadow-[#0FB888]/20 transition-all duration-300 hover:bg-[#0AA577] hover:shadow-[#0AA577]/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          Iniciar sesión
        </a>

        {/* Botón Hamburguesa */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`xl:hidden p-2 rounded-xl transition-all ${
            isScrolled || isMenuOpen ? "bg-slate-100 text-[#0A1F1A]" : "bg-white/10 text-white backdrop-blur-sm"
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* MENÚ MOBILE */}
      <div className={`absolute top-0 left-0 w-full bg-white transition-all duration-500 ease-in-out xl:hidden overflow-hidden shadow-2xl ${
        isMenuOpen ? "max-h-[100vh] opacity-100 pt-24 pb-12" : "max-h-0 opacity-0"
      }`}>
        <nav className="flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-[#0A1F1A] text-xl font-bold hover:text-[#0FB888]"
            >
              {link.label}
            </a>
          ))}
          <div className="h-px w-12 bg-slate-200 my-2"></div>
          <a
            href="/login"
            className="bg-[#0FB888] text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-[#0FB888]/20"
          >
            Iniciar sesión
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;