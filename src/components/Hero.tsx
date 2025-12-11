"use client";

import { colors } from "@/config/colors";
import Image from "next/image";
import { generateWhatsAppURL } from "@/utils/whatsapp";

export default function Hero() {
  return (
    <section
      className="hero-section relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(250, 215, 242, 0.8), rgba(248, 249, 250, 0.8)), url('/logoperfesthetic.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: colors.background
      }}
    >
      <div className="hero-backdrop" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex justify-center mb-6 hero-logo-wrapper group">
              <div className="hero-logo-ring">
                <Image
                  src="/logoperfesthetic.jpeg"
                  alt="Perfestetic Logo"
                width={300}
                height={200}
                  className="hero-logo h-32 sm:h-40 lg:h-48 w-32 sm:w-40 lg:w-48 object-cover rounded-full shadow-lg"
                priority
                />
              </div>
            </div>
            <div 
              className="hero-divider w-24 h-1 mx-auto rounded-full"
              style={{ backgroundColor: colors.secondary }}
            ></div>
          </div>
          
          {/* Slogan */}
          <div className="mb-12">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-light mb-4"
              style={{ color: colors.foreground }}
            >
              Lipólisis láser sin cirugía, resultados desde la primera sesión
            </h2>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto"
              style={{ color: colors.foreground, opacity: 0.86 }}
            >
              Eliminamos grasa localizada sin dolor ni incapacidad, reafirmamos la piel y te devolvemos la firmeza con tecnología láser médica segura y controlada. Agenda hoy tu evaluación y siente el cambio.
            </p>
          </div>
          
          {/* WhatsApp Button */}
          <div className="flex justify-center">
            <a
              href={generateWhatsAppURL("hero")}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-whatsapp-btn relative overflow-hidden text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 text-lg"
              style={{ backgroundColor: colors.whatsapp }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.whatsappHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.whatsapp}
            >
              <span className="hero-whatsapp-btn__glow" aria-hidden />
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Agenda tu evaluación por WhatsApp
            </a>
          </div>
          
          {/* Decorative elements */}
          <div 
            className="hero-orb hero-orb--left absolute top-10 left-10 w-20 h-20 rounded-full blur-xl"
            style={{ backgroundColor: colors.strongpink, opacity: 0.12 }}
          ></div>
          <div 
            className="hero-orb hero-orb--right absolute bottom-10 right-10 w-32 h-32 rounded-full blur-xl"
            style={{ backgroundColor: colors.secondary, opacity: 0.12 }}
          ></div>
        </div>
      </div>
    </section>
  );
}