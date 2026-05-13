"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#Inicio",    label: "Problema"    },
  { href: "#solucion",  label: "Solución"    },
  { href: "#platform",  label: "Plataforma"  },
  { href: "#features",  label: "Capacidades" },
  { href: "#fase2",     label: "Fase 2"      },
  { href: "#contacto",  label: "Contacto"    },
];

export default function HomeNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(20,38,36,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "1.65rem",
          fontWeight: 800,
          letterSpacing: "-1.5px",
          lineHeight: 1,
          color: "#fff",
        }}
      >
        olga
      </span>

      {/* Links */}
      <div className="hidden md:flex items-center gap-1 rounded-full px-2 py-1"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-sm font-medium px-3 py-1.5 rounded-full transition-colors"
            style={{ color: "rgba(255,255,255,0.75)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.10)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.background = "transparent"; }}
          >
            {l.label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/login"
        className="text-sm font-bold px-4 py-2 rounded-full transition-all"
        style={{ background: "#0FB888", color: "#fff" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#0AA577"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#0FB888"; }}
      >
        Iniciar sesión
      </Link>
    </nav>
  );
}
