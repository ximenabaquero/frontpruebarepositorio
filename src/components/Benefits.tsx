"use client";

import { generateWhatsAppURL } from "@/utils/whatsapp";
import Image from "next/image";

export default function Benefits() {
  const benefits = [
    {
      icon: (
        <Image 
          src="/cinturasin.png" 
          alt="Tecnología avanzada" 
          width={80}
          height={80}
          className="object-contain"
        />
      ),
      title: "Tecnología avanzada",
      description: "Láser lipólisis + láser diodo + soft laser para esculpir con precisión, estimular colágeno y proteger la piel."
    },
    {
      icon: (
        <Image 
          src="/recuperacionrapidasin.png" 
          alt="Acompañamiento médico" 
          width={80}
          height={80}
          className="object-contain"
        />
      ),
      title: "Acompañamiento médico",
      description: "Protocolos personalizados, seguimiento cercano y prevención de fibrosis para una recuperación guiada y segura."
    },
    {
      icon: (
        <Image 
          src="/backwomansin.png" 
          alt="Resultados inmediatos" 
          width={80}
          height={80}
          className="object-contain"
        />
      ),
      title: "Resultados visibles",
      description: "Cambios desde la primera sesión: menos volumen, mejor definición y piel más firme."
    },
    {
      icon: (
        <Image 
          src="/recuperacionrapidasin.png" 
          alt="Recuperación rápida" 
          width={80}
          height={80}
          className="object-contain"
        />
      ),
      title: "Recuperación rápida",
      description: "Procedimientos sin incapacidad ni dolor post, para retomar tus actividades el mismo día."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            ¿Por qué elegir Perfestetic?
          </h2>
          <div className="w-24 h-1 bg-[#e495ca] mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre las ventajas de nuestros tratamientos y por qué somos la mejor opción para tu transformación
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center group"
            >
              <div className="bg-gradient-to-r from-[#feb3c7] to-[#feb3c7] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-white">
                  {benefit.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
              
              {/* Decorative element */}
              <div className="mt-6">
                <div className="w-12 h-1 bg-gradient-to-r from-[#b659b0] to-[#ad44a1] mx-auto rounded-full opacity-50"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ¿Listo para comenzar tu transformación?
            </h3>
            <p className="text-gray-600 mb-6">
              Agenda tu consulta gratuita y descubre cómo podemos ayudarte a conseguir el cuerpo que siempre has deseado.
            </p>
            <a
              href={generateWhatsAppURL("benefits")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20b358] text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}