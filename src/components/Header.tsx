import React from 'react';

// Símbolos SVG necesarios para el Header (puedes añadir más si los necesitas)
const SVG_DEFS = `
  <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></symbol>
`;

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-[100] bg-[#FAFDFB]/78 backdrop-blur-[18px] border-b border-[#0A1F1A]/10 px-8 py-[14px] flex items-center justify-between font-['DM_Sans',sans-serif]">
      {/* Inyección de SVG Defs */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs dangerouslySetInnerHTML={{ __html: SVG_DEFS }} />
      </svg>

      {/* LOGO - Exactamente como el estilo antiguo */}
      <div className="text-[1.65rem] font-extrabold tracking-[-1.5px] leading-none text-[#0A1F1A]">
        <span className="text-[#0A1F1A]">o</span>lga
      </div>

      <div className="flex items-center">
        {/* NAVEGACIÓN - La "píldora" con fondo suave */}
        <nav className="hidden md:flex items-center gap-[6px] bg-[#0FB888]/[0.07] border border-[#0FB888]/[0.22] rounded-full px-[6px] py-[4px]">
          {[
            { label: 'Problema', href: '#problem' },
            { label: 'Solución', href: '#solution' },
            { label: 'Plataforma', href: '#platform' },
            { label: 'Capacidades', href: '#features' },
            { label: 'Fase 2', href: '#future' },
            { label: 'Contacto', href: '#contact' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#4A6B62] no-underline text-[0.8rem] font-medium px-[14px] py-[5px] rounded-full transition-all duration-200 hover:text-[#0FB888] hover:bg-[#0FB888]/12"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* BOTÓN LOGIN - Estilo exacto del código antiguo */}
        <a
          href="/login"
          className="inline-flex items-center gap-[6px] bg-[#0FB888] text-[#FAFDFB] no-underline text-[0.8rem] font-bold px-[18px] py-[7px] rounded-full transition-all duration-150 whitespace-nowrap ml-3 hover:bg-[#0AA577] hover:-translate-y-[1px]"
        >
          Iniciar sesión
        </a>
      </div>
    </header>
  );
};

export default Header;