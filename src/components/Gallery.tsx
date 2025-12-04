"use client";

"use client";

import { generateWhatsAppURL } from "@/utils/whatsapp";

export default function Gallery() {
  // Placeholder data - in a real app, these would be actual before/after images
  const beforeAfterGallery = [
    {
      id: 1,
      before: "/antes-despues/imagen1-antes.jpg",
      after: "/antes-despues/imagen1-despues.jpg",
      area: "Moldeamiento Corporal",
      duration: "Reducción de grasa localizada",
    },
    {
      id: 2,
      before: "/antes-despues/imagen2-antes.jpg",
      after: "/antes-despues/imagen2-despues.jpg",
      area: "Moldeamiento Corporal",
      duration: "Esculpido de cintura/abdomen",
    },
    {
      id: 3,
      before: "/antes-despues/imagen3-antes.jpg",
      after: "/antes-despues/imagen3-despues.jpg",
      area: "Moldeamiento Corporal",
      duration: "Reducción y firmeza",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Resultados Reales
          </h2>
          <div className="w-24 h-1 bg-[#b659a0] mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre las transformaciones increíbles que hemos logrado con
            nuestros pacientes
          </p>
        </div>

        {/* Gallery Content */}
        <div className="max-w-6xl mx-auto">
          {/* Before/After Gallery */}
          <div className="grid md:grid-cols-3 gap-8">
            {beforeAfterGallery.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.area}
                  </h3>
                  <p className="text-sm text-[#b659a8] font-semibold">
                    {item.duration}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      ANTES
                    </p>
                    <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-48 flex items-center justify-center shadow-inner">
                      {/*<div className="text-center text-gray-500">
                        <svg
                          className="w-12 h-12 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-xs">Imagen Antes</p>
                      </div>*/}
                      <img
                        src={item.before}
                        alt={`Antes - ${item.area}`}
                        className="rounded-lg h-48 w-full object-cover shadow-inner"
                      />
                    </div>
                  </div>

                  {/* After */}
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      DESPUÉS
                    </p>
                    <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg h-48 flex items-center justify-center shadow-inner">
                      {/*<div className="text-center text-green-600">
                        <svg
                          className="w-12 h-12 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-xs">Imagen Después</p>
                      </div>*/}
                      <img
                        src={item.after}
                        alt={`Después - ${item.area}`}
                        className="rounded-lg h-48 w-full object-cover shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Results badge */}
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#9b59b6] text-white">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Resultado Exitoso
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Section */}
          <div className="mt-16 bg-gradient-to-r from-[#b659a3] to-[#ad448a] rounded-3xl p-8 sm:p-12 text-white text-center">
            <div className="max-w-3xl mx-auto">
              <svg
                className="w-12 h-12 text-white opacity-50 mx-auto mb-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
              </svg>

              <blockquote className="text-xl sm:text-2xl font-light mb-6 leading-relaxed">
                &ldquo;Los resultados superaron todas mis expectativas. El
                equipo de Perfestetic es increíble y la tecnología realmente
                funciona. ¡Recomiendo totalmente este tratamiento!&rdquo;
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">MR</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold">María Rodríguez</p>
                  <p className="text-sm opacity-80">Cliente satisfecha</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">
              ¿Quieres ser el próximo en lograr estos resultados?
            </p>
            <a
              href={generateWhatsAppURL("gallery")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20b358] text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              Agenda tu Consulta
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
