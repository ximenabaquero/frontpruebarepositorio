"use client";

import { useState, type MouseEvent } from "react";
import { ChevronDown, HelpCircle, MessageCircle, Sparkles } from "lucide-react";

const faqs = [
  {
    question: "¿Cuánto tiempo después de la lipólisis veré resultados finales?",
    answer: "Aunque notarás cambios inmediatos, el resultado definitivo se aprecia entre los 3 y 6 meses. La piel necesita tiempo para retraerse y la inflamación residual debe desaparecer por completo."
  },
  {
    question: "¿Es doloroso el proceso de recuperación?",
    answer: "Más que dolor, se suele sentir una sensación similar a las agujetas intensas tras hacer ejercicio. El uso de analgésicos recetados y el drenaje linfático temprano ayudan a minimizar cualquier molestia significativamente."
  },
  {
    question: "¿Qué pasa si no uso la faja el tiempo indicado?",
    answer: "No usar la faja aumenta el riesgo de irregularidades en la piel, mayor inflamación y la formación de seromas. La faja es el 'molde' que garantiza que la piel se adhiera correctamente al nuevo contorno."
  },
  {
    question: "¿La grasa extraída puede volver a aparecer?",
    answer: "Los adipocitos extraídos no se regeneran. Sin embargo, las células grasas restantes pueden aumentar de tamaño si no se mantiene un estilo de vida saludable. Los resultados son permanentes si cuidas tu peso."
  },
  {
    question: "¿Cuándo puedo retomar mis actividades físicas?",
    answer: "Caminatas suaves son recomendables desde el segundo día. El ejercicio de alta intensidad suele retomarse a partir de la 4ª o 6ª semana, dependiendo de la evolución médica."
  }
];

const scrollToSection = (sectionId: string, event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-white to-blue-50/30">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header con gradiente azul/esmeralda */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-blue-100 mb-6">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-wider">
              Resolviendo tus dudas
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900">Preguntas</span>{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Frecuentes
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Información esencial para que te sientas seguro en cada etapa de tu transformación.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`group border rounded-2xl transition-all duration-500 overflow-hidden ${
                  isOpen 
                  ? "border-blue-200 bg-white shadow-xl shadow-blue-500/5" 
                  : "border-gray-100 bg-white/80 hover:border-blue-200 hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left outline-none"
                >
                  <span className={`font-bold text-lg transition-colors duration-300 ${
                    isOpen ? "text-blue-600" : "text-gray-700 group-hover:text-emerald-600"
                  }`}>
                    {faq.question}
                  </span>
                  
                  {/* Icono con fondo dinámico */}
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ${
                    isOpen ? "bg-gradient-to-r from-emerald-500 to-blue-600 rotate-180" : "bg-gray-100"
                  }`}>
                    <ChevronDown className={`w-5 h-5 transition-colors ${
                      isOpen ? "text-white" : "text-gray-400"
                    }`} />
                  </div>
                </button>
                
                <div 
                  className={`transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-8 text-gray-600 leading-relaxed relative">
                    {/* Línea decorativa con gradiente */}
                    <div className="h-px w-full bg-gradient-to-r from-emerald-100 to-blue-100 mb-6" />
                    <p className="relative z-10">{faq.answer}</p>
                    
                    {/* Sutil mancha de color de fondo */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner inferior tipo CTA */}
        <div className="mt-16 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-600/10 blur-xl rounded-3xl group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-white border border-blue-50 p-8 rounded-3xl text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 mb-4 shadow-lg shadow-blue-200">
              <MessageCircle className="text-white w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">¿Aún tienes dudas técnicas?</h4>
            <p className="text-gray-600 mb-6">
              Cada cuerpo es único. Agenda una valoración para un plan personalizado.
            </p>
            <a
              href="#contacto"
              onClick={(event) => scrollToSection('contacto', event)}
              className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-emerald-500 transition-all duration-300 active:scale-95 group"
            >
              Hablar con un especialista
              <Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}