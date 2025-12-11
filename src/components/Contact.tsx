"use client";

import { generateWhatsAppURL } from "@/utils/whatsapp";
import { useEffect, useRef, useState } from "react";

export default function Contact() {
  const socialLinks = [
    {
      name: 'WhatsApp',
      href: 'https://wa.me/573224042286',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      ),
      color: 'bg-[#25D366] hover:bg-[#20b358]',
      description: '+57 (322) 404-2286'
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/perfestetic',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'bg-[#1877F2] hover:bg-[#166fe5]',
      description: '@perfestetic'
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/perfe_stetic?igsh=MXNuMzI2ZmwxenJtbw==',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.52.204 5.036.389a3.232 3.232 0 0 0-1.172.762A3.212 3.212 0 0 0 3.102 2.32c-.185.484-.307 1.058-.341 2.006C2.726 5.274 2.714 5.681 2.714 9.302c0 3.621.012 4.028.047 4.976.034.948.156 1.522.341 2.006.168.442.39.815.762 1.172.357.372.73.594 1.172.762.484.185 1.058.307 2.006.341.948.035 1.355.047 4.976.047 3.621 0 4.028-.012 4.976-.047.948-.034 1.522-.156 2.006-.341a3.232 3.232 0 0 0 1.172-.762 3.212 3.212 0 0 0 .762-1.172c.185-.484.307-1.058.341-2.006.035-.948.047-1.355.047-4.976 0-3.621-.012-4.028-.047-4.976-.034-.948-.156-1.522-.341-2.006a3.228 3.228 0 0 0-.762-1.172A3.228 3.228 0 0 0 18.658.389c-.484-.185-1.058-.307-2.006-.341C15.704.013 15.297 0 11.676 0h.341zm-.341 1.617h.282c3.546 0 3.968.013 4.888.046.85.032 1.312.15 1.621.249.408.158.699.348 1.005.654.306.306.496.597.654 1.005.099.309.217.771.249 1.621.033.92.046 1.342.046 4.888 0 3.546-.013 3.968-.046 4.888-.032.85-.15 1.312-.249 1.621-.158.408-.348.699-.654 1.005a2.709 2.709 0 0 1-1.005.654c-.309.099-.771.217-1.621.249-.92.033-1.342.046-4.888.046-3.547 0-3.968-.013-4.888-.046-.85-.032-1.312-.15-1.621-.249a2.709 2.709 0 0 1-1.005-.654 2.709 2.709 0 0 1-.654-1.005c-.099-.309-.217-.771-.249-1.621-.033-.92-.046-1.342-.046-4.888 0-3.546.013-3.968.046-4.888.032-.85.15-1.312.249-1.621.158-.408.348-.699.654-1.005a2.709 2.709 0 0 1 1.005-.654c.309-.099.771-.217 1.621-.249.807-.03 1.119-.039 3.677-.043v.045zm7.44 1.459a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0zM7.775 6.242a5.757 5.757 0 1 1 11.514 0 5.757 5.757 0 0 1-11.514 0zm1.617 0a4.14 4.14 0 1 0 8.28 0 4.14 4.14 0 0 0-8.28 0z"/>
        </svg>
      ),
      color: 'bg-gradient-to-r from-[#E4405F] to-[#F77737] hover:from-[#d73653] hover:to-[#f56729]',
      description: '@perfestetic'
    }
  ];

	const [visible, setVisible] = useState<boolean[]>(() => socialLinks.map(() => false));
	const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = Number((entry.target as HTMLElement).dataset.index);
						setVisible((prev) => prev.map((v, i) => (i === index ? true : v)));
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
		);

		cardsRef.current.forEach((card) => {
			if (card) observer.observe(card);
		});

		return () => observer.disconnect();
	}, []);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight mb-4">
            Contáctanos
          </h2>
          <div className="decor-line" aria-hidden />
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Estamos aquí para resolver tus dudas y diseñar un plan con precisión médica y calidez humana.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {socialLinks.map((link, index) => (
              <a
                key={link.name}
                data-index={index}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group soft-gradient-border contact-card ${visible[index] ? "is-visible" : ""}`}
              >
                <div className="soft-gradient-border__inner card-sheen rounded-3xl p-8 text-center h-full relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none opacity-40 bg-gradient-to-br from-white/50 via-transparent to-white/30" aria-hidden />
                  <div className={`relative mx-auto mb-5 w-16 h-16 rounded-full ${link.color} flex items-center justify-center shadow-[0_18px_45px_rgba(214,150,200,0.28)] transition-transform duration-300 group-hover:scale-110`}>
                    <span className="contact-icon relative text-white">
                      <span className="contact-icon-ring" />
                      {link.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{link.name}</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">{link.description}</p>
                  <div className="inline-flex items-center text-[#b6598c] font-semibold group-hover:text-[#ad4496] transition-colors">
                    Contactar
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="cta-banner rounded-3xl p-8 sm:p-12 text-white text-center shadow-[0_30px_80px_rgba(168,118,189,0.32)] relative overflow-hidden">
            <div className="absolute inset-0 bg-white/8" aria-hidden />
            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl font-semibold mb-5 tracking-tight">¡Comienza tu transformación hoy!</h3>
              <p className="text-lg sm:text-xl mb-7 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Agenda tu consulta gratuita y descubre cómo la lipólisis láser y nuestros protocolos médicos pueden cambiar tu perfil corporal.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={generateWhatsAppURL("contact")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-button-animated inline-flex items-center gap-3 bg-[#25D366] px-6 sm:px-8 py-3.5 rounded-full text-white font-semibold text-base sm:text-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                  </svg>
                  Consulta gratuita
                </a>

                <span className="text-white/80 text-sm">o</span>

                <a
                  href="tel:+573224042286"
                  className="cta-button-animated inline-flex items-center gap-3 bg-white/90 text-[#b14ccf] px-6 sm:px-8 py-3.5 rounded-full font-semibold text-base sm:text-lg shadow-[0_18px_42px_rgba(255,255,255,0.22)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Llamar ahora
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16 pt-10 border-t border-gray-200">
          <div className="mb-4">
            <h3 className="text-2xl font-semibold text-[#b977a3] mb-1">Perfestetic</h3>
            <p className="text-slate-600">Tu belleza, nuestra pasión</p>
          </div>

          <div className="flex justify-center flex-wrap gap-4 mb-6">
            {socialLinks.map((link) => (
              <a
                key={`footer-${link.name}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link.color} footer-icon p-3 rounded-full`}
              >
                <div className="text-white">
                  {link.icon}
                </div>
              </a>
            ))}
          </div>

          <p className="text-gray-500 text-sm">© 2024 Perfestetic. Todos los derechos reservados.</p>
        </div>
      </div>
    </section>
  );
}