"use client";

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
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3">Testimonios en WhatsApp</h2>
          <div className="w-24 h-1 bg-[#25D366] mx-auto rounded-full mb-4" />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Conversaciones reales que muestran resultados, acompañamiento médico y seguridad en cada paso.
          </p>
        </div>

        <div className="mx-auto max-w-5xl rounded-[28px] border border-gray-100 bg-white shadow-2xl shadow-gray-200/70">
          <div className="flex items-center gap-3 rounded-t-[28px] bg-[#ff8fc7] px-5 py-4 text-white">
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
              <p className="text-xs text-white/80">en línea</p>
            </div>
            <div className="flex gap-2 text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden />
              <span className="text-xs">Cifrado</span>
            </div>
          </div>

          <div className="space-y-4 bg-gradient-to-b from-[#fde5f7] via-[#fcd5f0] to-[#fbe1f5] px-4 py-6 sm:px-8">
            {messages.map((msg) => (
              <div
                key={`${msg.name}-${msg.time}`}
                className={`flex ${msg.side === "right" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xl rounded-2xl px-4 py-3 text-sm shadow-lg ${
                    msg.side === "right"
                      ? "bg-[#d9fdd3] text-gray-800"
                      : "bg-white text-gray-800"
                  }`}
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
                      <svg className="w-4 h-4 text-[#34b7f1]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 12.5l1.5 1.5L11 11m2 3l1.5 1.5L17 11" />
                      </svg>
                      <span>Entregado</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 text-sm text-gray-600">
            <span className="hidden sm:inline">¿Quieres tu resultado por WhatsApp?</span>
            <a
              href={generateWhatsAppURL("general")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-white font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
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
