const services = [
  {
    title: "Lipólisis láser",
    description: "Moldea y elimina grasa localizada con energía láser de precisión, sin cirugía ni incapacidad.",
    benefit: "Resultados visibles desde la primera sesión",
  },
  {
    title: "Tensamax",
    description: "Tecnología avanzada que estimula colágeno y elastina para una piel más firme y definida.",
    benefit: "Efecto tensor inmediato y progresivo",
  },
  {
    title: "Ácido hialurónico",
    description: "Hidratación profunda y volumen natural para armonizar rasgos sin perder expresividad.",
    benefit: "Resultados naturales y seguros",
  },
  {
    title: "Hilos tensores",
    description: "Reafirma y levanta tejidos con bioestimulación de colágeno, sin quirófano.",
    benefit: "Efecto lifting y estimulación de colágeno",
  },
  {
    title: "Plasma rico en plaquetas",
    description: "Regenera y mejora textura cutánea con tus propios factores de crecimiento.",
    benefit: "Mejora de textura y luminosidad",
  },
  {
    title: "Botox",
    description: "Suaviza líneas de expresión manteniendo gestos naturales con técnica precisa.",
    benefit: "Resultados naturales y controlados",
  },
];

export default function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Nuestros Servicios
          </h2>
          <div className="decor-line" aria-hidden />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tratamientos médicos con tecnología avanzada, enfoque personalizado y resultados visibles.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group/card soft-gradient-border shadow-2xl card-hover-elevate"
              >
                <div className="card-sheen relative h-full rounded-[22px] bg-white/25 backdrop-blur-[12px] border border-white/40 p-6 shadow-lg">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-[#f7e2f5] px-3 py-1 text-xs font-semibold text-[#b14ccf]">
                    {service.title}
                  </div>
                  <p className="text-gray-800 text-lg font-semibold mb-3">{service.title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                  <div className="flex items-center gap-2 text-[#1fa76b] text-sm font-semibold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{service.benefit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
