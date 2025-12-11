"use client";

import { generateWhatsAppURL } from "@/utils/whatsapp";

const testimonials = [
  {
    name: "Carolina G.",
    time: "Hoy 10:14 a. m.",
    message:
      "18 días después y el resultado es genial. Me siento feliz frente al espejo, la cintura se marcó un montón.",
    highlight: "18 días después y el resultado es genial",
  },
  {
    name: "María P.",
    time: "Ayer 7:52 p. m.",
    message:
      "Gracias por la seguridad y acompañamiento. No sentí dolor y ya veo la piel más firme desde la primera sesión.",
    highlight: "Gracias por la seguridad y acompañamiento",
  },
  {
    name: "Laura C.",
    time: "Lun 4:21 p. m.",
    message:
      "Me siento feliz frente al espejo. La grasa localizada bajó y el abdomen está más liso sin incapacidad.",
    highlight: "Me siento feliz frente al espejo",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Testimonios en WhatsApp
          </h2>
          <div className="w-24 h-1 bg-[#25D366] mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Conversaciones reales que reflejan resultados visibles, acompañamiento médico y seguridad en cada paso.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.highlight}
              className="rounded-3xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg shadow-gray-200/60"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366] font-semibold">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.time}</p>
                  <p className="text-base font-semibold text-gray-800">{item.name}</p>
                </div>
              </div>

              <div className="relative rounded-2xl bg-[#E7F7ED] p-4 text-gray-800 shadow-inner">
                <div className="absolute -left-2 top-4 h-4 w-4 rotate-45 bg-[#E7F7ED]" aria-hidden />
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold text-[#1fa76b]">{item.highlight}.</span> {" "}
                  {item.message.replace(item.highlight, "").trim()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={generateWhatsAppURL("testimonials")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-3 text-white font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
            </svg>
            Quiero una valoración por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
