"use client";

import { useEffect, useRef } from "react";

const topics = [
  {
    title: "¿Cómo se forma la fibrosis?",
    body:
      "Tras un procedimiento, el tejido se inflama y puede generar fibras duras si no hay drenaje, compresión adecuada o movimiento suave. El control médico y el masaje correcto evitan que ese tejido cicatrice de forma irregular.",
  },
  {
    title: "¿Por qué la grasa localizada no desaparece solo con ejercicio?",
    body:
      "Los adipocitos en ciertas zonas tienen más receptores para almacenar que para liberar grasa. El ejercicio ayuda a reducir volumen general, pero la distribución depende de receptores hormonales y genética; por eso necesitamos tecnologías focalizadas como la lipólisis láser.",
  },
  {
    title: "Beneficios de la faja en post-lipólisis",
    body:
      "La compresión uniforme reduce inflamación, ayuda a que la piel se adhiera al nuevo contorno y disminuye el riesgo de seromas y fibrosis. Usarla según indicación médica acelera una recuperación más segura y estética.",
  },
];

const topicIcons = [
  (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12h3l1.5-4 3 8 1.5-4H20" />
      <path d="M5 5h4M15 19h4" />
      <circle cx="12" cy="12" r="9.25" />
    </svg>
  ),
  (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9c0-3 2.5-5.5 6-5.5S18 6 18 9c0 5-6 9-6 9S6 14 6 9Z" />
      <path d="M12 9.5c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1Z" />
    </svg>
  ),
  (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="5" width="16" height="14" rx="3" />
      <path d="M9 9h6" />
      <path d="M9 13h3" />
    </svg>
  ),
];

export default function Education() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() =>
    {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("edu-card--visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      cardsRef.current.forEach((card) => {
        if (card) observer.observe(card);
      });

      return () => observer.disconnect();
    },
    []
  );

  return (
    <section
      className="py-16"
      style={{
        background: "linear-gradient(180deg, rgba(255, 224, 242, 0.35) 0%, rgba(255, 255, 255, 0.15) 45%, rgba(255, 255, 255, 0.4) 100%)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Educación y cuidado</h2>
          <div className="decor-line" aria-hidden />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explicaciones claras, basadas en práctica médica, para que tomes decisiones seguras y tengas una recuperación tranquila.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {topics.map((topic, index) => (
            <div
              key={topic.title}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="edu-card card-hover-elevate h-full rounded-[22px] bg-white/20 backdrop-blur-[12px] border border-white/40 p-6 shadow-lg shadow-gray-200/60"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="edu-card__icon text-[#c58adf] mb-4">
                {topicIcons[index % topicIcons.length]}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{topic.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{topic.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
