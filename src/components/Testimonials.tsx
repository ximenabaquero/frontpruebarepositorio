"use client";

import { useMemo } from "react";
import { generateWhatsAppURL } from "@/utils/whatsapp";
import Image from "next/image";

type ChatMessage = {
  name: string;
  time: string;
  text: string;
  highlight: string;
  side: "left" | "right";
};

const messages: ChatMessage[] = [
  {
    name: "Carolina G.",
    time: "Hoy 10:14 a. m.",
    text: "18 días después y el resultado es genial. Me siento feliz frente al espejo, la cintura se marcó un montón.",
    highlight: "18 días después y el resultado es genial",
    side: "left",
  },
  {
    name: "María P.",
    time: "Ayer 7:52 p. m.",
    text: "Gracias por la seguridad y acompañamiento. No sentí dolor y ya veo la piel más firme desde la primera sesión.",
    highlight: "Gracias por la seguridad y acompañamiento",
    side: "left",
  },
  {
    name: "Laura C.",
    time: "Lun 4:21 p. m.",
    text: "Me siento feliz frente al espejo. La grasa localizada bajó y el abdomen está más liso sin incapacidad.",
    highlight: "Me siento feliz frente al espejo",
    side: "left",
  },
  {
    name: "Perfestetic",
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
      <span className="font-semibold text-emerald-900">{highlight}</span>
      {parts[1]}
    </>
  );
};

export default function Testimonials() {
	const delays = useMemo(() => messages.map((_, idx) => `${idx * 0.12}s`), []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3">Testimonios en WhatsApp</h2>
          <div className="decor-line" aria-hidden />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Conversaciones reales que muestran resultados, acompañamiento médico y seguridad en cada paso.
          </p>
        </div>

        <div className="mx-auto max-w-5xl chat-shell overflow-hidden">
          <div className="chat-header flex items-center gap-3 rounded-t-[32px] px-5 py-4 text-white">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-white">
              <Image
                src="/logoperfesthetic.jpeg"
                alt="Perfestetic"
                width={40}
                height={40}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="flex-1">
              <p className="text-sm leading-tight">Perfestetic</p>
              <p className="text-xs text-white/80 flex items-center gap-2">
                <span className="status-dot" aria-hidden />
                en línea
              </p>
            </div>
            <div className="flex gap-2 text-white/80 items-center">
              <span className="h-2 w-2 rounded-full bg-emerald-300 status-dot" aria-hidden />
              <span className="text-xs flex items-center gap-1">
                <svg className="w-3.5 h-3.5 status-blink" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 3l9 5v8l-9 5-9-5V8l9-5zm0 2.18L5 9v6l7 3.82L19 15V9l-7-3.82z" />
                </svg>
                Cifrado
              </span>
              <div className="hidden sm:flex items-center gap-3 ml-3 text-white/80">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="6" width="12" height="12" rx="2" ry="2" />
                  <path d="M16 10l4-2v8l-4-2" />
                </svg>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.07 2h3a2 2 0 0 1 2 1.72c.12.86.37 1.7.73 2.49a2 2 0 0 1-.45 2.11L8.09 9.59a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.79.36 1.63.61 2.49.73A2 2 0 0 1 22 16.92Z" />
                </svg>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="chat-body space-y-4 sm:space-y-5 px-3 sm:px-6 md:px-8 py-6">
            {messages.map((msg, idx) => (
              <div
                key={`${msg.name}-${msg.time}`}
                className={`flex ${msg.side === "right" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`bubble max-w-xl rounded-2xl px-4 py-3 text-sm shadow-lg ${
                    msg.side === "right"
                      ? "bg-[#d9fdd3] text-gray-800"
                      : "bg-white/95 text-gray-800"
                  }`}
                  style={{ animationDelay: delays[idx] }}
                >
                  <p className="mb-1 font-semibold text-[#1f5b3b] flex items-center gap-2">
                    {msg.name}
                    <span className="text-[10px] font-normal text-gray-500">{msg.time}</span>
                  </p>
                  <p className="leading-relaxed">
                    <Highlighted text={msg.text} highlight={msg.highlight} />
                  </p>
                  {msg.side === "right" && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-500">
                      <svg className="w-4 h-4 text-[#53bdeb]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 12.5l1.5 1.5L11 11m2 3l1.5 1.5L17 11" />
                      </svg>
                      <span>Entregado</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/70 px-5 py-4 text-sm text-gray-600 bg-white/70 backdrop-blur-md">
            <span className="hidden sm:inline">¿Quieres tu resultado por WhatsApp?</span>
            <a
              href={generateWhatsAppURL("general")}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-whatsapp inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-white font-semibold shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
              </svg>
              Responder por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
