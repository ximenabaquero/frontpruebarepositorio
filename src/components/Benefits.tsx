"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { generateWhatsAppURL } from "@/utils/whatsapp";

type Benefit = {
  title: string;
  description: string;
  icon: string;
  alt: string;
  tag: string;
};

const benefits: Benefit[] = [
  {
    icon: "/cinturasin.png",
    alt: "Tecnología avanzada",
    title: "Tecnología avanzada",
    description:
      "Láser lipólisis + láser diodo + soft laser para esculpir con precisión, estimular colágeno y proteger la piel.",
    tag: "Precisión láser",
  },
  {
    icon: "/recuperacionrapidasin.png",
    alt: "Acompañamiento médico",
    title: "Acompañamiento médico",
    description:
      "Protocolos personalizados, seguimiento cercano y prevención de fibrosis para una recuperación guiada y segura.",
    tag: "Seguimiento médico",
  },
  {
    icon: "/backwomansin.png",
    alt: "Resultados visibles",
    title: "Resultados visibles",
    description:
      "Cambios desde la primera sesión: menos volumen, mejor definición y piel más firme.",
    tag: "Impacto inmediato",
  },
  {
    icon: "/recuperacionrapidasin.png",
    alt: "Recuperación rápida",
    title: "Recuperación rápida",
    description:
      "Procedimientos sin incapacidad ni dolor post, para retomar tus actividades el mismo día.",
    tag: "Sin downtime",
  },
];

export default function Benefits() {
  const [visible, setVisible] = useState<boolean[]>(() => benefits.map(() => false));
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            setVisible((prev) =>
              prev.map((item, i) => (i === index ? true : item))
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    cardRefs.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="absolute inset-x-0 top-14 h-1 slow-gradient-bar" aria-hidden />
      <div
        className="absolute inset-x-0 -bottom-20 h-48 bg-gradient-to-b from-[#f7ecf8] via-white to-white pointer-events-none"
        aria-hidden
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-tight">
            <span className="underline-animated">¿Por qué elegir Perfestetic?</span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Un bloque de beneficios diseñado para transmitir precisión médica, calidez humana y resultados visibles desde la primera sesión.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              data-index={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`soft-gradient-border benefit-card card-hover-elevate ${
                visible[index] ? "is-visible" : ""
              }`}
            >
              <div className="soft-gradient-border__inner card-sheen relative h-full rounded-2xl p-8 group">
                <div className="benefit-card__halo" aria-hidden />
                <div className="relative flex h-full flex-col items-center text-center gap-5">
                  <div className="benefit-icon benefit-icon__parallax relative flex items-center justify-center w-20 h-20 rounded-full border border-[#f0cce8] shadow-[0_14px_45px_rgba(215,180,243,0.35)]">
                    <span
                      className="absolute -inset-4 rounded-full bg-gradient-to-br from-[#f6c1e5]/35 to-[#d7b4f3]/28 blur-2xl"
                      aria-hidden
                    />
                    <Image
                      src={benefit.icon}
                      alt={benefit.alt}
                      width={86}
                      height={86}
                      className="relative z-10 object-contain drop-shadow-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-3 items-center">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#a35ab6] bg-[#f7ecf8] border border-white/70 rounded-full shadow-sm">
                      {benefit.tag}
                    </span>
                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight leading-tight">
                      {benefit.title}
                    </h3>
                    <div className="title-underline" aria-hidden />
                  </div>

                  <p className="text-base text-slate-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.08)] px-8 py-10 max-w-2xl w-full text-center">
            <div className="absolute inset-0 slow-gradient-bar opacity-40" aria-hidden />
            <div className="relative z-10">
              <h3 className="text-2xl font-semibold text-slate-900 tracking-tight mb-3">
                ¿Lista para tu transformación?
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Agenda tu valoración y diseñemos un plan preciso, con resultados visibles y recuperación guiada.
              </p>
              <a
                href={generateWhatsAppURL("benefits")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20b358] text-white font-semibold py-3.5 px-7 rounded-full transition-all duration-300 shadow-[0_16px_38px_rgba(37,211,102,0.35)]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}