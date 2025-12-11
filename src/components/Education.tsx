"use client";

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

export default function Education() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Educación y cuidado</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explicaciones claras, basadas en práctica médica, para que tomes decisiones seguras y tengas una recuperación tranquila.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {topics.map((topic) => (
            <div
              key={topic.title}
              className="h-full rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/60 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{topic.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{topic.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
